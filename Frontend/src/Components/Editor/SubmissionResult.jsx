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
    <div className={`p-4 rounded-md shadow-md ${messageStyle} text-white`}>
      <div className="flex items-center space-x-3 pb-3">
        <span className="text-3xl">{icon}</span>
        <h1 className="text-2xl font-extrabold">{resultMessage}</h1>
      </div>

      {!isCorrect && failedTest && (
        <div className="mt-2 bg-black bg-opacity-30 p-4 rounded-lg">
          <h2 className="font-bold text-yellow-400 mb-2">
            Failed Test Case Details:
          </h2>
          <div className="grid grid-cols-1 gap-2 text-sm font-mono">
            <div>
              <span className="text-gray-400">Input:</span>
              <pre className="bg-black p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap">
                {failedTest.input}
              </pre>
            </div>
            <div>
              <span className="text-gray-400">Expected Output:</span>
              <pre className="bg-black p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap text-green-400">
                {failedTest.expectedOutput}
              </pre>
            </div>
            <div>
              <span className="text-gray-400">Actual Output:</span>
              <pre className="bg-black p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap text-red-400">
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
