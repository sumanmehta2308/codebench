import { toast } from "react-hot-toast";
const backendURL = import.meta.env.VITE_BACKEND_URL;

/**
 * 💡 WORKFLOW: LOGIN USER
 * 1. Sends email/password to the backend.
 * 2. If successful, stores the JWT tokens and user data in localStorage (for persistence).
 * 3. CRITICAL: Returns the `user` object so Login.jsx can send it to Redux!
 */
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${backendURL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (response?.status === 200) {
      const { accessToken, refreshToken, user } = data.data;

      // Save to localStorage so the user stays logged in after a page refresh
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Logged in");
      // 🚀 CHANGED: Now returning the user object instead of 'true'
      return user;
    } else {
      toast.error(data?.message || "Server Error");
      return false;
    }
  } catch (error) {
    toast.error("Server Error");
    console.error(error);
    return false;
  }
};

/**
 * 💡 WORKFLOW: REGISTER USER
 * 1. Creates a new account in the database.
 * 2. Returns true if successful, allowing the UI to redirect to the Login page.
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${backendURL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (response?.status === 200 || response?.status === 201) {
      toast.success("Registration Successful");
      return true;
    } else {
      const data = await response.json();
      toast.error(data?.message || "Registration Failed");
      return false;
    }
  } catch (error) {
    toast.error("Server Error");
    console.error(error);
    return false;
  }
};

/**
 * 💡 WORKFLOW: CHECK LOGIN STATUS
 * Quickly checks if an access token exists in local storage.
 */
export const isLoggedIn = () => {
  const token = localStorage.getItem("accessToken");
  return !!token;
};

/**
 * 💡 WORKFLOW: GET MY PROFILE
 * 1. Uses the stored JWT token to fetch the latest user data directly from the DB.
 * 2. Useful for refreshing the Redux state when the user reloads the page.
 */
export const getMyProfile = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${backendURL}/users/getcurrentuser`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      return data.data;
    } else {
      return null;
    }
  } catch (error) {
    toast.error("Failed to Load Profile");
    return null;
  }
};

/**
 * 💡 WORKFLOW: LOGOUT
 * 1. Tells the backend to invalidate the session.
 * 2. Clears all tokens and user data from local storage.
 */
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${backendURL}/users/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      toast.success("Logged out");
      return true;
    } else {
      toast.error("Failed to log out");
      return false;
    }
  } catch (error) {
    toast.error("Server Error");
    console.log(error);
    return false;
  }
};

/**
 * 💡 WORKFLOW: UPDATE AVATAR
 * 1. Sends FormData (image file) to the backend.
 * 2. Updates the local storage with the newly returned user data.
 */
export const updateUserAvatar = async (formData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${backendURL}/users/updateavatar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.status === 200) {
      localStorage.setItem("user", JSON.stringify(data.data));
      toast.success("Avatar updated successfully");
      return data.data; // Changed from true to return the updated user object
    } else {
      toast.error(data?.message || "Failed to update avatar");
      return false;
    }
  } catch (error) {
    toast.error("Server Error");
    return false;
  }
};

/**
 * 💡 WORKFLOW: REFRESH TOKEN
 * 1. If the access token expires, this calls the backend using the refresh token.
 * 2. Updates local storage with the new fresh tokens.
 */
export const refreshTokenService = async () => {
  try {
    const token = localStorage.getItem("refreshToken");
    if (!token) return;

    const response = await fetch(`${backendURL}/users/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: token }),
    });

    const data = await response.json();
    if (response.status === 200) {
      const { refreshToken, accessToken } = data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      return true;
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
