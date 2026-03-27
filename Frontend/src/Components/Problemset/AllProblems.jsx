import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProblemsService } from "../../Services/Problem.service";
import Loading from "../Loading/Loading.jsx";
import { getSolvedProblemService } from "../../Services/Submissions.service.js";

const difficultyColors = {
  easy: "bg-green-500/10 text-green-400 border border-green-500/30",
  medium: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
  hard: "bg-red-500/10 text-red-400 border border-red-500/30",
};

const AllProblems = () => {
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  // Reset to first page whenever the filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    const helper = async () => {
      setLoading(true);
      // Increased limit to 10 to fill the wider screen better
      const response1 = await getAllProblemsService(page, 5, filter);
      const response2 = await getSolvedProblemService();

      if (response1) {
        const data = response1.data || response1;
        setProblems(data.problems || data.docs || []);
        setTotalPages(data.totalPages || 1);
      }
      if (response2) {
        setSolvedProblems(new Set(response2));
      }
      setLoading(false);
    };

    helper();
  }, [page, filter]);

  if (loading && problems.length === 0) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-12 flex justify-center w-full overflow-hidden">
      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Challenge <span className="text-yellow-400">Hub</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-lg font-light">
              Master your skills with our curated problem set.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {["all", "easy", "medium", "hard", "solved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 md:px-5 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase transition-all duration-300 border ${
                  filter === f
                    ? "bg-yellow-400 border-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/20 scale-105"
                    : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Main Table Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-800/40 text-gray-500 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold">
                  <th className="px-4 md:px-8 py-4 md:py-5 min-w-[150px]">
                    # Title
                  </th>
                  <th className="px-4 md:px-8 py-4 md:py-5 text-center min-w-[100px]">
                    Difficulty
                  </th>
                  <th className="px-4 md:px-8 py-4 md:py-5 text-center min-w-[100px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {problems.map((problem, index) => (
                  <tr
                    key={problem._id}
                    onClick={() =>
                      navigate(`/problems/${problem._id}`, {
                        state: { solved: solvedProblems.has(problem._id) },
                      })
                    }
                    className="group hover:bg-white/[0.03] transition-all cursor-pointer"
                  >
                    <td className="px-4 md:px-8 py-4 md:py-5 font-semibold text-gray-200 group-hover:text-yellow-400 transition-colors text-sm md:text-base">
                      <span className="text-gray-600 mr-2 md:mr-3 font-mono">
                        {String((page - 1) * 5 + index + 1).padStart(2, "0")}
                      </span>
                      {problem.title}
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-5 text-center">
                      <span
                        className={`inline-block px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${
                          difficultyColors[problem.difficulty?.toLowerCase()] ||
                          ""
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-4 md:px-8 py-4 md:py-5 text-center">
                      <div className="flex justify-center">
                        {solvedProblems.has(problem._id) ? (
                          <div className="h-5 w-5 md:h-6 md:w-6 bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 md:w-4 md:h-4 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        ) : (
                          <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-gray-700"></span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RESTORED PAGINATION PART */}
          <div className="bg-gray-900/50 px-4 md:px-8 py-4 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-sm md:text-base font-bold bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs md:text-sm">
                Showing page
              </span>
              <span className="px-2 md:px-3 py-1 bg-gray-800 rounded-md text-yellow-400 font-mono font-bold border border-gray-700 text-xs md:text-base">
                {page}
              </span>
              <span className="text-gray-500 text-xs md:text-sm">
                of {totalPages || 1}
              </span>
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-sm md:text-base font-bold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
            >
              Next Step →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProblems;
