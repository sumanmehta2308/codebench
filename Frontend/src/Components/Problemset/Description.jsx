import React from "react";

function Description({ problem }) {
  return (
    <>
      <div className="mb-4 text-base md:text-lg">
        <p className="whitespace-pre-line break-words w-full">
          {problem.description}
        </p>
      </div>
      <div className="mb-4 bg-gray-700 p-3 rounded-lg w-full overflow-hidden">
        <div className="p-3 md:p-4 rounded-lg bg-gray-900 w-full">
          <h2 className="text-xl md:text-2xl font-extrabold mb-2">Input:</h2>
          <p className="whitespace-pre-line overflow-x-auto text-sm md:text-base w-full">
            {problem.input_format}
          </p>
        </div>
      </div>
      <div className="mb-4 bg-gray-700 p-3 rounded-lg w-full overflow-hidden">
        <div className="p-3 md:p-4 rounded-lg bg-gray-900 w-full">
          <h2 className="text-xl md:text-2xl font-extrabold mb-2">Output:</h2>
          <p className="whitespace-pre-line overflow-x-auto text-sm md:text-base w-full">
            {problem.output_format}
          </p>
        </div>
      </div>
      <div className="mb-4 bg-gray-700 p-3 rounded-lg w-full overflow-hidden">
        <div className="p-3 md:p-4 rounded-lg bg-gray-900 w-full">
          <h2 className="text-xl md:text-2xl font-extrabold mb-2">
            Constraints:
          </h2>
          <ul className="list-disc pl-5 text-gray-300 text-sm md:text-base overflow-x-auto w-full">
            {problem.constraints.map((constraint, index) => (
              <li key={index} className="break-words">
                {constraint}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Description;
