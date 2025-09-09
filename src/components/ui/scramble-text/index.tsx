"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

interface ScrambleTextProps {
  text: string;
  className?: string;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = "",
}) => {
  const textRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrambleTextPlugin);

    // Scramble on first render (mount)
    gsap.to(textRef.current, {
      duration: 0.8,
      scrambleText: {
        text: text,
        chars: "upperCase",
        revealDelay: 0.3,
        speed: 0.4,
      },
    });
  }, [text]);

  const handleHover = () => {
    gsap.to(textRef.current, {
      duration: 0.5,
      overwrite: true,
      scrambleText: {
        text: text,
        chars: "upperCase",
        revealDelay: 0.25,
        speed: 0.8,
      },
    });
  };

  return (
    <span ref={textRef} className={className} onMouseEnter={handleHover}>
      {text}
    </span>
  );
};

export default ScrambleText;
