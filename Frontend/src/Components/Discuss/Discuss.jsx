import React, { useEffect, useState } from "react";
import { fetchTweets } from "../../Services/Tweet.service";
import Reply from "./Reply";
import Loading from "../Loading/Loading.jsx";

const Discuss = () => {
  const [tweets, setTweets] = useState(null);
  const [replyToTweetId, setReplyToTweetId] = useState(null);
  const [hasNewReply, setHasNewReply] = useState(false);

  useEffect(() => {
    const helper = async () => {
      const response = await fetchTweets();
      setTweets(response);
    };
    helper();
  }, [replyToTweetId, hasNewReply]);

  if (tweets === null) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-800 text-white p-4 md:p-10">
      <div className="bg-gray-900 p-4 md:p-8 mb-6 rounded-xl shadow-lg">
        <Reply onReplySuccess={() => setHasNewReply(!hasNewReply)} />
      </div>

      <div className="bg-gray-900 p-4 md:p-8 rounded-lg shadow-lg mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Recent Tweets
        </h2>
        <div className="space-y-6">
          {tweets && tweets.length > 0 ? (
            tweets.map((tweet, index) => (
              <div
                key={index}
                className="bg-gray-700 p-4 md:p-6 rounded-lg shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                  <div className="flex flex-row items-center">
                    {tweet?.owner?.avatar && (
                      <img
                        src={tweet.owner.avatar}
                        alt="User Avatar"
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-3 md:mr-4 mb-2 md:mb-0"
                      />
                    )}
                    <span className="text-white font-semibold text-sm md:text-base">
                      {tweet.owner?.username || "Unknown User"}
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm md:text-lg">
                    {new Date(tweet.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-white mb-4 text-base md:text-xl">
                  {tweet.content}
                </p>
                {tweet.image && (
                  <img
                    src={tweet.image}
                    alt="Tweet"
                    className="rounded-lg mb-4 max-w-full h-auto"
                  />
                )}

                {tweet.replys && tweet.replys.length > 0 && (
                  <div className="ml-2 md:ml-8 mt-4 bg-gray-900 p-4 md:p-8 rounded-lg shadow-2xl mb-6 overflow-hidden">
                    <h3 className="text-white text-base md:text-lg mb-3">
                      Replies:
                    </h3>
                    {tweet.replys.map((reply, replyIndex) => (
                      <div
                        key={replyIndex}
                        className="bg-gray-600 p-3 md:p-4 rounded-lg shadow-md mb-3"
                      >
                        <div className="flex flex-row-reverse">
                          <div className="flex items-center mb-2">
                            {reply?.owner?.avatar && (
                              <img
                                src={reply.owner.avatar}
                                alt="Reply Owner Avatar"
                                className="w-6 h-6 md:w-8 md:h-8 rounded-full mr-2 md:mr-3"
                              />
                            )}
                            <span className="text-white font-semibold text-sm md:text-base">
                              {reply.owner?.username || "Unknown User"}
                            </span>
                          </div>
                        </div>
                        <p className="text-white mb-2 text-sm md:text-base">
                          {reply.content}
                        </p>
                        <span className="text-gray-400 text-xs md:text-sm">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {replyToTweetId === tweet._id && (
                  <Reply
                    replyOf={replyToTweetId}
                    onReplySuccess={() => {
                      setHasNewReply(!hasNewReply);
                      setReplyToTweetId(null);
                    }}
                  />
                )}

                <div className="flex flex-col sm:flex-row-reverse mt-4">
                  <button
                    onClick={() =>
                      setReplyToTweetId(
                        replyToTweetId === tweet._id ? null : tweet._id
                      )
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 md:py-1 px-10 rounded-lg transition duration-200 w-full sm:w-auto"
                  >
                    {replyToTweetId === tweet._id ? "Cancel" : "Reply"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center">No tweets available</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Discuss;
