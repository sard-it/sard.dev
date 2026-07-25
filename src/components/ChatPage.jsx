import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Calendar, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { saveAppointment } from "../utils/calendarStorage";
import sardLogo from "../assets/logo.png";
import aiLogo from "../assets/ai-logo.png";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";

const GEMINI_API_KEY = "AQ.Ab8RN6JFxh9sEr6mx0qxFaqL8rOyUFwogCpq13ATzb5tJrdS5A";

// Robust multi-model API query starting with gemini-2.5-flash
async function queryGemini(contents, systemInstructionText) {
  const models = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
  ];

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemInstructionText }]
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (err) {
      console.warn(`Attempt with ${model} failed, trying next fallback...`, err);
    }
  }

  throw new Error("Unable to connect to Gemini AI model endpoint.");
}

export default function ChatPage() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const [textPrompt, setTextPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [started, setStarted] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const messagesEndRef = useRef(null);

  const systemInstruction = `
You are Sard AI Assistant (مساعد سرد للذكاء الاصطناعي).
Respond accurately in the language used by the user (${isRTL ? "Arabic" : "English"}).

Key Knowledge:
1. B2B Services:
   - Process Automation (أتمتة العمليات اليومية للشركات)
   - Operational Cost Reduction & Money Saving (تقليل التكاليف التشغيلية وتوفير المال)
   - Maximizing Efficiency & Productivity (رفع الكفاءة والإنتاجية لأقصى درجة)
2. B2C Services:
   - Personal daily tasks helper for individuals to complete work faster and simplify life.
   - AI as a supportive friend/co-pilot, not a threat.
3. Appointments & Calendar Booking:
   - Working hours: 12:00 PM to 12:00 AM.
   - If user asks to book a meeting (e.g., "أريد حجز موعد غداً الساعة 2 ظهراً"), acknowledge politely and append:
     "[BOOKING_REQUEST: Date: YYYY-MM-DD | Time: HH:MM AM/PM | Name: GuestName | Service: ServiceName]" at the end.
`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit() {
    const text = textPrompt.trim();
    if (!text) return;

    if (!started) setStarted(true);

    const userMsg = { sender: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setTextPrompt("");
    setLoading(true);

    try {
      const conversationContents = messages.map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));
      conversationContents.push({
        role: "user",
        parts: [{ text }]
      });

      let reply = await queryGemini(conversationContents, systemInstruction);

      // Check if AI requested a calendar booking
      if (reply.includes("[BOOKING_REQUEST:")) {
        try {
          const match = reply.match(/\[BOOKING_REQUEST:\s*Date:\s*([\d-]+)\s*\|\s*Time:\s*([\d:\s\w]+)\s*\|\s*Name:\s*([^|]+)\s*\|\s*Service:\s*([^\]]+)\]/i);
          if (match) {
            const date = match[1].trim();
            const timeSlot = match[2].trim();
            const name = match[3].trim() || 'Chat User';
            const service = match[4].trim() || 'AI Consultation';

            const newBooking = saveAppointment({
              date: date || new Date().toISOString().split('T')[0],
              timeSlot: timeSlot || '02:00 PM',
              name,
              email: 'chat@sard.ai',
              service,
              notes: 'Booked via Sard AI Chat Assistant'
            });

            setLastBooking(newBooking);
            reply = reply.replace(/\[BOOKING_REQUEST:[^\]]+\]/g, "").trim() +
              (isRTL ? "\n\n✅ تم تسجيل موعدك بنجاح في الكالندر!" : "\n\n✅ Your appointment has been recorded in the Calendar!");
          }
        } catch (e) {
          console.error("Failed parsing booking tag", e);
        }
      }

      setMessages(prev => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        sender: "bot",
        text: isRTL
          ? "أهلاً بك! يمكنك الاستفسار عن أتمتة الأعمال وتقليل التكاليف أو حجز موعد مباشرة من هنا."
          : "Welcome! You can inquire about process automation or book a meeting directly here."
      }]);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">

      {/* Top Header */}
      <div className="w-full border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img src={sardLogo} alt="Sard AI" className="w-10 h-10 object-contain" />
          <span className="font-bold text-lg sm:text-xl text-white tracking-wide">Sard AI Chat</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/calendar"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs sm:text-sm font-semibold hover:bg-brand-orange/20 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('chat.viewCalendar')}</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Booking Success Banner */}
      {lastBooking && (
        <div className="w-full max-w-4xl px-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-brand-orange" />
              <div>
                <p className="text-sm font-bold text-white">{t('chat.bookedBanner')}</p>
                <p className="text-xs text-gray-300">{lastBooking.date} - {lastBooking.timeSlot}</p>
              </div>
            </div>
            <Link
              to="/calendar"
              className="px-3 py-1.5 bg-brand-orange text-black font-bold text-xs rounded-lg hover:bg-brand-orange-400"
            >
              {t('chat.viewCalendar')}
            </Link>
          </motion.div>
        </div>
      )}

      {/* Main Chat Stream Container */}
      <div className="w-full max-w-4xl flex-1 flex flex-col px-4 py-6 space-y-8">

        {/* Initial Welcome Banner if no chat started */}
        {!started && (
          <div className="text-center py-12 space-y-4">
            <div className="w-20 h-20 bg-brand-orange/10 border border-brand-orange/30 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden p-2">
              <img src={aiLogo} alt="AI Logo" className="w-full h-full object-contain animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{t('chat.welcomeTitle')}</h1>
            <p className="text-gray-400 text-base max-w-lg mx-auto">{t('chat.welcomeDesc')}</p>
          </div>
        )}

        {/* Messages Stream */}
        <div className="flex-1 space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-full flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" ? (
                /* Pro AI Full-width Response Layout with Leaf Wreath Emblem */
                <div className="w-full flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-gray-100 leading-relaxed text-base sm:text-lg">
                  <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center shrink-0 p-1">
                    <img src={aiLogo} alt="AI Avatar" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 space-y-2 whitespace-pre-line">
                    <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">Sard AI Assistant</p>
                    <div className="text-gray-200">{msg.text}</div>
                  </div>
                </div>
              ) : (
                /* Compact User Message Bubble */
                <div className="flex items-center gap-3 max-w-[85%] sm:max-w-[70%]">
                  <div className="px-5 py-3.5 rounded-2xl bg-brand-orange text-black font-semibold text-base shadow-lg shadow-brand-orange/20">
                    {msg.text}
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* 3-Pulsing Dots Loader Animation */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 items-center"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center shrink-0 p-1">
                <img src={aiLogo} alt="AI Avatar" className="w-full h-full object-contain animate-spin" />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-brand-orange rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2.5 h-2.5 bg-brand-orange rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2.5 h-2.5 bg-brand-orange rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-4 z-20 pt-2">
          <div className="flex items-center bg-black/90 border border-white/20 hover:border-brand-orange/60 focus-within:border-brand-orange rounded-2xl p-2 sm:p-3 shadow-2xl transition-all">
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
              placeholder={t('chat.inputPlaceholder')}
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none px-4 py-2 text-base sm:text-lg"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !textPrompt.trim()}
              className={`p-3 sm:p-4 rounded-xl font-bold transition-all ${
                textPrompt.trim() && !loading
                  ? "bg-brand-orange text-black hover:bg-brand-orange-400 shadow-md shadow-brand-orange/30 cursor-pointer"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isRTL ? <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" /> : <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}