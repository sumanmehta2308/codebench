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
      try {
        const response = await fetchTweets();
        setTweets(response || []); // Ensure tweets is at least an empty array
      } catch (error) {
        console.error("Failed to fetch tweets:", error);
        setTweets([]);
      }
    };
    helper();
  }, [replyToTweetId, hasNewReply]);

  if (tweets === null) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-800 text-white p-4 md:p-10">
      <div className="bg-gray-900 p-4 md:p-8 mb-6 rounded-xl shadow-lg mx-auto max-w-4xl">
        <Reply onReplySuccess={() => setHasNewReply(!hasNewReply)} />
      </div>

      <div className="bg-gray-900 p-4 md:p-8 rounded-lg shadow-lg mx-auto w-full max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Recent Discussions
        </h2>
        <div className="space-y-6">
          {tweets.length > 0 ? (
            tweets.map((tweet, index) => (
              <div
                key={tweet._id || index}
                className="bg-gray-700 p-4 md:p-6 rounded-lg shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                  <div className="flex flex-row items-center">
                    <img
                      src={tweet.owner?.avatar || "/defaultuser.png"}
                      alt="User Avatar"
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full mr-3 md:mr-4"
                    />
                    <span className="text-white font-semibold text-sm md:text-base">
                      {tweet.owner?.username || "Unknown User"}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs md:text-sm">
                    {tweet.createdAt
                      ? new Date(tweet.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                <p className="text-white mb-4 text-base md:text-xl break-words">
                  {tweet.content}
                </p>

                {tweet.image && (
                  <img
                    src={tweet.image}
                    alt="Tweet Attachment"
                    className="rounded-lg mb-4 max-w-full h-auto"
                  />
                )}

                {/* REPLIES SECTION */}
                {tweet.replys && tweet.replys.length > 0 && (
                  <div className="ml-2 md:ml-8 mt-4 bg-gray-900 p-4 rounded-lg space-y-3">
                    {tweet.replys.map((reply, rIndex) => (
                      <div
                        key={reply._id || rIndex}
                        className="bg-gray-600 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <img
                            src={reply.owner?.avatar || "/defaultuser.png"}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-blue-300 text-xs font-bold">
                            {reply.owner?.username}
                          </span>
                        </div>
                        <p className="text-white text-sm">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {replyToTweetId === tweet._id && (
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                    <Reply
                      replyOf={replyToTweetId}
                      onReplySuccess={() => {
                        setHasNewReply(!hasNewReply);
                        setReplyToTweetId(null);
                      }}
                    />
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() =>
                      setReplyToTweetId(
                        replyToTweetId === tweet._id ? null : tweet._id
                      )
                    }
                    className="btn btn-primary btn-sm px-8"
                  >
                    {replyToTweetId === tweet._id ? "Cancel" : "Reply"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-10">
              No discussions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Discuss;
