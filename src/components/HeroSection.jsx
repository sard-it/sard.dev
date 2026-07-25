import { motion } from 'framer-motion';
import sardITLogo from '../assets/logo.png';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { Zap, Bot, ArrowRight, ArrowLeft, ShieldCheck, TrendingUp } from 'lucide-react';

export const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <section className="relative min-h-[90vh] bg-black text-white flex flex-col justify-center py-10 overflow-hidden">
      
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* Top Bar Navigation (Logo & Switcher) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-row items-center justify-between gap-4 mb-12 border-b border-white/10 pb-6"
        >
          <div className="flex items-center gap-3">
            <img src={sardITLogo} alt="Sard AI Logo" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold tracking-tight text-white">
              Sard<span className="text-brand-orange">.AI</span>
            </span>
          </div>

          <LanguageSwitcher />
        </motion.div>

        {/* Main Content Grid */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Business Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs sm:text-sm font-semibold tracking-wide"
          >
            <Zap className="w-4 h-4" />
            <span>{isRTL ? "أنظمة أتمتة المؤسسات والشركات" : "Enterprise Workflow Automation Systems"}</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight sm:leading-tight"
          >
            {t('hero.title')}
          </motion.h1>

          {/* Descriptions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 max-w-3xl mx-auto"
          >
            <p className="text-gray-300 text-base sm:text-xl leading-relaxed">
              {t('hero.description1')}
            </p>
            <p className="text-gray-400 text-sm sm:text-lg leading-relaxed">
              {t('hero.description2')}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {/* Explore Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 bg-brand-orange text-black font-bold text-base sm:text-lg rounded-xl shadow-lg shadow-brand-orange/30 flex items-center justify-center gap-2"
            >
              <span>{t('hero.exploreButton')}</span>
              {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </motion.button>

            {/* Ask AI Button */}
            <Link to="/ai" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 border-2 border-brand-orange/60 hover:border-brand-orange text-white font-bold text-base sm:text-lg rounded-xl flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm"
              >
                <Bot className="w-5 h-5 text-brand-orange" />
                <span>Ask AI (sard-2.1)</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* B2B Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-gray-400"
          >
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-orange" />
              <span>{isRTL ? "توفير التكاليف التشغيلية بنسبة 60%" : "Up to 60% Operational Cost Cut"}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-brand-orange" />
              <span>{isRTL ? "تنفيذ وسرعة استجابة 24/7" : "24/7 Zero Human Error Execution"}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-orange" />
              <span>{isRTL ? "حماية وحوكمة بيانات كاملة" : "Bank-Grade Data Governance"}</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};