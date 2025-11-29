
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

export const renderMarkdown = (text: string, onImageClick?: (url: string) => void) => {
  if (!text) return null;

  // We will split by standard regex patterns and return an array of elements
  // Order matters: Code blocks -> Images -> Inline Code -> Spoilers -> Bold -> Italic -> Strikethrough
  
  // Regex Explanation:
  // (!\[[^\]]*\]\([^)]+\))  -> Images: ![alt](url)
  // (`[^`]+`)               -> Inline Code: `code`
  // (\|\|[^|]+\|\|)         -> Spoilers: ||text||
  // (\*\*[^*]+\*\*)         -> Bold: **text**
  // (\*[^*]+\*)             -> Italic: *text*
  // (~~[^~]+~~)             -> Strikethrough: ~~text~~
  
  // Use a more permissive regex for images to handle complex filenames
  const parts = text.split(/(!\[.*?\]\(.*?\))|(`[^`]+`)|(\|\|[^|]+\|\|)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(~~[^~]+~~)/g).filter(Boolean);

  return parts.map((part, index) => {
    // Images
    if (part.startsWith('![') && part.includes('](') && part.endsWith(')')) {
        // Extract url/alt non-greedily
        const match = part.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
            const alt = match[1];
            const url = match[2];
            return (
                <span 
                    key={index} 
                    className="block mt-2 mb-1 cursor-pointer hover:opacity-90 transition-opacity max-w-full"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onImageClick) onImageClick(url);
                    }}
                >
                    <img 
                        src={url} 
                        alt={alt} 
                        className="rounded-lg max-w-full max-h-[350px] w-auto h-auto object-contain border border-discord-darker bg-discord-darker min-h-[50px] min-w-[50px]" 
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerText = `[Image failed to load: ${alt}]`;
                        }}
                    />
                </span>
            );
        }
    }
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
