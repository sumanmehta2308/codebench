import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux"; // 庁 Using Redux instead of useSocket!
import Editor from "@monaco-editor/react";
import Timer from "./Timer.jsx";
import { runExampleCasesService } from "../../Services/CodeRun.service.js";
import Executing from "../Editor/Executing.jsx";
import ExampleCasesOutput from "../Editor/ExampleCasesOutput.jsx";
import ReactPlayer from "react-player";
import { defaultCodes, enterFullScreen } from "./helper.js";
import { toast } from "react-hot-toast";
import peer from "../../Services/peer.js";
import Loading from "../Loading/Loading.jsx";

function Room() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const extraInfo = location.state;

  // 庁 Grab socket and user cleanly from the Redux backpack
  const { socket, user } = useSelector((state) => state.auth);

  const [question, setquestion] = useState("");
  const [show_share_streams, set_show_share_streams] = useState(0);
  const [code, setCode] = useState(defaultCodes.cpp);
  const [cases, setCases] = useState([
    { id: 1, input: "", output: "" },
    { id: 2, input: "", output: "" },
  ]);

  const [remoteUser, setremoteUser] = useState(null);
  const [remoteSocketId, setremoteSocketId] = useState(null);
  const [requsername, setrequestusername] = useState([]);
  const [connectionReady, setconnectionReady] = useState(false);
  const [exampleCasesExecution, setExampleCasesExecution] = useState(null);
  const [previlige, setprevilige] = useState(false);
  const [mystream, setMystream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioOn, setAudioOn] = useState(true);
  const [isVideoOn, setVideoOn] = useState(true);
  const [language, setLanguage] = useState("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [executing, setExecuting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);

  useEffect(() => {
    // 庁 No more localStorage! Just using 'user' directly from Redux
    if (extraInfo && user && extraInfo._id === user._id) {
      setprevilige(true);
    } else if (extraInfo) {
      set_show_share_streams(1);
      enterFullScreen();
      setremoteSocketId(extraInfo);
      setconnectionReady(true);
    }
  }, [remoteSocketId, extraInfo, user]);

  const handleJoinRequest = ({ user, id, requser_id }) => {
    setrequestusername((prev) => [...prev, { user, id, requser_id }]);
  };

  const acceptrequest = (index) => {
    const setmystreamfunc = async () => {
      const offer = await peer.getOffer();
      socket.emit("user:call", {
        remoteSocketId: requsername[index].id,
        offer,
      });
    };
    setmystreamfunc();

    setconnectionReady(true);
    setremoteUser(requsername[index].user);
    setremoteSocketId(requsername[index].id);
    socket.emit("host:req_accepted", {
      ta: socket.id,
      user: requsername[index].user,
      room: roomId,
      id: requsername[index].id,
      requser_id: requsername[index].requser_id,
    });
    setrequestusername([]);
  };

  const help1 = () => {
    if (mystream) mystream.getTracks().forEach((track) => track.stop());
    setMystream(null);
    if (document.fullscreenElement) document.exitFullscreen();
    toast.error("Host Ended call");
    navigate("/join-interview");
  };

  const help2 = ({ msg }) => {
    if (!msg) {
      toast.error("Interviewee left");
      setconnectionReady(false);
      setremoteSocketId(null);
    } else toast.error(msg);
  };

  useEffect(() => {
    peer.peer.addEventListener("track", (ev) => {
      setRemoteStream(ev.streams[0]);
    });
  }, []);

  const handleNegotiation = async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  };

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiation);
    return () =>
      peer.peer.removeEventListener("negotiationneeded", handleNegotiation);
  }, [handleNegotiation]);

  useEffect(() => {
    const startStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMystream(stream);
    };
    startStream();
  }, []);

  const handleIncommingCall = async ({ from, offer }) => {
    const answer = await peer.getAnswer(offer);
    setremoteSocketId(from);
    socket.emit("call:accepted", { to: from, answer });
  };

  const sendstreams = () => {
    if (mystream) {
      mystream
        .getTracks()
        .forEach((track) => peer.peer.addTrack(track, mystream));
    }
    if (!previlige) socket.emit("set:share_streams", { to: remoteSocketId });
    set_show_share_streams(0);
  };

  const handleCallAccepted = async ({ from, answer }) => {
    await peer.setLocalDescription(answer);
    sendstreams();
  };

  useEffect(() => {
    if (!socket) return; // 庁 Added safety check

    socket.on("user:requested_to_join", handleJoinRequest);
    socket.on("host:hasleft", help1);
    socket.on("interviewee:hasleft", help2);
    socket.on("change:code", ({ code }) => setCode(code));
    socket.on("change:question", ({ question }) => setquestion(question));
    socket.on("change:language", ({ language }) => {
      setLanguage(language);
      setCode(defaultCodes[language]);
    });
    socket.on("change:cases", ({ cases }) => setCases(cases));
    socket.on("run:code", ({ exampleCasesExecution }) =>
      setExampleCasesExecution(exampleCasesExecution)
    );
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    });
    socket.on(
      "peer:nego:final",
      async ({ ans }) => await peer.setLocalDescription(ans)
    );
    socket.on("set:share_streams", () => {
      if (previlige) set_show_share_streams(1);
    });

    return () => {
      socket.off("user:requested_to_join", handleJoinRequest);
      socket.off("host:hasleft", help1);
      socket.off("interviewee:hasleft", help2);
      socket.off("change:code");
      socket.off("change:question");
      socket.off("change:language");
      socket.off("change:cases");
      socket.off("run:code");
      socket.off("incomming:call");
      socket.off("call:accepted");
      socket.off("peer:nego:needed");
      socket.off("peer:nego:final");
      socket.off("set:share_streams");
    };
  }, [socket, remoteSocketId, mystream, previlige]);

  const toggleAudio = () => {
    if (mystream) {
      const audioTrack = mystream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioOn(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (mystream) {
      const videoTrack = mystream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoOn(videoTrack.enabled);
      }
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(defaultCodes[newLanguage]);
    socket.emit("language:change", { remoteSocketId, language: newLanguage });
  };

  const handleInputChange = (index, field, value) => {
    if (!previlige) return;
    const newCases = [...cases];
    newCases[index][field] = value;
    setCases(newCases);
    socket.emit("cases:change", { remoteSocketId, cases: newCases });
  };

  const clickRun = async () => {
    setExampleCasesExecution(null);
    setExecuting(true);
    const response = await runExampleCasesService(language, code, cases);
    if (response) {
      setExampleCasesExecution(response);
      if (!previlige)
        socket.emit("code:run", {
          remoteSocketId,
          exampleCasesExecution: response,
        });
    }
    setExecuting(false);
  };

  const exitroom = () => {
    if (mystream) mystream.getTracks().forEach((track) => track.stop());
    setMystream(null);
    if (previlige) {
      socket.emit("host:leave", { remoteSocketId, room: roomId });
      navigate("/host-interview");
    } else {
      socket.emit("interviewee:leave", { remoteSocketId, room: roomId });
      if (document.fullscreenElement) document.exitFullscreen();
      navigate("/join-interview");
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !previlige) {
        toast.error("You Tried to exit Fullscreen");
        socket.emit("interviewee:leave", {
          remoteSocketId,
          room: roomId,
          msg: "Interviewee has Exited Fullscreen",
        });
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !previlige) {
        toast.error("You tried to switch Tab");
        socket.emit("interviewee:leave", {
          remoteSocketId,
          room: roomId,
          msg: "Interviewee tried to switch Tab",
        });
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  });

  if (!mystream) return <Loading />;

  return (
    <div className="min-h-screen lg:h-screen p-4 md:p-6 bg-gray-800 flex flex-col lg:flex-row text-white justify-between lg:justify-evenly gap-4 lg:gap-0 overflow-y-auto lg:overflow-hidden">
      {/* Left Column: Tools & Test Cases */}
      <div className="bg-gray-900 p-4 md:p-6 rounded-lg w-full lg:w-1/4 flex flex-col order-2 lg:order-1 overflow-y-auto">
        <div className="flex flex-col space-y-4 md:space-y-6">
          <div className="flex items-center justify-evenly space-x-2 md:space-x-4">
            <button
              className="bg-red-600 p-2 rounded-lg hover:bg-red-700 transition"
              onClick={exitroom}
            >
              <img
                className="h-5 w-5 md:h-6 md:w-6"
                src="/endcall.png"
                alt="end call"
              />
            </button>
            <button
              className={`p-2 rounded-lg transition ${
                isAudioOn ? "bg-gray-700" : "bg-red-600"
              }`}
              onClick={toggleAudio}
            >
              <img
                className="h-5 w-5 md:h-6 md:w-6"
                src={isAudioOn ? "/micon.png" : "/micoff.png"}
                alt="Mic"
              />
            </button>
            <button
              className={`p-2 rounded-lg transition ${
                isVideoOn ? "bg-gray-700" : "bg-red-600"
              }`}
              onClick={toggleVideo}
            >
              <img
                className="h-5 w-5 md:h-6 md:w-6"
                src={isVideoOn ? "/camera-on.png" : "/camera-off.png"}
                alt="Cam"
              />
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-extrabold text-gray-300 text-center">
              Test Cases
            </h3>
            {executing ? (
              <Executing text={"Executing"} />
            ) : exampleCasesExecution ? (
              <div className="bg-gray-700 rounded-lg p-2 overflow-x-auto">
                <ExampleCasesOutput
                  exampleCasesExecution={exampleCasesExecution}
                />
                <button
                  className="mt-2 px-3 py-1.5 rounded-lg bg-blue-600 w-full sm:w-auto"
                  onClick={() => setExampleCasesExecution(null)}
                >
                  Reset
                </button>
              </div>
            ) : (
              cases.map((exampleCase, index) => (
                <div
                  key={exampleCase.id}
                  className="bg-gray-700 p-3 rounded-lg space-y-2"
                >
                  <input
                    type="text"
                    value={exampleCase.input}
                    placeholder="Input"
                    onChange={(e) =>
                      handleInputChange(index, "input", e.target.value)
                    }
                    className="w-full p-1.5 rounded-md bg-gray-800 text-sm border border-gray-600"
                  />
                  <input
                    type="text"
                    value={exampleCase.output}
                    placeholder="Output"
                    onChange={(e) =>
                      handleInputChange(index, "output", e.target.value)
                    }
                    className="w-full p-1.5 rounded-md bg-gray-800 text-sm border border-gray-600"
                  />
                </div>
              ))
            )}
            <div className="bg-gray-800 p-2 rounded-lg shadow-lg">
              <Timer previlige={previlige} remoteSocketId={remoteSocketId} />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Column: Editor */}
      <div className="px-4 md:px-6 bg-gray-900 mx-0 lg:mx-4 rounded-lg p-4 md:p-8 w-full lg:w-1/2 order-1 lg:order-2 flex flex-col h-[60vh] lg:h-full">
        <div className="flex justify-between items-center border-b-2 border-gray-700 pb-4 mb-4">
          <div className="flex space-x-2">
            <button
              onClick={clickRun}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-green-600 rounded-lg text-xs md:text-sm font-bold"
            >
              Run
            </button>
            <button
              onClick={() => setShowQuestion(!showQuestion)}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-600 rounded-lg text-xs md:text-sm font-bold"
            >
              Question
            </button>
          </div>
          <div className="flex space-x-2">
            <select
              onChange={(e) => handleLanguageChange(e.target.value)}
              value={language}
              className="p-1 md:p-1.5 bg-gray-800 border border-gray-600 rounded text-xs md:text-sm"
            >
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>
        </div>

        {showQuestion && (
          <div className="absolute z-50 mt-4 w-[90%] lg:w-1/2 max-h-[500px] overflow-y-auto bg-white text-black rounded-lg p-4 md:p-6 shadow-2xl">
            {previlige ? (
              <textarea
                value={question}
                onChange={(e) => {
                  setquestion(e.target.value);
                  socket.emit("question:change", {
                    remoteSocketId,
                    question: e.target.value,
                  });
                }}
                className="w-full h-64 md:h-80 p-2 border border-gray-300 rounded text-sm md:text-base"
              />
            ) : (
              <p className="whitespace-pre-wrap text-sm md:text-base">
                {question}
              </p>
            )}
          </div>
        )}

        <div className="flex-1 min-h-[300px] lg:min-h-0">
          <Editor
            height="100%"
            language={language}
            value={code}
            theme={theme}
            onChange={(e) => {
              setCode(e);
              socket.emit("code:change", { remoteSocketId, code: e });
            }}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      {/* Right Column: Videos & Connection Status */}
      <div className="w-full lg:w-1/4 bg-gray-900 p-4 rounded-lg order-3 flex flex-col overflow-y-auto">
        {connectionReady ? (
          <div className="flex flex-col space-y-4">
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-center text-xs md:text-sm mb-2">
                {remoteUser ? remoteUser.fullname : "Interviewer"}
              </p>
              <div className="h-40 md:h-48 bg-black rounded-lg flex items-center justify-center overflow-hidden">
                {remoteStream ? (
                  <video
                    ref={(v) => {
                      if (v) v.srcObject = remoteStream;
                    }}
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <p className="text-xs text-gray-500">Video Off</p>
                )}
              </div>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="text-center text-xs md:text-sm mb-2">You</p>
              <div className="h-40 md:h-48 bg-black rounded-lg flex items-center justify-center overflow-hidden">
                {isVideoOn ? (
                  <ReactPlayer
                    playing={isVideoOn}
                    muted={!isAudioOn}
                    height="100%"
                    width="100%"
                    url={mystream}
                  />
                ) : (
                  <p className="text-xs text-gray-500">Video Off</p>
                )}
              </div>
            </div>
            {show_share_streams === 1 && (
              <button
                onClick={sendstreams}
                className="w-full py-2 bg-blue-600 rounded-lg text-sm font-semibold"
              >
                Share Stream
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-600 p-3 rounded-lg flex justify-between items-center break-all">
              <p className="font-bold text-sm md:text-base mr-2">
                Room: {roomId}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                  toast.success("Copied!");
                }}
                className="p-1.5 md:p-2 bg-white rounded shrink-0"
              >
                <img className="w-4 md:w-5" src="/copy.png" alt="copy" />
              </button>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm font-bold mb-3">Join Requests</p>
              {requsername.length === 0 && (
                <p className="text-xs text-gray-400">No requests yet.</p>
              )}
              {requsername.map((x, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-700 p-3 rounded mb-2 gap-2 sm:gap-0"
                >
                  <p className="text-xs md:text-sm font-semibold">
                    {x.user.fullname}
                  </p>
                  <button
                    onClick={() => acceptrequest(i)}
                    className="w-full sm:w-auto px-3 py-1.5 bg-green-600 rounded text-xs md:text-sm font-bold"
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Room;
