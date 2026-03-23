import React, { useEffect, useState } from "react";
import { getSubmissionService } from "../../Services/Submissions.service.js";
import Loading from "../Loading/Loading.jsx";
import SubmissionCard from "./SubmissionCard.jsx";

function Submissions({ problem_id, displayproblem }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 💡 Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      const response = await getSubmissionService(problem_id, page);

      if (response && !Array.isArray(response) && response.submissions) {
        setSubmissions(response.submissions);
        setTotalPages(response.totalPages || 1);
      } else {
        setSubmissions(response || []);
      }
      setLoading(false);
    };
    fetchSubmissions();
  }, [problem_id, page]);

  return (
    <div className="p-4 bg-gray-800 rounded-xl max-h-screen flex flex-col border border-gray-700 shadow-inner">
      <div className="overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-gray-600">
        {loading ? (
          <Loading />
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <h3 className="text-xl text-gray-400 font-bold mb-2">
              No Submissions Yet
            </h3>
            <p className="text-gray-500 text-sm">
              Run your code to see history here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission, index) => (
              <SubmissionCard
                key={submission._id || index}
                submission={submission}
                displayproblem={displayproblem}
              />
            ))}
          </div>
        )}
      </div>

      {/* 💡 Minimal Pagination for Submissions Tab */}
      {!loading && submissions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`text-sm px-4 py-1.5 rounded-md font-semibold transition-colors ${
              page === 1
                ? "bg-gray-700 text-gray-500"
                : "bg-gray-600 text-white hover:bg-gray-500"
            }`}
          >
            Prev
          </button>
          <span className="text-xs text-gray-400 font-medium">
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`text-sm px-4 py-1.5 rounded-md font-semibold transition-colors ${
              page >= totalPages
                ? "bg-gray-700 text-gray-500"
                : "bg-gray-600 text-white hover:bg-gray-500"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
export default Submissions;
