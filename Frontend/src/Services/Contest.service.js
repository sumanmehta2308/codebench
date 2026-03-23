import { toast } from "react-hot-toast";
const backendURL = import.meta.env.VITE_BACKEND_URL;

/**
 * 🛡️ ADMIN: Create a new contest
 * 1. Sends title, startTime, endTime, and selected problems to the backend.
 */
export const createContestService = async (contestData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${backendURL}/contests/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contestData),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success("Contest Scheduled Successfully!");
      return data.data;
    } else {
      toast.error(data.message || "Failed to create contest");
      return false;
    }
  } catch (error) {
    toast.error("Network Error");
    return false;
  }
};

/**
 * 🟢 PUBLIC: Get all active/upcoming contests for the ContestList page
 */
export const getActiveContestsService = async () => {
  try {
    const response = await fetch(`${backendURL}/contests/active`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (response.ok) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching contests:", error);
    return [];
  }
};

/**
 * 🟢 PUBLIC: Get a specific contest by its ID (Needed for ContestRoom.jsx)
 */
export const getContestByIdService = async (id) => {
  try {
    const response = await fetch(`${backendURL}/contests/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (response.ok) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching contest by ID:", error);
    return null;
  }
};
