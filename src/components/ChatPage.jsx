import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send, ArrowRight, ArrowLeft, RefreshCw, Cpu, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import sardITLogo from "../assets/logo.png";

export default function ChatPage() {
  const [textPrompt, setTextPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Gemini API Key for Gemini 2.5 Flash
  const GEMINI_API_KEY = "AIzaSyD-YOUR_KEY_HERE_PLACEHOLDER"; 
  const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const welcomeMessages = [
    { sender: "bot", text: "أهلاً بك! أنا مساعد الذكاء الاصطناعي (sard-2.1) المطور بواسطة شركة سرد AI (Sard AI)." },
    { sender: "bot", text: "كيف يمكنني مساعدتك اليوم في أتمتة أعمالك، تسريع إجراءات المؤسسة، أو الإجابة عن استفساراتك التقنية؟" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit() {
    const text = textPrompt.trim();
    if (!text || loading) return;

    const userMsg = { sender: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setTextPrompt("");
    setLoading(true);

    try {
      // System instructions specifying sard-2.1 model developed by Sard AI
      const systemInstruction = `أنت المساعد الذكي لموديل "sard-2.1" المطور حصرياً بواسطة شركة "سرد AI" (Sard AI). 
مهامك هي تقديم الدعم والمعلومات الدقيقة حول أنظمة أتمتة المؤسسات والشركات، برمجيات الذكاء الاصطناعي، وإجابة استفسارات المستخدم بأسلوب احترافي وعالي الدقة للأنشطة التجارية والتكنولوجية. 
عند سؤالك عن هويتك دائماً اذكر أنك الموديل sard-2.1 الخاص بشركة Sard AI.`;

      // Build contents history
      const contents = [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\nسؤال المستخدم: ${text}` }]
        }
      ];

      const res = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
      });

      if (!res.ok) {
        // Fallback or handle API response error gracefully
        throw new Error(`تعذر الاتصال بالموديل: ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text 
        ?? "عذراً، لم أستطع معالجة الإجابة حالياً. يرجى المحاولة مرة أخرى.";

      setMessages(prev => [...prev, { sender: "bot", text: replyText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { 
          sender: "bot", 
          text: `مرحباً بك! أنا موديل sard-2.1 الخاص بشركة Sard AI. يسعدنا تقديم حلول أتمتة الأعمال والذكاء الاصطناعي لمؤسستك.` 
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      
      {/* Top Navigation */}
      <div className="w-full max-w-4xl px-4 py-4 flex items-center justify-between border-b border-white/10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرئيسية</span>
        </button>

        <div className="flex items-center gap-2">
          <img src={sardITLogo} alt="Sard AI" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg text-brand-orange">Sard AI (sard-2.1)</span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="w-full max-w-3xl flex flex-col flex-1 p-4 sm:p-6 my-2">
        
        {/* Chat Title Badge */}
        <div className="flex flex-col items-center text-center my-4 space-y-2">
          <div className="p-3 bg-brand-orange/10 border border-brand-orange/30 rounded-2xl text-brand-orange">
            <Bot className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <span>Sard AI Assistant</span>
            <span className="text-xs bg-brand-orange text-black font-extrabold px-2 py-0.5 rounded-full">sard-2.1</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            مساعد الأتمتة والذكاء الاصطناعي المؤسسي لشركة Sard AI
          </p>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col bg-white/5 rounded-2xl border border-white/10 min-h-[400px] max-h-[550px]">
          {messages.length === 0
            ? welcomeMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.15 }}
                  className="p-3 sm:p-4 max-w-[85%] break-words rounded-2xl text-sm md:text-base bg-[#222222] text-white self-start rounded-tr-none border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-1 text-xs text-brand-orange font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>sard-2.1</span>
                  </div>
                  {msg.text}
                </motion.div>
              ))
            : messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 sm:p-4 max-w-[85%] break-words rounded-2xl text-sm md:text-base ${
                    msg.sender === "user"
                      ? "bg-brand-orange text-black font-semibold self-end rounded-tl-none"
                      : "bg-[#222222] text-white self-start rounded-tr-none border border-white/10"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="flex items-center gap-2 mb-1 text-xs text-brand-orange font-semibold">
                      <Bot className="w-3 h-3" />
                      <span>Sard AI (sard-2.1)</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line">{msg.text}</p>
                </motion.div>
              ))
          }
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="mt-4 flex items-center border border-white/20 bg-white/5 rounded-full p-2 focus-within:border-brand-orange transition-colors">
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
            placeholder="كيف يمكن لـ Sard AI أتمتة مؤسستك؟ اسأل الموديل..."
            className="flex-1 rounded-full px-4 py-2 bg-transparent text-white placeholder-gray-400 outline-none text-sm sm:text-base"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="p-3 rounded-full bg-brand-orange hover:bg-brand-orange-400 text-black font-bold transition-all disabled:opacity-50 flex items-center justify-center shrink-0"
          >
            {loading ? <Cpu className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </div>
  );
}