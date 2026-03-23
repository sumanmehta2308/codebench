import { toast } from "react-hot-toast";
const backendURL = import.meta.env.VITE_BACKEND_URL;
/*
  WORKFLOW: CREATE PROBLEM (ADMIN ONLY)
  1. Takes the perfectly formatted data from React Hook Form.
  2. Attaches the JWT token so the backend 'isAdmin' middleware lets it through.
  3. Returns the saved problem OR false if it fails.
*/
export const createproblem = async (problemData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${backendURL}/problem/createproblem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(problemData),
    });

    const data = await response.json();
    if (response.ok) {
      return data.data;
    } else {
      toast.error(data.message || "Failed to create problem");
      return false;
    }
  } catch (error) {
    toast.error("Network Error");
    return false;
  }
};

/** 🛡️ ADMIN ONLY: Delete Problem */
export const deleteproblemById = async (id) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${backendURL}/problem/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      toast.success("Problem Deleted");
      return true;
    }
    return false;
  } catch (error) {
    toast.error("Server Error");
    return false;
  }
};
export const getAllProblemsService = async (
  page = 1,
  limit = 5,
  difficulty = "all"
) => {
  try {
    // 💡 Construct URL with difficulty filter if it's not "all"
    let url = `${backendURL}/problem?page=${page}&limit=${limit}`;

    if (difficulty && difficulty !== "all") {
      url += `&difficulty=${difficulty}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    // Using data.success or checking status
    if (response.ok) {
      return data.data;
    } else {
      toast.error(data.message || "Server Error");
      return false;
    }
  } catch (error) {
    toast.error("Network Error");
    console.error(error);
    return false;
  }
};

export const getProblemService = async (id) => {
  try {
    const response = await fetch(`${backendURL}/problem/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (response?.status === 200) {
      return data.data;
    } else {
      toast.error("Server Error");
      return false;
    }
  } catch (error) {
    toast.error("Server Error");
    console.error(error);
    return false;
  }
};

export const updatedefaultlangService = async (lang) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `${backendURL}/users/updatedefaultlang/${lang}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

export const updateTemplateService = async (lang, userData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${backendURL}/users/updatetemplate/${lang}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData), // userData should contain { code: "..." }
    });
    if (response.status === 200) {
      toast.success("Template Updated");
      return true;
    }
    toast.error("Login to update Template");
    return false;
  } catch (error) {
    toast.error("Server Error");
    console.log(error);
  }
};

export const getdefaultlangtempService = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${backendURL}/users/getdeflangandtemplate`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
/** 🛡️ ADMIN ONLY: Update Problem */
export const updateProblemService = async (id, problemData) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${backendURL}/problem/${id}`, {
      method: "PUT", // Use PUT or PATCH based on your backend route
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(problemData),
    });

    const data = await response.json();
    if (response.ok) {
      return data.data;
    } else {
      toast.error(data.message || "Failed to update problem");
      return false;
    }
  } catch (error) {
    toast.error("Network Error");
    return false;
  }
};