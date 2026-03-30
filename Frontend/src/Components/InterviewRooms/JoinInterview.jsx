import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function JoinInterview() {
  const { status, user } = useSelector((state) => state.auth);
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleJoinRoomSubmit = (e) => {
    e.preventDefault();
    if (roomId.trim() !== "") {
      // 💡 FIX: Pass the user and a 'isJoining' flag to the Room component
      navigate(`/room/${roomId.trim()}`, {
        state: { ...user, isJoining: true },
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-800 text-white p-4 md:p-10 gap-6 md:gap-0">
      <div className="w-full md:w-1/3 flex items-center justify-center rounded-lg p-6 bg-gray-900">
        <img
          src="/homelogo.png"
          alt="Logo"
          className="h-48 md:h-96 drop-shadow-lg rounded-full object-cover"
        />
      </div>

      <div className="w-full md:w-2/3 flex bg-gray-900 items-center justify-center py-10 md:py-0 md:space-y-8 mx-0 md:mx-10 rounded-lg">
        {status ? (
          <div className="bg-gray-800 p-6 md:p-16 rounded-2xl w-[90%] md:w-auto shadow-inner">
            <form
              onSubmit={handleJoinRoomSubmit}
              className="flex flex-col gap-4 md:gap-6 bg-gray-900 p-6 md:p-12 rounded-3xl shadow-lg max-w-md mx-auto border border-gray-700"
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-400 mb-2 tracking-wide text-center">
                Join Room
              </h2>
              <p className="text-gray-400 mb-2 text-base md:text-lg text-center leading-relaxed">
                Enter the secure Room ID provided by your interviewer.
              </p>

              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="e.g. A1B2C"
                required
                className="w-full px-4 py-3 md:py-4 rounded-xl bg-gray-800 border-2 border-gray-700 text-white text-center text-lg md:text-xl font-mono tracking-[0.25em] uppercase"
              />

              <button
                type="submit"
                disabled={!roomId.trim()}
                className="px-6 py-3 md:py-4 mt-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold text-lg w-full"
              >
                Join Interview
              </button>
            </form>
          </div>
        ) : (
          <div className="p-8 md:p-40 bg-gray-800 rounded-lg w-[90%] md:w-auto shadow-inner text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Authentication Required
            </h2>
            <Link
              to="/login"
              className="px-8 py-3 text-white font-bold bg-blue-600 rounded-xl inline-block"
            >
              Login to Continue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default JoinInterview;
