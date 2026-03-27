import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // 💡 Using Redux now
import { generateRoomId } from "./helper.js";

function HostInterview() {
  // 💡 Instantly grab everything we need from the auth pouch
  const { socket, user, status } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleJoinRoom = (data) => {
    const { user: joinedUser, room } = data;
    navigate(`/room/${room}`, { state: joinedUser });
  };

  useEffect(() => {
    if (socket) {
      socket.on("room:join", handleJoinRoom);
      return () => socket.off("room:join", handleJoinRoom);
    }
  }, [socket, navigate]);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const randomRoomId = generateRoomId();
    // 💡 Passes the Redux user directly
    socket.emit("create-room", { room: randomRoomId, user });
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
          <div className="bg-gray-800 p-6 md:p-16 rounded-2xl w-[90%] md:w-auto">
            <div className="flex flex-col gap-4 md:gap-6 bg-gray-900 p-6 md:p-12 rounded-3xl shadow-lg max-w-md mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-100 mb-2 tracking-wide text-center">
                Create Room
              </h2>
              <p className="text-gray-400 mb-4 text-base md:text-lg text-center">
                Room ID will be generated automatically.
              </p>
              <button
                onClick={handleCreateRoom}
                className="px-6 py-3 mt-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 w-full"
              >
                Create Room
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 md:p-40 bg-gray-800 rounded-lg w-[90%] md:w-auto">
            <div className="text-center bg-white p-6 md:p-8 rounded-lg shadow-lg">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                You need to login
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                Please log in to create an interview room.
              </p>
              <Link
                to="/login"
                className="px-6 py-2 text-white bg-blue-600 rounded-lg inline-block w-full md:w-auto"
              >
                Login Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HostInterview;
