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
    <div className="h-screen flex bg-gray-800 text-white p-10">
      <div className="w-1/3 flex items-center justify-center rounded-lg p-6 bg-gray-900">
        <img
          src="/homelogo.png"
          alt="Logo"
          className="h-96 drop-shadow-lg rounded-full object-cover"
        />
      </div>
      <div className="w-2/3 flex bg-gray-900 items-center justify-center space-y-8 mx-10 rounded-lg">
        {status ? (
          <div className="bg-gray-800 p-16 rounded-2xl">
            <div className="flex flex-col gap-6 bg-gray-900 p-12 rounded-3xl shadow-lg max-w-md mx-auto">
              <h2 className="text-4xl font-extrabold text-gray-100 mb-2 tracking-wide text-center">
                Create Room
              </h2>
              <p className="text-gray-400 mb-4 text-lg">
                Room ID will be generated automatically.
              </p>
              <button
                onClick={handleCreateRoom}
                className="px-6 py-3 mt-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Room
              </button>
            </div>
          </div>
        ) : (
          <div className="p-40 bg-gray-800 rounded-lg">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                You need to login
              </h2>
              <p className="text-gray-600 mb-6">
                Please log in to create an interview room.
              </p>
              <Link
                to="/login"
                className="px-6 py-2 text-white bg-blue-600 rounded-lg"
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
