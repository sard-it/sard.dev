import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const TypewriterText = ({
  text,
  className = '',
  speed = 0.05,
  delay = 0
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('typewriter-target');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let index = 0;
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, speed * 1000);
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(startDelay);
  }, [isVisible, text, speed, delay]);

  return (
    <div id="typewriter-target" className="relative">
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {displayedText}
        {displayedText.length < text.length && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: 'loop'
            }}
            className="ml-1 inline-block"
          >
            |
          </motion.span>
        )}
        {displayedText.length === text.length && (
          <motion.span
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.95, 1, 0.95],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'loop'
            }}
            className="inline-block"
          >
            ✨
          </motion.span>
        )}
      </motion.div>
    </div>
  );
};