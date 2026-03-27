import React from "react";

function ProblemStats({ user }) {
  const problems = {
    easy: 2,
    medium: 2,
    hard: 2,
  };
  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl sm:text-3xl font-bold mb-5 text-center">
        Problem Stats
      </h2>
      <div className="flex items-center mb-3 sm:mb-2">
        <span className="text-base sm:text-lg w-20 sm:w-24 text-green-400">
          Easy
        </span>
        <div className="flex-1 bg-gray-700 h-5 sm:h-6 rounded-lg relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-green-500 rounded-lg transition-all duration-500"
            style={{ width: `${(user.easyCount / problems.easy) * 100}%` }}
          />
        </div>
        <span className="ml-3 sm:ml-4 text-base sm:text-lg font-semibold w-6 text-right">
          {user.easyCount}
        </span>
      </div>

      <div className="flex items-center mb-3 sm:mb-2">
        <span className="text-base sm:text-lg w-20 sm:w-24 text-yellow-400">
          Medium
        </span>
        <div className="flex-1 bg-gray-700 h-5 sm:h-6 rounded-lg relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-yellow-500 rounded-lg transition-all duration-500"
            style={{ width: `${(user.mediumCount / problems.medium) * 100}%` }}
          />
        </div>
        <span className="ml-3 sm:ml-4 text-base sm:text-lg font-semibold w-6 text-right">
          {user.mediumCount}
        </span>
      </div>

      <div className="flex items-center">
        <span className="text-base sm:text-lg w-20 sm:w-24 text-red-400">
          Hard
        </span>
        <div className="flex-1 bg-gray-700 h-5 sm:h-6 rounded-lg relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-red-500 rounded-lg transition-all duration-500"
            style={{ width: `${(user.hardCount / problems.hard) * 100}%` }}
          />
        </div>
        <span className="ml-3 sm:ml-4 text-base sm:text-lg font-semibold w-6 text-right">
          {user.hardCount}
        </span>
      </div>
    </div>
  );
}

export default ProblemStats;
