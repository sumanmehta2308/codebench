import React, { useEffect, useState } from "react";
import { getMyProfile, refreshTokenService } from "../../Services/Auth.service";
import Header from "../Header/Header.jsx";
import Loading from "../Loading/Loading.jsx";
import ProblemStats from "./ProblemStats.jsx";
import UserDetails from "./UserDetails.jsx";
import UserTweets from "./UserTweets.jsx";
import Submissions from "../Submission/Submissions.jsx";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("submissions");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      let response = await getMyProfile();

      // FIX: If unauthorized, try to refresh token once before kicking user out
      if (!response) {
        const refreshed = await refreshTokenService();
        if (refreshed) {
          response = await getMyProfile();
        }
      }

      if (response) {
        setUser(response);
      } else {
        navigate("/login");
        localStorage.clear(); // Clear all stale data
      }
    };
    fetchUserProfile();
  }, [navigate]);

  if (!user) return <Loading />;

  return (
    <>
      {/*<Header user={user} />  */}
      <div className="min-h-screen bg-gray-800 text-white flex flex-col md:flex-row p-4 md:p-10 gap-6 md:gap-0">
        <UserDetails user={user} />
        <div className="w-full md:w-2/3 py-6 md:py-10 px-4 md:px-14 space-y-6 flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold text-center truncate">
            {user.fullname}
          </h1>
          <hr className="border-gray-600" />
          <ProblemStats user={user} />
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-4 mb-4">
            <button
              onClick={() => setActiveTab("submissions")}
              className={`py-2 px-4 font-extrabold rounded-lg w-full sm:w-auto ${
                activeTab === "submissions"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              Solved Questions
            </button>
            <button
              onClick={() => setActiveTab("tweets")}
              className={`py-2 px-4 font-extrabold rounded-lg w-full sm:w-auto ${
                activeTab === "tweets"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              My Tweets
            </button>
          </div>
          <div className="p-4 rounded-lg bg-gray-900 w-full overflow-hidden">
            {activeTab === "tweets" ? (
              <UserTweets user={user} />
            ) : (
              <Submissions displayproblem={true} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
