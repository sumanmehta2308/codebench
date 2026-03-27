import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../Services/Auth.service.js";
import { toast } from "react-hot-toast";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const userData = { fullname: fullName, username, email, password };
    try {
      const status = await registerUser(userData);
      if (status) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
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
          <img src="/homelogo.png" alt="Logo" className="h-96 w-auto" />
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
            Register
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base"
                placeholder="Enter full name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base"
                placeholder="Enter username"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base"
                placeholder="Enter email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base"
                placeholder="Enter password"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm md:text-base"
                placeholder="Confirm password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-sm md:text-base"
            >
              Register
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4 text-sm md:text-base">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
