import { motion } from 'framer-motion';
import sardITLogo from '../assets/logo.png';
import aiLogo from '../assets/ai-logo.png';
import SplitText from './SplitText';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";   
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

export const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
    <section className="min-h-[85vh] relative overflow-hidden bg-black flex items-center justify-center py-8">

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">

        {/* Logo + Switcher + Admin/Calendar quick links */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-row items-center justify-between gap-4 mb-12 border-b border-white/10 pb-4"
        >
          <Link to="/" className="flex items-center gap-3">
            <img src={sardITLogo} alt="Sard AI" className="w-12 h-12 object-contain" />
            <span className="text-xl font-bold text-white tracking-wide">Sard AI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/calendar"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition-colors"
            >
              <Calendar className="w-4 h-4 text-brand-orange" />
              <span>{isRTL ? "جدول المواعيد" : "Calendar"}</span>
            </Link>
            <LanguageSwitcher />
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <SplitText
            text={t('hero.title')}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight"
          />

          <div className="space-y-4 max-w-3xl mx-auto">
            <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed">
              {t('hero.description1')}
            </p>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
              {t('hero.description2')}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-4">

            {/* Book Meeting Button */}
            <Link to="/calendar">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-[#ef9c00] text-black font-bold rounded-xl shadow-lg shadow-brand-orange/30 flex items-center gap-3 text-base h-full"
              >
                <Calendar className="w-5 h-5" />
                <span>{t('hero.bookMeeting')}</span>
              </motion.button>
            </Link>

            {/* Ask AI Button with Prominent Static AI Model Logo */}
            <Link to="/ai">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 border-2 border-[#ef9c00] text-[#ef9c00] bg-brand-orange/10 flex items-center gap-3.5 font-bold rounded-xl hover:bg-brand-orange/20 transition-all text-base sm:text-lg"
              >
                <img src={aiLogo} alt="Sard AI Model Logo" className="w-10 h-10 sm:w-11 sm:h-11 object-contain mix-blend-screen shrink-0" />
                <span>{isRTL ? "مساعد الذكاء الاصطناعي" : "Ask Sard AI"}</span>
                {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </motion.button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};