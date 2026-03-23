import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../Loading/Loading.jsx";
import {
  CodeBracketSquareIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  VideoCameraIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  // Feature Card Component - Adjusted to be compact and fit side-by-side
  const FeatureCard = ({
    title,
    description,
    icon: Icon,
    link,
    themeClasses,
    hoverGlow,
  }) => (
    <Link to={link} className="block group h-full">
      <div
        className={`bg-slate-900/60 border border-slate-800 p-6 rounded-3xl hover:-translate-y-1 hover:bg-slate-800/80 transition-all duration-300 relative overflow-hidden h-full flex flex-col justify-between shadow-lg group-hover:border-slate-600 ${hoverGlow}`}
      >
        <div>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${themeClasses}`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 transition-colors">
            {title}
          </h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        <div className="mt-6 flex items-center text-slate-300 font-bold text-xs uppercase tracking-wider group-hover:text-white transition-colors">
          Explore{" "}
          <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
        </div>
      </div>
    </Link>
  );

  return (
    // min-h-screen and flex items-center ensures it locks to a single view without scrolling
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 overflow-hidden relative selection:bg-blue-500/30 pt-16 lg:pt-0">
      {/* --- Background Glow Effects --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10 py-12">
        {/* --- LEFT SIDE: Hero Content --- */}
        <div className="flex flex-col justify-center text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
            <div className="p-1 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <img
                src="/homelogo.png"
                alt="CodeBench Logo"
                className="h-16 w-16 rounded-full object-cover border-2 border-slate-950"
              />
            </div>
            <div className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold tracking-wide backdrop-blur-md">
              CodeBench v1.0
            </div>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Master Logic.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 animate-gradient-x">
              Ace Interviews.
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-10 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
            Your all-in-one platform to solve complex coding challenges, discuss
            logic, and conduct real-time collaborative technical interviews.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/problems">
              <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all duration-300">
                Start Practicing
              </button>
            </Link>
          </div>
        </div>

        {/* --- RIGHT SIDE: Interactive Feature Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 items-center">
          <FeatureCard
            title="Problemset"
            description="Extensive library of coding challenges. Filter by difficulty and track progress."
            icon={CodeBracketSquareIcon}
            link="/problems"
            themeClasses="bg-blue-500/10 text-blue-400 border-blue-500/20"
            hoverGlow="hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
          />
          <FeatureCard
            title="Community"
            description="Share logic, ask questions, and learn from alternative solutions from peers."
            icon={ChatBubbleLeftRightIcon}
            link="/discuss"
            themeClasses="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            hoverGlow="hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
          />
          <FeatureCard
            title="Host Interview"
            description="Create secure, real-time collaborative coding rooms for technical assessments."
            icon={VideoCameraIcon}
            link="/host-interview"
            themeClasses="bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            hoverGlow="hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
          />
          <FeatureCard
            title="Join Room"
            description="Instantly join a live coding session with integrated editors and communication tools."
            icon={UserGroupIcon}
            link="/join-interview"
            themeClasses="bg-purple-500/10 text-purple-400 border-purple-500/20"
            hoverGlow="hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
