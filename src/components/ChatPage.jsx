import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, Send, Calendar, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { saveAppointment, getBookedAppointments } from "../utils/calendarStorage";
import sardLogo from "../assets/logo.png";

const GEMINI_API_KEY = "AQ.Ab8RN6JFxh9sEr6mx0qxFaqL8rOyUFwogCpq13ATzb5tJrdS5A";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_INSTRUCTION = `
You are Sard AI Assistant (مساعد سرد للذكاء الاصطناعي).
Your role is to represent Sard AI (سرد AI) and assist visitors with B2B and B2C inquiries in Arabic or English.

Key Knowledge about Sard AI:
1. B2B Services:
   - Process Automation (أتمتة العمليات اليومية للشركات)
   - Operational Cost Reduction & Saving Money (تقليل التكاليف التشغيلية وتوفير المال)
   - Maximizing Efficiency & Productivity (رفع الكفاءة والإنتاجية إلى أقصى حد)
   - Custom AI Integration & Data Intelligence.
2. B2C Services:
   - Daily Tasks Co-Pilot (مساعد شخصي لإنجاز المهام اليومية للأفراد بسرعة وتسهيل الحياة).
   - AI as a supportive partner/friend, not a threat or competitor.
3. Appointments & Calendar Booking:
   - You CAN help users book appointments for consultation or meetings!
   - Available slots are between 09:00 AM and 08:00 PM.
   - If user asks to book a meeting or appointment (e.g., "أريد حجز موعد غداً الساعة 10 صباحاً"), acknowledge the booking politely and include the special text pattern:
     "[BOOKING_REQUEST: Date: YYYY-MM-DD | Time: HH:MM AM/PM | Name: Name/Guest | Service: ServiceName]" in your response so our system automatically persists it to the Calendar.

Tone: Professional, helpful, friendly, and enthusiastic about AI empowering human life and business.
`;

