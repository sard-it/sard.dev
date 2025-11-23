import { motion } from 'framer-motion';

export const TextPressure = ({ text, className = '' }) => {
  const words = text.split(' ');

  return (
    <div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            type: 'spring',
            stiffness: 200,
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};