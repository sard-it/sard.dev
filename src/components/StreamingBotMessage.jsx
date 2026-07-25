import { useState, useEffect } from 'react';
import FormattedMarkdown from './FormattedMarkdown';
import aiLogo from '../assets/ai-logo.png';

export default function StreamingBotMessage({ fullText, isRTL }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!fullText) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex += Math.floor(Math.random() * 4) + 2; // Stream speed
      if (currentIndex >= fullText.length) {
        setDisplayedText(fullText);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setDisplayedText(fullText.slice(0, currentIndex));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="w-full flex gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-gray-100 leading-relaxed text-base sm:text-lg">
      {/* Clean Logo without any box or background container */}
      <img
        src={aiLogo}
        alt="Sard AI Logo"
        className="w-12 h-12 sm:w-14 sm:h-14 object-contain mix-blend-screen shrink-0 mt-1"
      />

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
            Sard AI Assistant
          </span>
          {isTyping && (
            <span className="text-[10px] text-brand-orange font-mono animate-pulse px-2 py-0.5 rounded bg-brand-orange/10 border border-brand-orange/30">
              {isRTL ? "جاري الكتابة..." : "Streaming..."}
            </span>
          )}
        </div>

        {/* Clean Formatted Output */}
        <FormattedMarkdown content={displayedText} />
      </div>
    </div>
  );
}