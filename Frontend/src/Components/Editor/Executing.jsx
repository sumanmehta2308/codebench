import React from "react";

const Executing = ({ text }) => {
  return (
    <div className="p-4 md:p-10 rounded-lg inset-0 bg-gray-700 bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="flex flex-col items-center bg-white p-6 md:p-8 rounded-lg shadow-lg w-[90%] sm:w-auto text-center">
        <div className="loader border-t-4 border-blue-500 rounded-full w-10 h-10 md:w-12 md:h-12 mb-4 animate-spin"></div>
        <p className="text-base md:text-lg font-semibold text-gray-700">
          {text}...
        </p>
      </div>
    </div>
  );
};

export default Executing;
