import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-black border-t border-white/10 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange fill-brand-orange" />
            </motion.div>
            <p className="text-xl sm:text-2xl font-light text-white">
              Sard IT
            </p>
          </div>
          <div className="flex flex-col justify-center items-center ">

            <p className="text-sm sm:text-base text-gray-400 mb-2">
              {t('footer.tagline')}
            </p>

            <p className="text-xs sm:text-sm text-gray-500">
              © {new Date().getFullYear()} Sard IT. {t('footer.rights')}
            </p>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500">
            <button className="hover:text-white transition-colors">{t('footer.privacy')}</button>
            <button className="hover:text-white transition-colors">{t('footer.terms')}</button>
            <button className="hover:text-white transition-colors">{t('footer.contact')}</button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};