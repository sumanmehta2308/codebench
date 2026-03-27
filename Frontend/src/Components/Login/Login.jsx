import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../Services/Auth.service.js";
// 庁 CHANGE 1: Import Redux hooks to update the global state
import { useDispatch } from "react-redux";
import { login } from "../../Features/storeslice.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 庁 Initialize dispatch

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { email, password };
    try {
      // 庁 Assuming your loginUser service returns the user data directly on success
      const response = await loginUser(userData);

      if (response) {
        // 庁 CHANGE 2: Send the user data (including role) to Redux!
        // Make sure 'response' contains the user object. If your service returns
        // { success: true, user: {...} }, you might need to dispatch(login(response.user))
        dispatch(login(response));

        // 庁 CHANGE 3: Smart Routing based on Role
        if (response.role === "ADMIN") {
          navigate("/admin"); // Take admins straight to the dashboard
        } else {
          navigate("/"); // Take normal students to the home page
        }
      }
    } catch (error) {
      console.error("Login component error:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Side (Hidden on Mobile) */}
      <div className="hidden md:flex md:w-1/2 h-screen bg-slate-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-900"></div>
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]"></div>
        <div className="relative z-10">
          <img
            src="/homelogo.png"
            alt="Logo"
            className="h-96 w-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>

      {/* Right Side (Full width on Mobile) */}
      <div className="w-full md:w-1/2 bg-gray-900 flex items-center justify-center relative min-h-screen p-4 md:p-0">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-sm md:text-base"
        >
          Home
        </button>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                Password
              </label>
              <input
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-sm md:text-base"
            >
              Login
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4 text-sm md:text-base">
            Don't have an account?{" "}
            <Link to={"/register"} className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
