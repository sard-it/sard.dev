import { useState, useEffect } from 'react';
import FormattedMarkdown from './FormattedMarkdown';

export default function StreamingBotMessage({ fullText, isRTL }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!fullText) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex += Math.floor(Math.random() * 5) + 3;
      if (currentIndex >= fullText.length) {
        setDisplayedText(fullText);
        clearInterval(interval);
      } else {
        setDisplayedText(fullText.slice(0, currentIndex));
      }
    }, 15);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="w-full py-2 text-gray-100 leading-relaxed text-base sm:text-lg">
      <div className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
        Sard AI
      </div>
      <FormattedMarkdown content={displayedText} />
    </div>
  );
}