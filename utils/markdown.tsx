
import React, { useState } from 'react';

// Simple parser components
const Spoiler: React.FC<{ content: string }> = ({ content }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <span 
      onClick={() => setRevealed(true)}
      className={`
        rounded px-1 py-0.5 cursor-pointer transition-colors
        ${revealed ? 'bg-discord-darker text-discord-text-normal' : 'bg-[#202225] text-transparent hover:bg-[#292b2f] select-none'}
      `}
    >
      {content}
    </span>
  );
};

export const renderMarkdown = (text: string) => {
  if (!text) return null;

  // We will split by standard regex patterns and return an array of elements
  // Order matters: Code blocks -> Inline Code -> Spoilers -> Bold -> Italic -> Strikethrough
  
  // 1. Code Blocks (```...```) - For simplicity, we'll handle this at the block level in ChatArea or here if simple
  // Let's do a simple split approach for inline elements.

  const parts = text.split(/(`[^`]+`|\|\|[^|]+\|\||\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~)/g);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="bg-[#2f3136] px-1.5 py-0.5 rounded text-sm font-mono">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('||') && part.endsWith('||')) {
      return <Spoiler key={index} content={part.slice(2, -2)} />;
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('~~') && part.endsWith('~~')) {
        return <span key={index} className="line-through">{part.slice(2, -2)}</span>;
    }
    return part;
  });
};
