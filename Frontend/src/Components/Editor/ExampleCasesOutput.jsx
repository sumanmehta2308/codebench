import React, { useState } from "react";

function ExampleCasesOutput({ exampleCasesExecution }) {
  const [visibleIndex, setVisibleIndex] = useState(0);

  // BUG FIX: exampleCasesExecution service se seedha data array mil raha hai
  if (!exampleCasesExecution) {
    return (
      <div className="text-gray-400 p-4">Run your code to see results...</div>
    );
  }

  // Check if it's an array (Correct data structure from CodeRun.service.js)
  const testResults = Array.isArray(exampleCasesExecution)
    ? exampleCasesExecution
    : exampleCasesExecution.data || []; // Fallback for safety

  if (testResults.length === 0) {
    return (
      <div className="text-red-400 p-4 font-bold text-xl bg-gray-900 rounded-lg">
        ❌ No test results found. Check backend routes.
      </div>
    );
  }

  return (
    <>
      <h3 className="text-2xl font-extrabold text-white mb-4">
        Execution Results
      </h3>
      <div className="flex flex-wrap mb-6">
        {testResults.map((execution, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg font-bold mr-2 mb-2 transition-all duration-300 ease-in-out flex items-center text-white ${
              visibleIndex === index ? "bg-blue-600 shadow-lg" : "bg-gray-800"
            }`}
            onClick={() => setVisibleIndex(index)}
          >
            {execution.isMatch ? (
              <span className="mr-2 text-green-400">✅</span>
            ) : (
              <span className="mr-2 text-red-500">❌</span>
            )}
            Test Case {index + 1}
          </button>
        ))}
      </div>

      {testResults[visibleIndex] && (
        <div
          className={`p-6 rounded-lg shadow-md text-white transition-all duration-500 ease-in-out ${
            testResults[visibleIndex].isMatch ? "bg-green-900" : "bg-red-900"
          }`}
        >
          <h4 className="font-semibold text-lg mb-4">
            Test Case {visibleIndex + 1}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-sm">
            <div className="flex-1">
              <span className="text-gray-400 block mb-1">Input:</span>
              <pre className="bg-black bg-opacity-50 p-3 rounded-lg overflow-auto">
                {testResults[visibleIndex].input}
              </pre>
            </div>
            <div className="flex-1">
              <span className="text-gray-400 block mb-1">Expected Output:</span>
              <pre className="bg-black bg-opacity-50 p-3 rounded-lg overflow-auto">
                {testResults[visibleIndex].expectedOutput}
              </pre>
            </div>
            <div className="flex-1">
              <span className="text-gray-400 block mb-1">Actual Output:</span>
              <pre className="bg-black bg-opacity-50 p-3 rounded-lg overflow-auto">
                {testResults[visibleIndex].actualOutput}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ExampleCasesOutput;
