import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Loading from "../Loading/Loading.jsx";
import { getProblemService } from "../../Services/Problem.service.js";
import Solution from "./Solution.jsx";
import Description from "./Description.jsx";
import DiscussProblem from "./DiscussProblem.jsx";
import EditorBox from "../Editor/EditorBox.jsx";
import Submissions from "../Submission/Submissions.jsx";
import ChatAi from "../ChatBot/ChatAi.jsx";
const difficultyColors = {
  easy: "bg-green-500 text-white",
  medium: "bg-yellow-500 text-white",
  hard: "bg-red-600 text-white",
};

function Problem() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  // BUG FIX: Real-time update trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const location = useLocation();
  const solved = location.state?.solved || false;

  useEffect(() => {
    const helper = async () => {
      const response = await getProblemService(id);
      if (response) setProblem(response);
    };
    helper();
  }, [id]);

  // Callback function jo EditorBox call karega submit hone par
  const handleSubmissionSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!problem) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-800 text-white flex p-8">
      {/* Left Side: Tabs and Content */}
      <div className="w-1/2 min-h-screen p-7 bg-gray-900 rounded-lg mr-3">
        <div className="flex justify-between bg-gray-900 pb-4 border-b-2 border-gray-700 mb-4">
          <div className="flex">
            {["description", "solution", "discuss", "submissions" , "ai tutor"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`mx-2 px-4 py-2 font-semibold rounded-lg transition duration-300 ${
                    activeTab === tab
                      ? "bg-yellow-500 text-white shadow-lg"
                      : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>
          {solved && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 bg-black rounded-full"
              viewBox="0 0 20 20"
              fill="green"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 4.707 7.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        <h1 className="text-4xl font-semibold mb-4">{problem.title}</h1>
        <div className="flex items-center mb-4">
          <span
            className={`text-sm font-semibold px-4 py-1 rounded ${
              difficultyColors[problem.difficulty]
            }`}
          >
            {problem.difficulty}
          </span>
        </div>

        {/* Tab Content Rendering */}
        {activeTab === "description" && <Description problem={problem} />}
        {activeTab === "solution" && <Solution solution={problem.solution} />}
        {activeTab === "discuss" && <DiscussProblem id={id} />}
        {activeTab === "submissions" && (
          <Submissions
            problem_id={id}
            displayproblem={false}
            key={refreshTrigger} // KEY FIX: Forces re-fetch when trigger changes
          />
        )}
        {/* Render the ChatAi component when the tab is active */}
        {activeTab === "ai tutor" && <ChatAi problem={problem} />}
      </div>
      {/* Right Side: Monaco Editor */}
      <div className="w-1/2 min-h-screen p-7 bg-gray-900 ml-3 rounded-lg">
        <EditorBox
          problem={problem}
          onSubmissionSuccess={handleSubmissionSuccess} // Passing callback
        />
      </div>
    </div>
  );
}
export default Problem;
