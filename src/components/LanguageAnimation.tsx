/*
* File: LanguageAnimation.tsx
* Description: Animated language showcase component
* Details: Displays languages in their native script with smooth transitions
* - Features elegant fade animations
* - Shows language names in native script
* - Uses Framer Motion for smooth transitions
* - Respects current language selection
* Date: 2024-03-20
*/

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Language } from '../i18n';

interface LanguageAnimationProps {
  lang: Language;
}

// Language data with native names and their corresponding language codes
const LANGUAGES = [
  { native: "English", code: "english" },
  { native: "Español", code: "spanish" },
  { native: "中文", code: "chinese" },
  { native: "日本語", code: "japanese" },
  { native: "한국어", code: "korean" },
  { native: "العربية", code: "arabic" },
  { native: "हिन्दी", code: "hindi" },
  { native: "Português", code: "portuguese" },
  { native: "Deutsch", code: "german" },
  { native: "Français", code: "french" },
  { native: "Italiano", code: "italian" },
  { native: "Русский", code: "russian" },
  { native: "Polski", code: "polish" },
  { native: "Nederlands", code: "dutch" },
  { native: "தமிழ்", code: "tamil" }
];

export const LanguageAnimation: React.FC<LanguageAnimationProps> = ({ lang }) => {
  // Start with the current language
  const [currentIndex, setCurrentIndex] = useState(() => {
    const index = LANGUAGES.findIndex(l => l.code === lang);
    return index >= 0 ? index : 0;
  });

  useEffect(() => {
    // Update when language changes
    const index = LANGUAGES.findIndex(l => l.code === lang);
    if (index >= 0) {
      setCurrentIndex(index);
    }

    // Start cycling through languages after a delay
    const startDelay = setTimeout(() => {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % LANGUAGES.length);
      }, 2000);

      return () => clearInterval(timer);
    }, 3000); // Wait 3 seconds before starting to cycle

    return () => clearTimeout(startDelay);
  }, [lang]);

  return (
    <div className="h-20 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.5,
            ease: [0.32, 0.72, 0, 1] // Custom easing for more natural motion
          }}
          className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-bold",
            "bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400",
            "dark:from-purple-300 dark:via-pink-300 dark:to-purple-300",
            "bg-clip-text text-transparent",
            "py-2" // Added vertical padding
          )}
        >
          {LANGUAGES[currentIndex].native}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 