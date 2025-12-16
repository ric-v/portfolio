"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export function TypewriterText({
  text,
  className,
  delay = 0,
  speed = 0.05,
}: TypewriterTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Maintain a global index to calculate delay across all segments
  let globalCharIndex = 0;

  // Split text into words and whitespace segments to preserve wrapping logic
  // " \n" etc. will be captured as segments
  const segments = text.split(/(\s+)/);

  return (
    <span
      ref={ref}
      className={cn("inline-block", className)}
    // Use sr-only for accessibility instead of aria-label on non-interactive element
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {segments.map((segment, segmentIndex) => {
          // If the segment is empty (split edge case), skip
          if (segment === "") return null;

          const isWhitespace = /^\s+$/.test(segment);

          return (
            <span
              key={segmentIndex}
              // If it's a word, prevent wrapping inside it.
              // If it's whitespace, allow default behavior (which might be wrapping).
              // Use inline-block for words to keep them as units? 
              // Actually inline-block puts it on a line. 
              // better to use inline + whitespace-nowrap for words.
              className={isWhitespace ? "whitespace-pre" : "whitespace-nowrap"}
            >
              {segment.split("").map((char, charIndex) => {
                const currentDelay = delay + (globalCharIndex * speed);
                globalCharIndex++;

                return (
                  <motion.span
                    key={charIndex}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.01, delay: currentDelay }}
                    className="inline-block" // Needed for some transforms if we added them, but mainly keeps consistency
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
          );
        })}
      </span>
    </span>
  );
}
