import React from "react";

interface HighlightedTextProps {
  text: string;
  query: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, query }) => {
  if (!query) {
    // No query, return the text as is
    return <span>{text}</span>;
  }

  // Use regular expression to find and highlight the matched text
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        part.match(regex) ? (
          <mark key={index} className="highlighted">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default HighlightedText;
