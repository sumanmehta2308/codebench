import React from "react";

const SubmissionResult = ({ submissionStatus }) => {
  // Agar submissionStatus null hai toh display nahi karna
  if (!submissionStatus) return null;

  // Backend response structure sync: { success: boolean, data: failedTestCase || null }
  const isCorrect = submissionStatus.success;
  const failedTest = submissionStatus.data;

  const resultMessage = isCorrect ? "Correct Submission" : "Wrong Submission";
  const messageStyle = isCorrect ? "bg-green-700" : "bg-red-600";
  const icon = isCorrect ? "✅" : "❌";

  return (
    <div
      className={`p-4 md:p-6 rounded-md shadow-md ${messageStyle} text-white w-full overflow-hidden`}
    >
      <div className="flex items-center space-x-3 pb-3">
        <span className="text-2xl md:text-3xl">{icon}</span>
        <h1 className="text-xl md:text-2xl font-extrabold">{resultMessage}</h1>
      </div>

      {!isCorrect && failedTest && (
        <div className="mt-2 bg-black bg-opacity-30 p-4 rounded-lg w-full overflow-hidden">
          <h2 className="font-bold text-yellow-400 mb-2 text-sm md:text-base">
            Failed Test Case Details:
          </h2>
          <div className="grid grid-cols-1 gap-4 md:gap-2 text-xs md:text-sm font-mono w-full">
            <div className="w-full overflow-hidden">
              <span className="text-gray-400 block mb-1">Input:</span>
              <pre className="bg-black p-3 md:p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap w-full">
                {failedTest.input}
              </pre>
            </div>
            <div className="w-full overflow-hidden">
              <span className="text-gray-400 block mb-1">Expected Output:</span>
              <pre className="bg-black p-3 md:p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap text-green-400 w-full">
                {failedTest.expectedOutput}
              </pre>
            </div>
            <div className="w-full overflow-hidden">
              <span className="text-gray-400 block mb-1">Actual Output:</span>
              <pre className="bg-black p-3 md:p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap text-red-400 w-full">
                {failedTest.actualOutput || failedTest.error}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionResult;
