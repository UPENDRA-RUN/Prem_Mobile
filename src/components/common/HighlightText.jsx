import React from 'react';

/**
 * HighlightText component splits input text by matching search query terms
 * and wraps matches inside styled mark tags.
 * 
 * @param {string} text - Text content to be rendered
 * @param {string} query - Active search query string
 */
export default function HighlightText({ text, query, className = '' }) {
  if (!text) return null;
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  // Escape special regex characters in query
  const cleanQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${cleanQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, idx) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <mark
            key={idx}
            className="bg-[#FFD400]/50 text-[#050505] font-extrabold px-0.5 rounded shadow-2xs"
          >
            {part}
          </mark>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </span>
  );
}
