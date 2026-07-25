import React from 'react';

export default function FormattedMarkdown({ content }) {
  if (!content) return null;

  // Split into paragraphs / lines
  const lines = content.split('\n');

  return (
    <div className="space-y-3 text-gray-100 leading-relaxed text-base sm:text-lg select-text">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        // Header check ### or ##
        if (trimmed.startsWith('###') || trimmed.startsWith('##') || trimmed.startsWith('#')) {
          const cleanHeading = trimmed.replace(/^#+\s*/, '');
          return (
            <h3 key={idx} className="text-xl sm:text-2xl font-extrabold text-brand-orange mt-4 mb-2">
              {parseBold(cleanHeading)}
            </h3>
          );
        }

        // Bullet list check (- or * or 1.)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
          const cleanBullet = trimmed.replace(/^([-*]|\d+\.)\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-3 my-1.5 pl-2 sm:pl-4">
              <span className="w-2 h-2 rounded-full bg-brand-orange mt-2.5 shrink-0" />
              <p className="flex-1 text-gray-200">{parseBold(cleanBullet)}</p>
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-gray-200 leading-relaxed">
            {parseBold(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Helper to replace **bold** tags cleanly with <strong>
function parseBold(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-white px-0.5">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}