export default function ChatPage() {
  const [textPrompt, setTextPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [started, setStarted] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const welcomeMessages = [
    { sender: "bot", text: "أهلاً بك! أنا مساعد سرد للذكاء الاصطناعي (Sard AI Assistant)." },
    { sender: "bot", text: "يمكنني مساعدتك في التعرف على خدماتنا في أتمتة الأعمال وتقليل التكاليف، أو إنجاز مهامك اليومية، وكذلك حجز موعد مع الفريق." },
    { sender: "bot", text: "كيف يمكنني دعمك اليوم؟" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit() {
    const text = textPrompt.trim();
    if (!text) return;

    if (!started) setStarted(true);

    const userMsg = { sender: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setTextPrompt("");
    setLoading(true);

    try {
      // Build conversation history for Gemini
      const conversationContents = messages.map(msg => ({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      }));
      conversationContents.push({
        role: "user",
        parts: [{ text }]
      });

      const res = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: conversationContents,
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Gemini API Response Status: ${res.status}`);
      }

      const data = await res.json();
      let reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "عذراً، لم أستطع فهم الطلب حالياً.";

      // Check if AI requested a calendar booking
      if (reply.includes("[BOOKING_REQUEST:")) {
        try {
          const bookingMatch = reply.match(/\[BOOKING_REQUEST:\s*Date:\s*([\d-]+)\s*\|\s*Time:\s*([\d:\s\w]+)\s*\|\s*Name:\s*([^|]+)\s*\|\s*Service:\s*([^\]]+)\]/i);
          if (bookingMatch) {
            const date = bookingMatch[1].trim();
            const timeSlot = bookingMatch[2].trim();
            const name = bookingMatch[3].trim() || 'زائر عبر الشات';
            const service = bookingMatch[4].trim() || 'استشارة ذكاء اصطناعي';

            const newBooking = saveAppointment({
              date: date || new Date().toISOString().split('T')[0],
              timeSlot: timeSlot || '11:00 AM',
              name,
              email: 'chat-user@sard.ai',
              service,
              notes: 'حجز تلقائي عبر المساعد الذكي'
            });

            setLastBooking(newBooking);
            reply = reply.replace(/\[BOOKING_REQUEST:[^\]]+\]/g, "").trim() + "\n\n✅ تم تسجيل موعدك بنجاح في جدول الكالندر!";
          }
        } catch (e) {
          console.error("Failed parsing booking tag", e);
        }
      }

      setMessages(prev => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: "bot", text: "عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي: " + err.message }]);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">

      {/* Header Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center py-4 border-b border-white/10 mb-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={sardLogo} alt="Sard AI" className="w-10 h-10 object-contain" />
          <span className="font-bold text-lg text-white">Sard AI Chat</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/calendar"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm text-brand-orange transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>جدول المواعيد</span>
          </Link>

          <button
            onClick={() => navigate('/')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs sm:text-sm text-gray-300"
          >
            الرئيسية
          </button>
        </div>
      </div>

      {/* Welcome Header */}
      {!started && (
        <div className="w-full max-w-2xl text-center my-6 space-y-3">
          <img src={sardLogo} alt="Sard AI" className="w-16 h-16 object-contain mx-auto mb-2" />
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-bold text-white"
          >
            مرحباً بك في Sard AI Assistant
          </motion.h1>
          <p className="text-gray-400 text-sm sm:text-base">
            مساعدك الذكي لأتمتة أعمالك، توفير التكاليف، حجز المواعيد وتسهيل مهامك اليومية
          </p>
        </div>
      )}

      {/* Booking Alert Banner if booked via chat */}
      {lastBooking && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl mb-4 p-4 rounded-xl bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-brand-orange" />
            <div>
              <p className="text-sm font-bold text-white">تم تأكيد الموعد عبر الشات!</p>
              <p className="text-xs text-gray-300">{lastBooking.date} - الساعة {lastBooking.timeSlot}</p>
            </div>
          </div>
          <Link
            to="/calendar"
            className="px-3 py-1.5 bg-brand-orange text-black font-semibold text-xs rounded-lg hover:bg-brand-orange-400"
          >
            عرض الكالندر
          </Link>
        </motion.div>
      )}

      {/* Chat Box */}
      <div className="w-full max-w-3xl flex flex-col flex-1 my-2 p-4 bg-white/5 border border-white/10 rounded-2xl">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 flex flex-col min-h-[350px] max-h-[500px]">
          {!started
            ? welcomeMessages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.15 }}
                className="px-4 py-3 max-w-[85%] sm:max-w-[75%] break-words rounded-2xl text-sm md:text-base bg-[#2b2b2b] text-white self-start rounded-bl-none border border-white/10"
              >
                {msg.text}
              </motion.div>
            ))
            : messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`px-4 py-3 max-w-[85%] sm:max-w-[75%] break-words rounded-2xl text-sm md:text-base leading-relaxed
            ${msg.sender === "user"
                    ? "bg-brand-orange text-black font-medium self-end rounded-br-none"
                    : "bg-[#252525] text-white self-start rounded-bl-none border border-white/10"
                  }`}
              >
                {msg.text}
              </motion.div>
            ))
          }
          {loading && (
            <div className="px-4 py-3 bg-[#252525] text-brand-orange text-sm rounded-2xl self-start flex items-center gap-2">
              <Cpu className="animate-spin w-4 h-4" />
              <span>جاري المعالجة بواسطة Sard AI...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-4 flex items-center border border-white/20 bg-black/50 rounded-full p-2 focus-within:border-brand-orange transition-all">
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
            placeholder="اكتب استفسارك أو اطلب حجز موعد هنا..."
            className="flex-1 rounded-full px-4 py-2 bg-transparent text-white placeholder-gray-500 outline-none text-sm sm:text-base"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="p-3 rounded-full bg-brand-orange hover:bg-brand-orange-400 text-black font-bold transition-transform active:scale-95"
          >
            {loading ? <Cpu className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}