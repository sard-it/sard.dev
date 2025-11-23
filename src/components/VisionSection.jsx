import { motion } from 'framer-motion';
import { TextPressure } from './TextPressure';
import  SplitText   from './SplitText';
import { Telescope } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const VisionSection = () => {
  const { t , i18n } = useTranslation();
  const paragraphs = [
    t('vision.paragraph1'),
    t('vision.paragraph2'),
    t('vision.paragraph3'),
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }} 
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Telescope className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-brand-orange" />
          </motion.div>
          <TextPressure
            text={t('vision.title')}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center"
          />
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }} 
            transition={{ duration: 0.3 }} 
            className="text-center"
          >
            
            <SplitText
              text={t('vision.subtitle')}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
              delay={100}
              duration={0.2}
              ease="power3.out"
              splitType="chars"
              direction={i18n.language === "ar" ? "rtl" : "ltr"}
            />
          </motion.div>

          {paragraphs.map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }} 
              transition={{ duration: 0.3, delay: 0 }}
            >
              <SplitText
                text={text}
                className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed"
                stagger={0.005} 
                delay={0} 
                direction={i18n.language === "ar" ? "rtl" : "ltr"}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }} 
            transition={{ duration: 0.3, delay: 0, type: 'spring' }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 30px 60px rgba(255, 255, 255, 0.1)',
            }}
            className="mt-12 sm:mt-16 p-8 sm:p-12 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:border-white/30 transition-all"
          >
            <motion.div
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white italic"
              animate={{
                textShadow: [
                  '0 0 0px rgba(255,255,255,0)',
                  '0 0 20px rgba(255,255,255,0.3)',
                  '0 0 0px rgba(255,255,255,0)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            >
              "{t('vision.quote')}"
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};