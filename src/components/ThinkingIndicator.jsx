import React from 'react';

export default function ThinkingIndicator({ isRTL = true }) {
  return (
    <div className="w-full py-2 text-xs text-brand-orange font-medium animate-pulse select-none">
      {isRTL ? "جاري التفكير والتجهيز..." : "Sard AI is thinking..."}
    </div>
  );
}