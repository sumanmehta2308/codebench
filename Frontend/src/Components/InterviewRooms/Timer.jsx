import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Timer = ({ previlige, remoteSocketId }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState("");
  // 💡 Pulled directly from Redux
  const { socket } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!socket) return;
    const handleTimeSync = ({ tm }) => setTime(tm);
    socket.on("change:time", handleTimeSync);
    return () => socket.off("change:time", handleTimeSync);
  }, [socket]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (previlige && remoteSocketId && socket) {
      socket.emit("time:change", { remoteSocketId, tm: time });
    }
  }, [time, previlige, remoteSocketId, socket]);

  const handleStart = () => {
    if (inputTime > 0) {
      setTime(60 * inputTime);
      setIsRunning(true);
      setInputTime("");
    }
  };

  const handleStop = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setInputTime("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center pb-2 bg-gray-800 rounded-lg text-white w-full">
      <div className="px-4 py-2 bg-black rounded-lg text-3xl md:text-4xl font-semibold mb-4 w-full text-center">
        {formatTime(time)}
      </div>
      {previlige && (
        <div className="flex flex-wrap justify-center gap-2 space-x-0 md:space-x-1 w-full">
          <button
            onClick={handleStart}
            className="bg-green-500 text-white py-1.5 px-3 rounded-lg text-xs hover:bg-green-600 flex-1 sm:flex-none"
          >
            Start
          </button>
          <button
            onClick={handleStop}
            className="bg-red-500 text-white py-1.5 px-3 rounded-lg text-xs hover:bg-red-600 flex-1 sm:flex-none"
          >
            Stop
          </button>
          <button
            onClick={handleReset}
            className="bg-blue-500 text-white py-1.5 px-3 rounded-lg text-xs hover:bg-blue-600 flex-1 sm:flex-none"
          >
            Reset
          </button>
          <input
            type="number"
            min="0"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            placeholder="Mins"
            className="px-2 py-1.5 w-16 md:w-20 rounded-md text-black text-xs md:text-sm text-center"
          />
        </div>
      )}
    </div>
  );
};

export default Timer;
