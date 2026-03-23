import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getContestByIdService } from "../../Services/Contest.service";

const ContestRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [status, setStatus] = useState("loading"); // loading, locked, active, ended

  useEffect(() => {
    // 💡 Moved checkContestStatus INSIDE the useEffect to remove the linter warning
    const checkContestStatus = (start, end) => {
      const now = new Date().getTime();
      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();

      if (now < startTime) setStatus("locked");
      else if (now >= startTime && now <= endTime) setStatus("active");
      else setStatus("ended");
    };

    (async () => {
      const data = await getContestByIdService(id);
      if (data) {
        setContest(data);
        checkContestStatus(data.startTime, data.endTime);
      } else {
        setStatus("error");
      }
    })();
  }, [id]); // 💡 Now 'id' is the only required dependency! No more yellow squiggles.

  if (status === "loading")
    return (
      <div className="min-h-screen bg-slate-900 text-white p-10 text-center">
        Loading Room...
      </div>
    );

  if (status === "error")
    return (
      <div className="min-h-screen bg-slate-900 p-10 text-center text-red-500">
        Contest Not Found.
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Room Header */}
        <div className="flex justify-between items-center mb-10 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {contest.title}
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Ends: {new Date(contest.endTime).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            {status === "locked" && (
              <div className="badge badge-warning p-4 font-bold">
                STARTS SOON
              </div>
            )}
            {status === "active" && (
              <div className="badge badge-success p-4 font-bold animate-pulse">
                LIVE NOW
              </div>
            )}
            {status === "ended" && (
              <div className="badge badge-error p-4 font-bold">ENDED</div>
            )}
          </div>
        </div>

        {/* Dynamic Content Based on Time */}
        {status === "locked" ? (
          <div className="text-center mt-32">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-4xl text-slate-400 font-bold mb-4">
              Contest is Locked
            </h2>
            <p className="text-xl text-slate-500">
              Wait until the start time to see the problems.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-2">
              Contest Problems
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {contest.problems?.map((prob, index) => (
                <div
                  key={prob._id || index}
                  onClick={() =>
                    status === "active" && navigate(`/problems/${prob._id}`)
                  }
                  className={`p-6 rounded-xl border flex justify-between items-center transition
                    ${
                      status === "active"
                        ? "bg-slate-800 border-slate-600 hover:border-blue-500 cursor-pointer"
                        : "bg-slate-800/50 border-slate-800 opacity-70 cursor-not-allowed"
                    }
                  `}
                >
                  <span className="text-xl font-semibold">
                    Problem {index + 1}: {prob.title}
                  </span>
                  <span className="btn btn-sm btn-outline btn-primary">
                    {status === "active" ? "Solve Now" : "Review"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ContestRoom;