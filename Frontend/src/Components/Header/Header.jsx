import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  // 庁 Upgraded to text-base (16px) with slightly more padding for a perfect click target
  const navLinkStyle = ({ isActive }) =>
    `text-sm md:text-base font-medium tracking-wide transition-all duration-300 px-3 md:px-4 py-2 rounded-xl flex-1 text-center md:flex-none ${
      isActive
        ? "text-blue-400 bg-blue-500/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/80 text-slate-200 shadow-sm w-full">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-3 md:py-4 px-4 md:px-8 gap-3 md:gap-0">
        {/* TOP ROW FOR MOBILE: Logo & Profile */}
        <div className="flex w-full md:w-auto items-center justify-between">
          {/* LOGO */}
          <NavLink to="/" className="flex items-center group">
            <img
              src="/logoicon.png"
              alt="Logo"
              className="w-8 h-8 md:w-10 md:h-10 mr-2 md:mr-3 group-hover:scale-105 transition-transform duration-300"
            />
            {/* 庁 Bumped logo to text-3xl for better brand visibility */}
            <span className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              CodeBench
            </span>
          </NavLink>

          {/* MOBILE ONLY: Right Side Auth/Profile (Shows next to logo on phones) */}
          <div className="flex items-center space-x-2 md:hidden">
            {user ? (
              <Link to="/profile" className="group">
                <img
                  src={user.avatar || "/defaultuser.png"}
                  alt="User"
                  className="w-8 h-8 rounded-full ring-2 ring-transparent group-hover:ring-blue-500/50 transition-all object-cover"
                />
              </Link>
            ) : (
              <NavLink
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-1"
              >
                Log in
              </NavLink>
            )}
          </div>
        </div>

        {/* NAV LINKS (Wraps on mobile) */}
        <nav className="flex flex-wrap items-center justify-center gap-1 md:gap-2 w-full md:w-auto mt-2 md:mt-0">
          <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink>

          <NavLink to="/problems" className={navLinkStyle}>
            Problems
          </NavLink>

          <NavLink to="/contests" className={navLinkStyle}>
            Contests
          </NavLink>

          <NavLink to="/discuss" className={navLinkStyle}>
            Discuss
          </NavLink>

          {/* 孱ｸAdmin Gatekeeper */}
          {user?.role === "ADMIN" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm md:text-base font-bold tracking-wide transition-all duration-300 px-3 md:px-4 py-2 rounded-xl flex-1 text-center md:flex-none ${
                  isActive
                    ? "text-rose-400 bg-rose-500/10 border border-rose-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                    : "text-rose-500/80 hover:text-rose-400 hover:bg-rose-500/10"
                }`
              }
            >
              Admin Panel
            </NavLink>
          )}

          {/* Separation for Interview tools */}
          <div className="flex items-center gap-1 md:gap-2 border-t md:border-t-0 md:border-l border-slate-700/60 mt-2 md:mt-0 pt-2 md:pt-0 pl-0 md:pl-4 w-full md:w-auto justify-center">
            <NavLink to="/join-interview" className={navLinkStyle}>
              Join Room
            </NavLink>
            <NavLink to="/host-interview" className={navLinkStyle}>
              Host Room
            </NavLink>
          </div>
        </nav>

        {/* RIGHT SIDE (AUTH / PROFILE) - HIDDEN ON MOBILE, SHOWS ON DESKTOP */}
        <div className="hidden md:flex items-center space-x-5">
          {user ? (
            <Link to="/profile" className="group">
              <div className="flex items-center space-x-3 bg-slate-900 border border-slate-700/80 hover:border-blue-500/50 hover:bg-slate-800 pr-5 pl-1.5 py-1.5 rounded-full transition-all duration-300 shadow-sm">
                <img
                  src={user.avatar || "/defaultuser.png"}
                  alt="User"
                  className="w-9 h-9 rounded-full ring-2 ring-transparent group-hover:ring-blue-500/50 transition-all object-cover"
                />
                {/* 庁 Name bumped to text-base */}
                <span className="text-base font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {user.username || "user"}
                </span>
              </div>
            </Link>
          ) : (
            <div className="flex items-center space-x-4">
              {/* Login Button bumped to text-base */}
              <NavLink
                to="/login"
                className="text-base font-medium text-slate-300 hover:text-white transition-colors px-4 py-2"
              >
                Log in
              </NavLink>

              {/* Register Button bumped to text-base with adjusted padding */}
              <NavLink
                to="/register"
                className="text-base font-bold text-white bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
