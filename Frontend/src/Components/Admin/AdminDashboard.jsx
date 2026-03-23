import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// 💡 Ensure you ran: npm install @heroicons/react
import {
  PlusIcon,
  CalendarDaysIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
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
    <div className="min-h-screen bg-slate-950 py-10 px-6 text-slate-200">
      <div className="max-w-6xl mx-auto">
        {/* --- HEADER ROW: Title & Overview --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Control Center
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-1">
              Manage repository and global contests
            </p>
          </div>

          {/* 1. Stats Card (Now positioned properly) */}
          <div className="bg-slate-900 border border-slate-800 px-8 py-4 rounded-2xl shadow-xl flex flex-col items-center hover:border-blue-500/50 transition-all">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              Total Problems
            </span>
            <span className="text-3xl font-black text-white">
              {problems.length}
            </span>
          </div>
        </div>

        {/* --- ACTIONS ROW: Separate Individual Buttons --- */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 mb-10">
          <Link
            to="/admin/add-problem"
            className="btn btn-primary btn-md px-8 rounded-xl shadow-lg shadow-blue-500/20 hover:scale-105 transition-all normal-case font-bold"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Problem
          </Link>

          <Link
            to="/admin/create-contest"
            className="btn btn-primary btn-md px-8 rounded-xl shadow-lg shadow-blue-500/20 hover:scale-105 transition-all normal-case font-bold"
          >
            <CalendarDaysIcon className="w-5 h-5 mr-2" />
            Create A Contest
          </Link>
        </div>

        {/* --- MAIN TABLE --- */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-lg w-full">
              <thead className="bg-slate-800/50 text-slate-400">
                <tr>
                  <th className="py-6 pl-10 text-left text-sm font-bold uppercase tracking-wider">
                    Problem Name
                  </th>
                  <th className="py-6 text-center text-sm font-bold uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="py-6 pr-10 text-right text-sm font-bold uppercase tracking-wider">
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
                    <td className="py-6 pl-10">
                      <span className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {prob.title}
                      </span>
                    </td>
                    <td className="py-6 text-center">
                      <div
                        className={`badge badge-md font-bold py-3 px-4 rounded-lg capitalize ${
                          prob.difficulty === "easy"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : prob.difficulty === "medium"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        }`}
                      >
                        {prob.difficulty}
                      </div>
                    </td>
                    <td className="py-6 pr-10 text-right space-x-2">
                      {/* Modify Button */}
                      <button
                        onClick={() => {
                          console.log("Navigating to ID:", prob._id);
                          navigate(`/admin/edit-problem/${prob._id}`);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded-xl shadow-sm hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                        Modify
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(prob._id)}
                        className="btn btn-ghost btn-circle text-rose-500 hover:bg-rose-500/10 transition-all"
                        title="Delete Problem"
                      >
                        <TrashIcon className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* ... Loading / Empty states ... */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
