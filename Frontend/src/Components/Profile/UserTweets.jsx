import React from "react";

function UserTweets({ user }) {
  return (
    <div className="bg-gray-700 p-3 sm:p-5 rounded-lg shadow-lg mx-auto w-full max-h-[70vh] overflow-y-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
        Your Tweets
      </h2>
      {user.mytweets && user.mytweets.length > 0 ? (
        user.mytweets.map((tweet, index) => (
          <div
            key={index}
            className="bg-gray-900 p-4 sm:p-6 mb-6 sm:mb-10 rounded-lg shadow-md w-full"
          >
            <div className="flex flex-row-reverse items-center justify-between mb-3">
              <span className="text-gray-400 text-sm sm:text-lg">
                {new Date(tweet.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-white mb-4 text-base sm:text-xl break-words">
              {tweet.content}
            </p>
            {tweet.image && (
              <img
                src={tweet.image}
                alt="Tweet"
                className="rounded-lg mb-4 max-w-full h-auto object-cover"
              />
            )}
          </div>
        ))
      ) : (
        <div className="text-gray-400 text-center py-4">
          No tweets available
        </div>
      )}
    </div>
  );
}

export default UserTweets;
