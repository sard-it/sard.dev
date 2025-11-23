import { motion } from 'framer-motion';
import  SplitText   from './SplitText';
import { Rocket, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CTASection = () => {
  const { t , i18n } = useTranslation();
  return (
    <section className="py-32 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="inline-block mb-6 sm:mb-8"
          >
            <Rocket className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white" />
          </motion.div>
          <SplitText
            text={t('cta.title')}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl py-2 font-bold text-white mb-6 sm:mb-8"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            direction={i18n.language === "ar" ? "rtl" : "ltr"}
          />

          <SplitText
            text={t('cta.description')}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 leading-relaxed"
            stagger={0.005}
            delay={0} 
            direction={i18n.language === "ar" ? "rtl" : "ltr"}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0, duration: 0.5 }} 
            className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 sm:px-10 py-4 sm:py-5 bg-brand-orange text-black font-bold text-base sm:text-lg rounded-xl overflow-hidden shadow-lg shadow-brand-orange/50 w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t('cta.getStarted')}
                <Rocket className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-brand-orange-400 to-brand-orange-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-8 sm:px-10 py-4 sm:py-5 border-2 border-brand-orange text-brand-orange font-bold text-base sm:text-lg rounded-xl overflow-hidden group shadow-lg w-full sm:w-auto"
            >
              <span className="relative z-10">{t('cta.learnMore')}</span>
              <motion.div
                className="absolute inset-0 bg-brand-orange"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-black font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {t('cta.learnMore')}
              </span>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0, duration: 0.5 }} 
            className="mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-white/10"
          >
            <motion.p
              className="text-gray-400 text-base sm:text-lg"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            >
              {t('cta.question')}
            </motion.p>
            <motion.p
              className="text-white text-lg sm:text-xl font-semibold mt-2"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            >
              {t('cta.callToAction')}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};