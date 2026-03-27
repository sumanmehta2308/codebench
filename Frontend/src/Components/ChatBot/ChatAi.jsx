import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import ReactMarkdown from "react-markdown";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ChatAi = ({ problem }) => {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: `Hi! I'm your CodeBench Tutor. Need help with **${problem?.title}**?`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const onSubmit = async (data) => {
    if (!data.message.trim()) return;

    const userMessage = { role: "user", text: data.message };
    setMessages((prev) => [...prev, userMessage]);
    reset();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${BACKEND_URL}/ai/chat`,
        {
          message: userMessage.text,
          problemTitle: problem.title,
          problemDescription: problem.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: response.data.text },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "⚠️ Sorry, I am having trouble connecting right now.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* CSS for a sleek, dark scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4B5563; }
      `}</style>

      <div className="flex flex-col h-[60vh] min-h-[400px] w-full bg-[#0b141a] rounded-lg overflow-hidden shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3 border-b border-gray-700 shadow-sm z-10 shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#00a884] flex items-center justify-center text-white font-bold text-sm shadow-lg">
            AI
          </div>
          <div>
            <h3 className="text-gray-100 font-semibold leading-tight text-sm tracking-wide">
              CodeBench Tutor
            </h3>
            <p className="text-[#00a884] text-[11px] font-medium tracking-wider uppercase">
              Online
            </p>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0b141a]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 shadow-md ${
                  msg.role === "user"
                    ? "bg-[#005c4b] text-[#e9edef] rounded-t-xl rounded-bl-xl rounded-br-sm"
                    : "bg-[#202c33] text-[#e9edef] rounded-t-xl rounded-br-xl rounded-bl-sm"
                }`}
              >
                {/* 💡 The ReactMarkdown component renders code blocks and bold text properly! */}
                <div className="text-[14.5px] leading-relaxed markdown-body">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        return !inline ? (
                          <div className="bg-[#111b21] rounded-md p-3 my-2 overflow-x-auto text-sm font-mono border border-gray-700 text-green-300 custom-scrollbar">
                            <code {...props}>{children}</code>
                          </div>
                        ) : (
                          <code
                            className="bg-[#111b21] px-1.5 py-0.5 rounded text-yellow-400 font-mono text-[13px]"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] text-[#8696a0] px-4 py-2.5 rounded-t-xl rounded-br-xl rounded-bl-sm text-sm animate-pulse shadow-md">
                typing...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-[#202c33] p-3 shrink-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type a message..."
              {...register("message", { required: true })}
              className="input w-full bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] focus:outline-none rounded-full border-none px-5 h-11 text-[14.5px] shadow-inner"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-[#00a884] hover:bg-[#008f6f] transition-all duration-200 shrink-0 shadow-lg disabled:opacity-50 disabled:scale-95"
            >
              <svg
                xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                viewBox="0 0 24 24"
                fill="white"
                className="w-5 h-5 ml-0.5"
              >
                <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatAi;
