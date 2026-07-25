import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../integrations/supabase/client';
import { TextPressure } from './TextPressure';
import { useTranslation } from 'react-i18next';
import { Handshake } from 'lucide-react';

export const PartnersSection = () => {
  const { t, i18n } = useTranslation();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      const { data, error } = await supabase
        .from('partnerships')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data) {
        setPartners(data);
      }
      setLoading(false);
    }

    fetchPartners();
  }, []);

  const isRTL = i18n.language === 'ar';

  return (
    <section className="py-20 bg-black border-t border-b border-white/10 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Handshake className="w-8 h-8 text-brand-orange" />
            <TextPressure
              text={t('partners.title')}
              className="text-3xl sm:text-4xl font-bold text-white"
            />
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            {t('partners.subtitle')}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : partners.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
            {partners.map((partner, index) => {
              const name = isRTL ? partner.partner_name_ar : partner.partner_name_en;
              const description = isRTL ? partner.description_ar : partner.description_en;

              return (
                <motion.div
                  key={partner.id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 hover:border-brand-orange/50 rounded-xl backdrop-blur-sm transition-all"
                >
                  {partner.partner_logo_url ? (
                    <img
                      src={partner.partner_logo_url}
                      alt={name}
                      className="max-h-16 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="text-brand-orange font-semibold text-center text-sm sm:text-base">
                      {name}
                    </div>
                  )}

                  {partner.partner_logo_url && (
                    <span className="mt-3 text-xs text-gray-400 font-medium text-center line-clamp-1">
                      {name}
                    </span>
                  )}
                  {description && (
                    <span className="mt-1 text-[11px] text-gray-500 text-center line-clamp-2">
                      {description}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">
            {isRTL ? "جاري تعيين الشركاء في النظام" : "Partners dynamically syncing from Supabase"}
          </div>
        )}
      </div>
    </section>
  );
};