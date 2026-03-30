import React from "react";

function Description({ problem }) {
  // 💡 SAFETY CHECK: If problem is not loaded yet, show a tiny loader or return null
  if (!problem)
    return (
      <div className="p-4 text-gray-400 text-center animate-pulse">
        Loading problem details...
      </div>
    );

  return (
    <>
      <div className="mb-4 text-base md:text-lg">
        {/* Use optional chaining ?. for maximum safety */}
        <p className="whitespace-pre-line break-words w-full">
          {problem?.description || "No description available."}
        </p>
      </div>

      {/* Input Section */}
      <div className="mb-4 bg-gray-700 p-3 rounded-lg w-full">
        <div className="p-3 md:p-4 rounded-lg bg-gray-900 w-full">
          <h2 className="text-xl md:text-2xl font-extrabold mb-2 text-emerald-400">
            Input:
          </h2>
          <p className="whitespace-pre-line text-sm md:text-base">
            {problem?.input_format || "Standard Input"}
          </p>
        </div>
      </div>

      {/* Output Section */}
      <div className="mb-4 bg-gray-700 p-3 rounded-lg w-full">
        <div className="p-3 md:p-4 rounded-lg bg-gray-900 w-full">
          <h2 className="text-xl md:text-2xl font-extrabold mb-2 text-rose-400">
            Output:
          </h2>
          <p className="whitespace-pre-line text-sm md:text-base">
            {problem?.output_format || "Standard Output"}
          </p>
        </div>
      </div>

      {/* Constraints Section */}
      {problem?.constraints && problem.constraints.length > 0 && (
        <div className="mb-4 bg-gray-700 p-3 rounded-lg w-full">
          <div className="p-3 md:p-4 rounded-lg bg-gray-900 w-full">
            <h2 className="text-xl md:text-2xl font-extrabold mb-2 text-amber-400">
              Constraints:
            </h2>
            <ul className="list-disc pl-5 text-gray-300 text-sm md:text-base">
              {problem.constraints.map((constraint, index) => (
                <li key={index} className="mb-1">
                  {constraint}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Description;
