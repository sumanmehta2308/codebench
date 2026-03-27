import React, { useEffect, useState } from "react";
import { getActiveContestsService } from "../../Services/Contest.service";
import { useNavigate } from "react-router-dom";

const ContestList = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = await getActiveContestsService();
      if (Array.isArray(data)) setContests(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-slate-900 min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-400 mb-8 border-b border-slate-700 pb-4">
          Official Contests
        </h1>

        {loading ? (
          <div className="text-center text-xl text-slate-400 mt-20">
            Loading contests...
          </div>
        ) : (
          <div className="space-y-4">
            {contests.length > 0 ? (
              contests.map((contest) => (
                <div
                  key={contest._id}
                  className="bg-slate-800 p-5 md:p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center border border-slate-700 shadow-lg hover:border-blue-500 transition gap-4"
                >
                  <div className="w-full">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {contest.title}
                    </h2>
                    <p className="text-sm md:text-base text-slate-400">
                      <span className="font-semibold text-blue-300">
                        Starts:
                      </span>{" "}
                      {new Date(contest.startTime).toLocaleString()}
                    </p>
                    <p className="text-sm md:text-base text-slate-400">
                      <span className="font-semibold text-red-300">Ends:</span>{" "}
                      {new Date(contest.endTime).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/contest/${contest._id}`)}
                    className="btn btn-primary px-8 w-full sm:w-auto mt-2 sm:mt-0"
                  >
                    Enter Room
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-800 rounded-xl border border-slate-700">
                <p className="text-xl md:text-2xl text-slate-400 font-semibold mb-2">
                  No active contests found.
                </p>
                <p className="text-slate-500 text-sm md:text-base">
                  Check back on Saturday or Sunday!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestList;
