import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Services/Auth.service";

const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    // Corrected: Added await to ensure backend session is cleared before navigation
    const result = await logoutUser();
    if (result) {
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 mt-6 mb-2 py-2 w-full md:w-auto font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
