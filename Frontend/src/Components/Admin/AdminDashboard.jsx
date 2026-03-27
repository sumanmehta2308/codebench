import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusIcon,
  CalendarDaysIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import {
  getAllProblemsService,
  deleteproblemById,
} from "../../Services/Problem.service";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getAllProblemsService(1, 10);
      if (data) setProblems(data.problems);
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure? This problem will be permanently deleted.")
    ) {
      const success = await deleteproblemById(id);
      if (success) {
        setProblems(problems.filter((p) => p._id !== id));
        toast.success("Problem removed successfully");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-6 md:py-10 px-4 md:px-6 text-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* HEADER ROW */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b border-slate-800 pb-8 gap-6">
          <div className="w-full md:w-auto text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Control Center
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Manage repository and global contests
            </p>
          </div>

          <div className="w-full md:w-auto bg-slate-900 border border-slate-800 px-8 py-4 rounded-2xl shadow-xl flex flex-col items-center hover:border-blue-500/50 transition-all">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              Total Problems
            </span>
            <span className="text-3xl font-black text-white">
              {problems.length}
            </span>
          </div>
        </div>

        {/* ACTIONS ROW */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mb-10">
          <Link
            to="/admin/add-problem"
            className="btn btn-primary w-full sm:w-auto px-8 rounded-xl font-bold"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> Add New Problem
          </Link>
          <Link
            to="/admin/create-contest"
            className="btn btn-primary w-full sm:w-auto px-8 rounded-xl font-bold"
          >
            <CalendarDaysIcon className="w-5 h-5 mr-2" /> Create Contest
          </Link>
        </div>

        {/* MAIN TABLE */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
          {/* Added overflow-x-auto to prevent table from breaking mobile view */}
          <div className="overflow-x-auto">
            <table className="table w-full min-w-[600px]">
              <thead className="bg-slate-800/50 text-slate-400">
                <tr>
                  <th className="py-4 pl-6 md:pl-10 text-sm font-bold uppercase">
                    Problem Name
                  </th>
                  <th className="py-4 text-center text-sm font-bold uppercase hidden sm:table-cell">
                    Difficulty
                  </th>
                  <th className="py-4 pr-6 md:pr-10 text-right text-sm font-bold uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {problems?.map((prob) => (
                  <tr
                    key={prob._id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-4 pl-6 md:pl-10">
                      <div className="flex flex-col">
                        <span className="text-base md:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {prob.title}
                        </span>
                        <span className="sm:hidden text-xs text-slate-500 uppercase mt-1">
                          {prob.difficulty}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-center hidden sm:table-cell">
                      <div
                        className={`badge badge-sm font-bold py-3 px-4 rounded-lg capitalize ${
                          prob.difficulty === "easy"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : prob.difficulty === "medium"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-rose-500/10 text-rose-500"
                        }`}
                      >
                        {prob.difficulty}
                      </div>
                    </td>
                    <td className="py-4 pr-6 md:pr-10 text-right space-x-1 md:space-x-2">
                      <button
                        onClick={() => {
                          console.log("Navigating to ID:", prob._id);
                          navigate(`/admin/edit-problem/${prob._id}`);
                        }}
                        className="p-2 text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prob._id)}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
