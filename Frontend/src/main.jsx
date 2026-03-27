import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Store/store.js";
import { Toaster } from "react-hot-toast";

// --- Standard Components ---
import Login from "./Components/Login/Login.jsx";
import Register from "./Components/Register/Register.jsx";
import Home from "./Components/Home/Home.jsx";
import Profile from "./Components/Profile/Profile.jsx";
import EditProfile from "./Components/Profile/EditProfile.jsx";
import Discuss from "./Components/Discuss/Discuss.jsx";
import AllProblems from "./Components/Problemset/AllProblems.jsx";
import Problem from "./Components/Problemset/Problem.jsx";
import JoinInterview from "./Components/InterviewRooms/JoinInterview.jsx";
import HostInterview from "./Components/InterviewRooms/HostInterview.jsx";
import Room from "./Components/InterviewRooms/Room.jsx";
import Loading from "./Components/Loading/Loading.jsx";

// --- 🛡️ Admin & Contest Components (Phases 2 & 3) ---
import AdminDashboard from "./Components/Admin/AdminDashboard.jsx";
//import EditProblem from "./Components/Admin/EditProblem.jsx";
import CreateProblem from "./Components/Admin/CreateProblem.jsx";
import ContestList from "./Components/Contest/ContestList.jsx";
import CreateContest from "./Components/Contest/CreateContest.jsx";
import ContestRoom from "./Components/Contest/ContestRoom.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Auth Routes (Rendered WITHOUT the Header) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main Layout Routes (Rendered INSIDE App.jsx so they get the Header) */}
      <Route path="" element={<App />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/discuss" element={<Discuss />} />
        <Route path="/problems" element={<AllProblems />} />
        <Route path="/problems/:id" element={<Problem />} />
        <Route path="/join-interview" element={<JoinInterview />} />
        <Route path="/host-interview" element={<HostInterview />} />
        <Route path="/loading" element={<Loading />} />
        {/*  Contest Routes */}
        <Route path="/contests" element={<ContestList />} />
        <Route path="/contest/:id" element={<ContestRoom />} />

        {/*  Protected Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-problem" element={<CreateProblem />} />
        <Route path="/admin/edit-problem/:id" element={<CreateProblem />} />
        <Route path="/admin/create-contest" element={<CreateContest />} />
      </Route>

      {/* Full Screen Room Route (Rendered WITHOUT the Header for coding view) */}
      <Route path="/room/:roomId" element={<Room />} />
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      {/* Toaster placed at the root level so notifications work everywhere */}
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>
);
