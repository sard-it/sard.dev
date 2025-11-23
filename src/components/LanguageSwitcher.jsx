import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  const currentLanguage = languages.find(
    (lang) => lang.code === i18n.language
  ) || languages[0];

  // Set HTML dir and lang dynamically
  useEffect(() => {
    const langCode = i18n.language || "en";
    const dir = langCode === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = langCode;
  }, [i18n.language]);

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode); // change language
    setIsOpen(false);              // close dropdown
    window.location.reload();       // reload page to apply new language & RTL/LTR
  };
  

  const isRTL = i18n.language === "ar";

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors backdrop-blur-sm"
      >
        <Languages className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguage.flag} {currentLanguage.name}
        </span>
        <span className="text-sm font-medium sm:hidden">{currentLanguage.flag}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-full ${
                isRTL ? "left-0" : "right-0"
              } mt-2 z-50 min-w-[150px] bg-black/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl overflow-hidden`}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full px-4 py-3 ${
                    isRTL ? "text-right" : "text-left"
                  } hover:bg-white/10 transition-colors flex items-center gap-3 ${
                    i18n.language === lang.code
                      ? "bg-brand-orange/20 text-brand-orange"
                      : "text-white"
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-sm font-medium flex-1">{lang.name}</span>
                  {i18n.language === lang.code && (
                    <span
                      className={`${
                        isRTL ? "mr-auto" : "ml-auto"
                      } text-brand-orange`}
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
