import { useState, useRef, useEffect } from "react";
import { AnimatedBlob } from "../components/AnimatedBlob";
import { motion } from "framer-motion";
import { Cpu, Send } from "lucide-react";

export default function ChatPage() {

  const [textPrompt, setTextPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = "https://sard-api-chats-ai.vercel.app/api/model.js";

  const welcomeMessages = [
    { sender: "bot", text: "Hello! I’m Sard AI — your helpful assistant." },
    { sender: "bot", text: "I can help you answer questions, generate code, or give suggestions." },
    { sender: "bot", text: "Feel free to type anything and I'll respond." }
  ];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit() {
    const text = textPrompt.trim();
    if (!text) return;

    if (!started) setStarted(true); // hide blob after first message

    setMessages(prev => [...prev, { sender: "user", text }]);
    setTextPrompt("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: text })
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply ?? "Error: No response";

      setMessages(prev => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: "bot", text: "Error: " + err.message }]);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">

      {/* AnimatedBlob and Welcome text */}
      {!started && (
        <div className="w-full flex flex-col items-center mt-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-4"
          >
            Welcome in Sard AI
          </motion.h1>
          <div className=" ">
            <AnimatedBlob width="md:w-full" height="h-[100px] md:h-[130px]" />
          </div>
        </div>
      )}

      {/* Chat Box */}
      <div className="w-full max-w-3xl flex flex-col flex-1 mt-6 mb-6 p-6 ">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
          {!started
            ? welcomeMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="px-4 py-2 max-w-[75%] break-words rounded-xl text-sm md:text-base bg-[#2b2b2b] text-white self-start rounded-bl-none"
              >
                {msg.text}
              </motion.div>
            ))
            : messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`px-4 py-2 max-w-[75%] break-words rounded-xl
            ${msg.sender === "user"
                    ? "bg-[#ef9c00] text-white self-end rounded-br-none"
                    : "bg-[#2b2b2b] text-white self-start rounded-bl-none"
                  }`}
              >
                {msg.text}
              </motion.div>
            ))
          }
          <div ref={messagesEndRef} />
        </div>




        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex  border border-gray-200  rounded-full p-2">
          <input
            type="text"
            value={textPrompt}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
            onChange={(e) => setTextPrompt(e.target.value)}
            placeholder="What do you want to know?"
            className="flex-1 rounded-full px-4 py-3 bg-transparent text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-transparent"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="ml-2 p-1 h-12 w-12 flex justify-center items-center rounded-full bg-[#ef9b00b7] hover:bg-[#ef9b00cf] text-white font-semibold"
          >
            {loading ? <Cpu className="animate-spin" size={18} /> : <Send size={18} />}

          </button>
        </motion.div>
      </div>
    </div>
  );
}
