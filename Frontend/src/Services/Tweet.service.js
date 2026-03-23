import { toast } from "react-hot-toast";
const backendURL = import.meta.env.VITE_BACKEND_URL;

export const fetchTweets = async () => {
  try {
    const response = await fetch(`${backendURL}/tweet`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response?.status === 200) {
      return data.data;
    }
    return false;
  } catch (error) {
    toast.error("Server Error");
    console.error(error);
    return false;
  }
};

export const createTweetService = async (content, replyOf, imageFile) => {
  try {
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();

    // These keys must match the backend controller's req.body and req.file
    formData.append("content", content);
    if (replyOf) formData.append("replyOf", replyOf);
    if (imageFile) formData.append("image", imageFile);

    const response = await fetch(`${backendURL}/tweet/createtweet`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Do not set Content-Type header when sending FormData;
        // the browser will automatically set it with the correct boundary.
      },
      body: formData,
    });

    const data = await response.json();
    if (response?.status === 200 || response?.status === 201) {
      return data.data;
    }
    toast.error(data?.message || "Server Error");
    return false;
  } catch (error) {
    toast.error("Server Error");
    console.error(error);
    return false;
  }
};

export const fetchProblemTweets = async (id) => {
  try {
    const response = await fetch(`${backendURL}/tweet/problem/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response?.status === 200) {
      return data.data;
    }
    return false;
  } catch (error) {
    toast.error("Server Error");
    console.error(error);
    return false;
  }
};
