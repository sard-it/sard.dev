import React from 'react';

export default function FormattedMarkdown({ content }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-gray-200 leading-relaxed text-base sm:text-lg select-text">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Header check ### or ##
        if (trimmed.startsWith('###') || trimmed.startsWith('##') || trimmed.startsWith('#')) {
          const cleanHeading = trimmed.replace(/^#+\s*/, '');
          return (
            <h3 key={idx} className="text-lg sm:text-xl font-bold text-brand-orange mt-3 mb-1">
              {parseBold(cleanHeading)}
            </h3>
          );
        }

        // Bullet list check (- or * or 1.)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
          const cleanBullet = trimmed.replace(/^([-*]|\d+\.)\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 my-1">
              <span className="text-brand-orange font-bold">•</span>
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

function parseBold(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}