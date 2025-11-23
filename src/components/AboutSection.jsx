import { motion } from 'framer-motion';
import { TextPressure } from './TextPressure';
import SplitText from './SplitText';
import { Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AboutSection = () => {
  const { t } = useTranslation();
  const paragraphs = [
    t('about.paragraph1'),
    t('about.paragraph2'),
    t('about.paragraph3'),
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16"
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, repeatType: 'reverse' },
            }}
          >
            <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-brand-orange" />
          </motion.div>
          <TextPressure
            text={t('about.title')}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center"
          />
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {paragraphs.map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              <p className="text-2xl font-semibold text-center text-white">
                {text}
              </p>
            </motion.div>
          ))}
        </div>


        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0 }}
          className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        >
          {[
            { number: '100+', label: t('about.stats.solutions') },
            { number: '50+', label: t('about.stats.clients') },
            { number: '24/7', label: t('about.stats.mindset') },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              whileHover={{
                scale: 1.05,
                y: -10,
                boxShadow: '0 20px 40px rgba(255, 255, 255, 0.1)',
              }}
              transition={{ delay: 0 }}
              className="text-center p-6 sm:p-8 rounded-xl bg-brand-orange/5 backdrop-blur-sm border border-brand-orange/20 hover:border-brand-orange/50"
            >
              <motion.div
                className="text-4xl sm:text-5xl font-bold text-brand-orange mb-2"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: index * 0.2,
                }}
              >
                {stat.number}
              </motion.div>
              <div className="text-sm sm:text-base text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};