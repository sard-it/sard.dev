import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Cpu } from 'lucide-react';

const THOUGHTS_AR = [
  "جاري قراءة وتحليل استفسارك...",
  "فحص أحدث خوارزميات الذكاء الاصطناعي وجدول المواعيد...",
  "مراجعة عقود الشراكات والاستشارات المتاحة بـ Sard AI...",
  "صياغة الإجابة الأكثر دقة لأتمتة أعمالك وتسهيل مهامك..."
];

const THOUGHTS_EN = [
  "Analyzing your request...",
  "Querying Sard AI core intelligence engine...",
  "Checking strategic partnerships and calendar availability...",
  "Formatting optimal response for maximum efficiency..."
];

export default function ThinkingIndicator({ isRTL = true }) {
  const [seconds, setSeconds] = useState(0);
  const [thoughtIndex, setThoughtIndex] = useState(0);

  const thoughts = isRTL ? THOUGHTS_AR : THOUGHTS_EN;

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const thoughtTimer = setInterval(() => {
      setThoughtIndex((prev) => (prev + 1) % thoughts.length);
    }, 2200);

    return () => {
      clearInterval(timer);
      clearInterval(thoughtTimer);
    };
  }, [thoughts.length]);

  return (
    <div className="w-full p-6 rounded-2xl bg-white/5 border border-brand-orange/30 backdrop-blur-md space-y-4">
      {/* Header bar with timer */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3 text-brand-orange">
          <Brain className="w-6 h-6 animate-pulse" />
          <span className="text-sm font-extrabold uppercase tracking-widest text-brand-orange">
            {isRTL ? "جاري التفكير والتجهيز..." : "Sard AI Reasoning..."}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-brand-orange/20 px-3 py-1 rounded-full text-brand-orange border border-brand-orange/30">
          <Cpu className="w-3.5 h-3.5 animate-spin" />
          <span>{seconds}s</span>
        </div>
      </div>

      {/* Thought stream text carousel */}
      <div className="h-8 flex items-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={thoughtIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-sm text-gray-300 font-medium"
          >
            <Sparkles className="w-4 h-4 text-brand-orange shrink-0 animate-spin" />
            <span>{thoughts[thoughtIndex]}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Shimmer loading bar */}
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-orange/20 via-brand-orange to-brand-orange/20"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}