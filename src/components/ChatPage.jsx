import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { saveAppointment } from "../utils/calendarStorage";
import { supabase } from "../integrations/supabase/client";
import sardLogo from "../assets/logo.png";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import ThinkingIndicator from "./ThinkingIndicator";
import StreamingBotMessage from "./StreamingBotMessage";

const GEMINI_API_KEY = "AQ.Ab8RN6JFxh9sEr6mx0qxFaqL8rOyUFwogCpq13ATzb5tJrdS5A";

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

  const [textPrompt, setTextPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [started, setStarted] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const [partnersInfo, setPartnersInfo] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function fetchPartners() {
      const { data, error } = await supabase
        .from('partnerships')
        .select('*')
        .eq('is_active', true);

      if (!error && data && data.length > 0) {
        const formatted = data.map(p => `
Partner Name: ${p.partner_name_ar} / ${p.partner_name_en}
Description: ${p.description_ar || ''} / ${p.description_en || ''}
Contract Date: ${p.contract_date || 'N/A'}
Contract Details: ${p.contract_details_ar || ''} / ${p.contract_details_en || ''}
        `).join('\n---\n');

        setPartnersInfo(formatted);
      }
    }

    fetchPartners();
  }, []);

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
3. Partnerships & Official Contracts Knowledge:
Below are Sard AI's active strategic partnerships and contract details:
${partnersInfo || "Sard AI maintains official partnerships with key industry leaders to provide integrated smart solutions."}

4. Appointments & Calendar Booking:
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
          ? "أهلاً بك! يمكنك الاستفسار عن أتمتة الأعمال وسؤالنا عن شراكاتنا وتفاصيل عقودنا أو حجز موعد مباشرة من هنا."
          : "Welcome! You can inquire about process automation, ask about our partnerships and contracts, or book a meeting directly."
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
        <div className="w-full max-w-3xl px-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-orange" />
              <span>{t('chat.bookedBanner')} ({lastBooking.date} - {lastBooking.timeSlot})</span>
            </div>
            <Link
              to="/calendar"
              className="px-2.5 py-1 bg-brand-orange text-black font-bold rounded hover:bg-brand-orange-400"
            >
              {t('chat.viewCalendar')}
            </Link>
          </motion.div>
        </div>
      )}

      {/* Main Chat Stream Container directly on page background */}
      <div className="w-full max-w-3xl flex-1 flex flex-col px-4 py-6 space-y-6">

        {/* Welcome Text */}
        {!started && (
          <div className="py-8 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{t('chat.welcomeTitle')}</h1>
            <p className="text-gray-400 text-sm">{t('chat.welcomeDesc')}</p>
          </div>
        )}

        {/* Messages List - Direct Text on Page */}
        <div className="flex-1 space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {msg.sender === "bot" ? (
                /* Plain Text AI Response on Page Background */
                <StreamingBotMessage fullText={msg.text} isRTL={isRTL} />
              ) : (
                /* Plain Text User Prompt */
                <div className="w-full py-2 flex justify-end">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">You</span>
                    <p className="text-brand-orange font-semibold text-base sm:text-lg">{msg.text}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* Minimal Text Thinking Line */}
          {loading && <ThinkingIndicator isRTL={isRTL} />}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Box */}
        <div className="sticky bottom-4 z-20 pt-2">
          <div className="flex items-center bg-black border border-white/20 focus-within:border-brand-orange rounded-xl p-2 shadow-xl">
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
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none px-3 py-1.5 text-sm sm:text-base"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !textPrompt.trim()}
              className={`p-2.5 rounded-lg font-bold transition-all ${
                textPrompt.trim() && !loading
                  ? "bg-brand-orange text-black hover:bg-brand-orange-400 cursor-pointer"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isRTL ? <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}