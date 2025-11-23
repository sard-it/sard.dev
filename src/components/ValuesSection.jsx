import { motion } from 'framer-motion';
import { TextPressure } from './TextPressure';
import { Heart, Users, Target, Sparkles, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ValuesSection = () => {
  const { t } = useTranslation();
  
  const values = [
    {
      icon: Heart,
      title: t('values.humanCentered.title'),
      description: t('values.humanCentered.description'),
      color: 'from-brand-orange/20 to-brand-orange-400/20',
    },
    {
      icon: Users,
      title: t('values.collaborative.title'),
      description: t('values.collaborative.description'),
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: Target,
      title: t('values.purposeDriven.title'),
      description: t('values.purposeDriven.description'),
      color: 'from-brand-orange-500/20 to-brand-orange-600/20',
    },
    {
      icon: Sparkles,
      title: t('values.innovation.title'),
      description: t('values.innovation.description'),
      color: 'from-brand-orange-400/20 to-brand-orange-500/20',
    },
    {
      icon: Shield,
      title: t('values.ethical.title'),
      description: t('values.ethical.description'),
      color: 'from-brand-orange-600/20 to-brand-orange-700/20',
    },
  ];
  return (
    <section className="py-32 bg-black relative overflow-hidden">
      {/* <div className="absolute inset-0">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div> */}

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12 sm:mb-20 text-center"
        >
          <TextPressure
            text={t('values.title')}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0, duration: 0.4 }}
            className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-400"
          >
            {t('values.subtitle')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.4, delay: 0, type: 'spring', stiffness: 100 }}
              whileHover={{
                scale: 1.05,
                rotateZ: 2,
                y: -5,
              }}
              className="group relative p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative z-10">
                <motion.div
                  whileHover={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.2,
                  }}
                  whileInView={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    hover: { duration: 0.5 },
                    whileInView: { duration: 3, repeat: Infinity, repeatType: 'loop', delay: index * 0.1 },
                  }}
                  className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-4 sm:mb-6 rounded-xl bg-white/10 group-hover:bg-white/20"
                >
                  <value.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </motion.div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{value.title}</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{value.description}</p>
              </div>

              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};