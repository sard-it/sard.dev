import { motion } from 'framer-motion';
import { TextPressure } from './TextPressure';
import { Brain, Cpu, Database, Zap, Globe, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ServicesSection = () => {
  const { t } = useTranslation();
  
  const services = [
    {
      icon: Brain,
      title: t('services.aiPowered.title'),
      description: t('services.aiPowered.description'),
      direction: { x: -100, y: 0 },
    },
    {
      icon: Cpu,
      title: t('services.automation.title'),
      description: t('services.automation.description'),
      direction: { x: 100, y: 0 },
    },
    {
      icon: Database,
      title: t('services.dataIntelligence.title'),
      description: t('services.dataIntelligence.description'),
      direction: { x: -100, y: 0 },
    },
    {
      icon: Zap,
      title: t('services.performance.title'),
      description: t('services.performance.description'),
      direction: { x: 100, y: 0 },
    },
    {
      icon: Globe,
      title: t('services.cloud.title'),
      description: t('services.cloud.description'),
      direction: { x: -100, y: 0 },
    },
    {
      icon: Shield,
      title: t('services.security.title'),
      description: t('services.security.description'),
      direction: { x: 100, y: 0 },
    },
  ];
  return (
    <section className="py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-20" />
        <div className="absolute top-1/4 right-0 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-20" />
        <div className="absolute left-0 top-1/2 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }} 
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-4 mb-12 sm:mb-20"
        >
          <TextPressure
            text={t('services.title')}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center"
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, ...service.direction, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-100px' }} 
              transition={{ duration: 0.5, delay: 0, type: 'spring', stiffness: 100 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                rotateY: 5,
              }}
              className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <motion.div
                whileHover={{
                  rotate: 360,
                  scale: 1.1,
                }}
                whileInView={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  rotate: { duration: 0.6 },
                  scale: { duration: 3, repeat: Infinity, repeatType: 'loop', delay: index * 0.1 },
                }}
                className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-4 sm:mb-6 flex items-center justify-center rounded-xl bg-brand-orange/20 group-hover:bg-brand-orange/30 border border-brand-orange/30"
              >
                <service.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-brand-orange" />
              </motion.div>

              <h3 className="relative z-10 text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{service.title}</h3>
              <p className="relative z-10 text-sm sm:text-base text-gray-400 leading-relaxed">{service.description}</p>

              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                style={{ zIndex: -1 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};