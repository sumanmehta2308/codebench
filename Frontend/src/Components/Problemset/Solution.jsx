import React, { useState } from "react";

function Solution({ solution }) {
  const [openSolution, setOpenSolution] = useState(null);

  // 💡 Check if solution doesn't exist or is empty
  if (!solution || Object.keys(solution).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-gray-900 rounded-xl shadow-lg border border-gray-700">
        <div className="bg-gray-800 p-6 rounded-full shadow-inner mb-6">
          <svg
            className="w-16 h-16 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>
        </div>
        <h3 className="text-3xl font-extrabold text-gray-300 mb-3 tracking-wide">
          Solution Not Provided
        </h3>
        <p className="text-gray-500 text-lg text-center max-w-md font-medium leading-relaxed">
          We haven't added an official solution for this problem yet. Trust your
          skills and try solving it yourself!
        </p>
      </div>
    );
  }

  const toggleSolution = (lang) => {
    setOpenSolution((prev) => (prev === lang ? null : lang));
  };

  return (
    <div className="bg-gray-700 rounded-xl">
      <div className="space-y-4 p-4 to-gray-800 rounded-lg shadow-lg">
        {Object.keys(solution).map((lang, index) => (
          <div
            key={index}
            className="border-l-4 border-yellow-500 px-4 py-1 bg-gray-900 rounded-lg transition-all duration-300"
          >
            <p
              className="cursor-pointer text-yellow-500 font-bold text-lg mb-2 p-4 flex justify-between items-center hover:bg-gray-800 rounded-md transition-colors"
              onClick={() => toggleSolution(lang)}
            >
              {lang.toUpperCase()} Solution
              <span
                className={`transform transition-transform duration-300 ${
                  openSolution === lang ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </p>
            {openSolution === lang && (
              <pre className="p-5 bg-black text-yellow-100 rounded-lg overflow-auto shadow-inner border border-gray-800 text-sm font-mono">
                {solution[lang]}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Solution;
