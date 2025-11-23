import { motion } from 'framer-motion';
import { AnimatedBlob } from './AnimatedBlob';
import { TypewriterText } from './TypewriterText';
import sardITLogo from '../assets/logo.png';
import SplitText from './SplitText';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";   

export const HeroSection = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <section className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center py-3">

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">

        {/* Logo + Switcher */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-row items-center justify-between gap-4 mb-8"
        >
          <img src={sardITLogo} className="w-16 h-16 object-contain" />
          <LanguageSwitcher />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-6">

            <SplitText
              text={t('hero.title')}
              className="text-4xl md:text-5xl font-bold text-white"
            />

            <p className="text-gray-400 text-lg leading-relaxed">
              {t('hero.description1')}
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              {t('hero.description2')}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">

              {/* Explore Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-8 py-4 bg-[#ef9c00] text-black font-semibold rounded-lg"
              >
                {t('hero.exploreButton')}
              </motion.button>

              {/* Ask AI BUTTON — modified */}
              <Link to={'/ai'}>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-8 py-4 border-2 border-[#ef9c00] text-[#ef9c00] flex items-center gap-2 font-semibold rounded-lg"
              >
                Ask AI
              </motion.button>
              
              </Link>
            </div>

            <TypewriterText
              text={t('hero.tagline')}
              className="text-2xl font-light italic text-white"
            />

          </div>

          {/* Blob Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md">
              <AnimatedBlob width="md:w-full" height="h-[300px] md:h-[500px]"/>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
