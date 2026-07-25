import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const PartnersSection = () => {
  const { t, i18n } = useTranslation();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading || partners.length === 0) {
    return null;
  }

  // Multiply items for smooth infinite loop ribbon
  const marqueeItems = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="py-12 bg-black border-y border-white/10 overflow-hidden relative">
      <div className="container mx-auto px-4 mb-6 text-center">
        <p className="text-xs uppercase tracking-widest text-brand-orange font-semibold">
          {t('partners.title')}
        </p>
      </div>

      <div className="flex w-full overflow-hidden select-none mask-gradient">
        <motion.div
          className="flex items-center gap-12 sm:gap-16 whitespace-nowrap min-w-full"
          animate={{ x: isRTL ? ['0%', '50%'] : ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: Math.max(15, partners.length * 4),
          }}
        >
          {marqueeItems.map((partner, index) => {
            const name = isRTL ? partner.partner_name_ar : partner.partner_name_en;

            return (
              <div
                key={`${partner.id}-${index}`}
                onClick={() => navigate(`/partners/${partner.id}`)}
                className="cursor-pointer group flex items-center justify-center shrink-0 px-2 transition-transform hover:scale-110 duration-300"
              >
                {partner.partner_logo_url ? (
                  <img
                    src={partner.partner_logo_url}
                    alt={name}
                    className="h-10 sm:h-12 md:h-14 w-auto object-contain filter grayscale contrast-200 opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:contrast-100 transition-all duration-300"
                  />
                ) : (
                  <span className="text-lg font-bold text-gray-500 group-hover:text-brand-orange filter grayscale group-hover:grayscale-0 transition-all duration-300">
                    {name}
                  </span>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};