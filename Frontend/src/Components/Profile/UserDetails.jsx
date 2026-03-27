import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

function UserDetails({ user }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full md:w-1/3 bg-gray-900 p-6 md:p-10 rounded-lg shadow-lg flex flex-col items-center">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="h-48 md:h-64 w-48 md:w-64 object-cover rounded-lg mt-2 mb-6"
        />
        <button
          onClick={() => {
            navigate("/editprofile");
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-lg w-full mb-6"
        >
          Edit Avatar
        </button>
        <div className="text-base md:text-xl font-medium text-gray-300 self-start mt-4 mb-1 break-all">
          <span className="text-gray-500 block sm:inline">Email:</span>{" "}
          {user.email}
        </div>
        <div className="text-base md:text-xl font-medium text-gray-300 self-start mt-1 mb-4 break-all">
          <span className="text-gray-500 block sm:inline">Username:</span> @
          {user.username}
        </div>
        <LogoutButton />
      </div>
    </>
  );
}

export default UserDetails;
