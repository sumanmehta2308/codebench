import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const backendURL =import.meta.env.VITE_BACKEND_URL_FOR_SOCKET;
const socket = io(backendURL);

// 💡 THE FIX: Redux checks localStorage BEFORE the app even loads
const storedUser = localStorage.getItem("user");
const initialUser = storedUser ? JSON.parse(storedUser) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    socket: socket,
    // 💡 If a user is found in storage, log them in instantly
    user: initialUser,
    // 💡 Set status to true if initialUser exists
    status: !!initialUser,
  },
  reducers: {
    login(state, action) {
      state.status = true;
      state.user = action.payload;
    },
    logout(state) {
      state.status = false;
      state.user = null;
    },
    setSocket(state, action) {
      state.socket = action.payload;
    },
  },
});

export const { login, logout, setSocket } = authSlice.actions;
export default authSlice.reducer;
