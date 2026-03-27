import React, { useState } from "react";

function SampleCases({ example_cases }) {
  const [visibleIndex, setVisibleIndex] = useState(0);

  if (!example_cases || example_cases.length === 0) return null;

  return (
    <div className="w-full">
      <div>
        <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
          Example Cases
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {example_cases.map((x, index) => (
            <button
              key={index}
              className={`px-3 py-2 md:py-1 rounded-lg text-sm md:text-base flex-1 sm:flex-none ${
                visibleIndex === index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-500 text-gray-300"
              }`}
              onClick={() => setVisibleIndex(index)}
            >
              Test Case {index + 1}
            </button>
          ))}
        </div>

        {example_cases.map((example, index) =>
          visibleIndex === index ? (
            <div
              key={index}
              className="bg-gray-700 p-4 rounded-lg mb-4 shadow-md w-full overflow-hidden"
            >
              <h4 className="text-white font-semibold mb-2 text-sm md:text-base">
                Example {index + 1}
              </h4>
              <div className="flex flex-col sm:flex-row sm:space-x-4 gap-4 sm:gap-0">
                <div className="flex-1 w-full overflow-hidden">
                  <span className="text-gray-300 font-semibold text-sm md:text-base">
                    Input:
                  </span>
                  <pre className="bg-black text-white p-3 md:p-2 rounded-lg mt-1 overflow-x-auto whitespace-pre-wrap text-xs md:text-sm w-full">
                    {example.input}
                  </pre>
                </div>
                <div className="flex-1 mt-2 sm:mt-0 w-full overflow-hidden">
                  <span className="text-gray-300 font-semibold text-sm md:text-base">
                    Expected Output:
                  </span>
                  <pre className="bg-black text-white p-3 md:p-2 rounded-lg mt-1 overflow-x-auto whitespace-pre-wrap text-xs md:text-sm w-full">
                    {example.output}
                  </pre>
                </div>
              </div>
              {example.explanation && (
                <div className="text-gray-200 my-3 md:my-2 text-sm md:text-base">
                  <em>{example.explanation}</em>
                </div>
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
export default SampleCases;
