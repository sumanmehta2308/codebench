import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createContestService } from "../../Services/Contest.service";
import { getAllProblemsService } from "../../Services/Problem.service";
import {
  TrophyIcon,
  ClockIcon,
  ListBulletIcon,
  RocketLaunchIcon,
  ChevronLeftIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const CreateContest = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [availableProblems, setAvailableProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 💡 Fetching data for the selection list
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getAllProblemsService(1, 50);
      if (data) setAvailableProblems(data.problems);
      setLoading(false);
    })();
  }, []);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      problems: Array.isArray(data.problems) ? data.problems : [data.problems],
    };

    const response = await createContestService(formattedData);
    if (response) {
      toast.success("Contest Scheduled Successfully!");
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-6 py-12 text-slate-200">
      {/* 💡 CSS Injection for White Calendar Icons */}
      <style>{`
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
          transform: scale(1.2);
        }
      `}</style>

      <div className="w-full max-w-3xl">
        <button
          onClick={() => navigate("/admin")}
          className="btn btn-ghost btn-sm gap-2 text-slate-500 mb-6 hover:text-white transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* --- HEADER --- */}
          <div className="bg-gradient-to-r from-purple-600/20 via-blue-600/10 to-transparent p-10 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-600/20 rounded-2xl">
                <TrophyIcon className="w-10 h-10 text-purple-500" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-white tracking-tight">
                  Schedule <span className="text-purple-500">Contest</span>
                </h2>
                <p className="text-slate-400 font-medium mt-1">
                  Configure global competitive programming events.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-12">
            {/* --- CONTEST TITLE --- */}
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                Contest Identity
              </label>
              <input
                {...register("title", {
                  required: "Contest Title is required",
                })}
                className={`input w-full bg-slate-950 border-2 border-slate-800 h-14 px-6 text-lg focus:border-purple-500 transition-all ${
                  errors.title ? "border-rose-500" : ""
                }`}
                placeholder="e.g., CodeBench Grand Prix #01"
              />
              {errors.title && (
                <span className="text-rose-500 text-xs font-bold px-1">
                  {errors.title.message}
                </span>
              )}
            </div>

            {/* --- HIGH-VISIBILITY TIME SLOTS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Start Event */}
              <div className="flex flex-col gap-3 group">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-400/80 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5" /> Start Event
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    {...register("startTime", {
                      required: "Start time is required",
                    })}
                    className={`input w-full bg-slate-950 border-l-4 border-y-slate-800 border-r-slate-800 text-white h-14 px-6 text-lg transition-all
                      ${
                        errors.startTime
                          ? "border-l-rose-500 bg-rose-500/5"
                          : "border-l-purple-500 focus:border-l-purple-400"
                      }`}
                  />
                  {errors.startTime && (
                    <ExclamationCircleIcon className="absolute right-12 top-1/2 -translate-y-1/2 text-rose-500 w-6 h-6 animate-pulse" />
                  )}
                </div>
              </div>

              {/* End Event */}
              <div className="flex flex-col gap-3 group">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400/80 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5" /> End Event
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    {...register("endTime", {
                      required: "End time is required",
                    })}
                    className={`input w-full bg-slate-950 border-l-4 border-y-slate-800 border-r-slate-800 text-white h-14 px-6 text-lg transition-all
                      ${
                        errors.endTime
                          ? "border-l-rose-500 bg-rose-500/5"
                          : "border-l-blue-500 focus:border-l-blue-400"
                      }`}
                  />
                  {errors.endTime && (
                    <ExclamationCircleIcon className="absolute right-12 top-1/2 -translate-y-1/2 text-rose-500 w-6 h-6 animate-pulse" />
                  )}
                </div>
              </div>
            </div>

            {/* --- PROBLEM SELECTION --- */}
            <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <ListBulletIcon className="w-6 h-6 text-blue-500" /> Select
                  Problems
                </h3>
                <span className="text-[10px] font-black bg-blue-500/10 text-blue-500 px-4 py-1.5 rounded-full border border-blue-500/20 uppercase tracking-widest">
                  {availableProblems.length} Syncing
                </span>
              </div>

              <div className="h-72 overflow-y-auto space-y-3 pr-3 custom-scrollbar">
                {availableProblems.map((prob) => (
                  <label
                    key={prob._id}
                    className="flex items-center justify-between p-5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-purple-500/40 hover:bg-slate-800/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-5">
                      <input
                        type="checkbox"
                        value={prob._id}
                        {...register("problems")}
                        className="checkbox checkbox-primary rounded-lg border-2 border-slate-700"
                      />
                      <span className="text-lg font-bold text-slate-300 group-hover:text-white">
                        {prob.title}
                      </span>
                    </div>
                    <div
                      className={`badge badge-md border-none font-black uppercase text-[10px] px-5 py-3 rounded-lg ${
                        prob.difficulty === "easy"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : prob.difficulty === "medium"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-rose-500/10 text-rose-500"
                      }`}
                    >
                      {prob.difficulty}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* --- LAUNCH BUTTON --- */}
            <button
              type="submit"
              className="group relative btn btn-primary w-full h-16 rounded-2xl border-none shadow-[0_0_40px_rgba(124,58,237,0.3)] hover:shadow-purple-500/60 hover:scale-[1.02] active:scale-95 transition-all duration-300 overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-4">
                <span className="text-xl font-black uppercase tracking-[0.1em]">
                  Launch Global Contest
                </span>
                <RocketLaunchIcon className="w-7 h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateContest;
