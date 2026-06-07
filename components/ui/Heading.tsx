import React from "react";
// Assuming LettersPullUp is imported from your components directory
import { LettersPullUp } from "./LettersPullUp";

interface AnimatedHeadingProps {
  textBefore: string;
  highlightedText?: string;
  textAfter?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  highlightColor?: string;
  initialDelay?: number;
  charDelay?: number;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  textBefore,
  highlightedText,
  textAfter,
  as: Component = "h2",
  className = "",
  highlightColor = "#9d4519",
  initialDelay = 0.1,
  charDelay = 0.04,
}) => {
  // Dynamically calculate delays based on string lengths to keep animations sequential
  const textBeforeLength = textBefore.length;
  const highlightDelay = initialDelay + textBeforeLength * charDelay;

  const highlightedLength = highlightedText ? highlightedText.length : 0;
  const textAfterDelay = highlightDelay + highlightedLength * charDelay;

  return (
    <Component
      className={`font-serif font-normal leading-[1.02] tracking-[-0.02em] text-bone-ink ${className}`}
    >
      <span className="flex flex-wrap items-baseline">
        <LettersPullUp
          text={textBefore}
          initialDelay={initialDelay}
          charDelay={charDelay}
        />

        {highlightedText && (
          <LettersPullUp
            text={highlightedText}
            initialDelay={highlightDelay}
            charDelay={charDelay}
            charStyle={{ fontStyle: "italic", color: highlightColor }}
          />
        )}
      </span>

      {textAfter && (
        <LettersPullUp
          text={textAfter}
          initialDelay={textAfterDelay}
          charDelay={charDelay}
        />
      )}
    </Component>
  );
};
