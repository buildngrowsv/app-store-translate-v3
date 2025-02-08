/*
* File: AuroraBackground.tsx
* Description: Aurora gradient background component
* Details: Creates a smooth, animated gradient background using Framer Motion
* - Uses hardware-accelerated animations
* - Provides smooth color transitions
* - Eliminates color banding
* Date: 2024-03-20
*/

import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import React, { useEffect } from "react";

// Array of colors to animate through
const COLORS = [
  "rgb(76, 29, 149)", // purple-900
  "rgb(67, 56, 202)", // indigo-700
  "rgb(79, 70, 229)", // indigo-600
  "rgb(124, 58, 237)", // purple-600
  "rgb(139, 92, 246)", // purple-500
];

interface AuroraBackgroundProps {
  children?: React.ReactNode;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = () => {
  // Initialize motion values for multiple color points
  const color1 = useMotionValue(COLORS[0]);
  const color2 = useMotionValue(COLORS[1]);
  const color3 = useMotionValue(COLORS[2]);

  useEffect(() => {
    // Animate each color point with different timings
    animate(color1, [...COLORS, COLORS[0]], {
      ease: "easeInOut",
      duration: 20,
      repeat: Infinity,
      repeatType: "reverse",
    });

    animate(color2, [...COLORS.slice(1), ...COLORS.slice(0, 1)], {
      ease: "easeInOut",
      duration: 25,
      repeat: Infinity,
      repeatType: "reverse",
    });

    animate(color3, [...COLORS.slice(2), ...COLORS.slice(0, 2)], {
      ease: "easeInOut",
      duration: 30,
      repeat: Infinity,
      repeatType: "reverse",
    });
  }, []);

  // Create dynamic gradients using motion templates
  const backgroundImage = useMotionTemplate`
    radial-gradient(circle at 50% -100%, ${color1}, transparent 50%),
    radial-gradient(circle at 0% 0%, ${color2}, transparent 50%),
    radial-gradient(circle at 100% 0%, ${color3}, transparent 50%)
  `;

  return (
    <motion.div
      className="absolute inset-0 opacity-50 dark:opacity-30 mix-blend-soft-light"
      style={{ backgroundImage }}
    />
  );
}; 