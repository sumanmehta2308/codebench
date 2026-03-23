const { GoogleGenerativeAI } = require("@google/generative-ai");
// You said you will handle the API key, so we just pull it from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askAiTutor = async (req, res) => {
  try {
    const { message, problemTitle, problemDescription } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    // 💡 SYSTEM CONFIGURATION: Strictly locking it down to DSA & Specific Languages
    const systemPrompt = `
      You are an expert Data Structures and Algorithms (DSA) tutor for a platform called CodeBench.
      
      CURRENT PROBLEM CONTEXT:
      The user is currently solving: "${problemTitle}"
      Problem Description: "${problemDescription}"

      STRICT RULES:
      1. You must ONLY answer questions related to Data Structures, Algorithms, and the current problem.
      2. You are ONLY allowed to provide code examples or syntax help in these 4 languages: C, C++, Java, and Python.
      3. If the user asks about ANY other topic (e.g., web development, movies, general chat, or other languages like JavaScript/Ruby), you MUST reply: "I am a CodeBench AI Tutor. I can only assist you with DSA concepts and the current problem in C, C++, Java, or Python."
      4. Be encouraging, but do not just give the complete final answer immediately. Give hints first.
      
      User's Question: ${message}
    `;
    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();
    res.status(200).json({ success: true, text: responseText });
  } catch (error) {
    console.error("AI Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "AI Assistant is currently unavailable.",
      });
  }
};

module.exports = { askAiTutor };
