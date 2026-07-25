import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Calendar, FileText, Building2, CheckCircle } from 'lucide-react';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import sardITLogo from '../assets/logo.png';

export default function PartnerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    async function getPartnerDetails() {
      const { data, error } = await supabase
        .from('partnerships')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setPartner(data);
      }
      setLoading(false);
    }

    if (id) {
      getPartnerDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center gap-4">
        <h2 className="text-2xl font-bold">{isRTL ? "الشريك غير موجود" : "Partner Not Found"}</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-brand-orange text-black font-semibold rounded-lg"
        >
          {isRTL ? "العودة للرئيسية" : "Back to Home"}
        </button>
      </div>
    );
  }

  const partnerName = isRTL ? partner.partner_name_ar : partner.partner_name_en;
  const description = isRTL ? partner.description_ar : partner.description_en;
  const contractDetails = isRTL ? partner.contract_details_ar : partner.contract_details_en;

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2 text-sm"
            >
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {isRTL ? "الرئيسية" : "Home"}
            </button>
            <img src={sardITLogo} alt="Sard AI" className="w-10 h-10 object-contain ml-2" />
          </div>

          <LanguageSwitcher />
        </div>

        {/* Hero Card for Partner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-center md:items-start gap-8"
        >
          {partner.partner_logo_url ? (
            <div className="p-6 bg-white/10 rounded-xl border border-white/10 flex items-center justify-center shrink-0 w-44 h-44">
              <img
                src={partner.partner_logo_url}
                alt={partnerName}
                className="max-h-32 max-w-32 object-contain"
              />
            </div>
          ) : (
            <div className="p-6 bg-brand-orange/20 rounded-xl border border-brand-orange/30 flex items-center justify-center shrink-0 w-44 h-44 text-brand-orange">
              <Building2 className="w-16 h-16" />
            </div>
          )}

          <div className="space-y-4 text-center md:text-start flex-1">
            <span className="px-3 py-1 bg-brand-orange/20 text-brand-orange text-xs font-semibold rounded-full border border-brand-orange/30 inline-block">
              {isRTL ? "شريك استراتيجي" : "Strategic Partner"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{partnerName}</h1>
            {description && (
              <p className="text-gray-300 text-base leading-relaxed">{description}</p>
            )}

            {partner.contract_date && (
              <div className="flex items-center gap-2 text-gray-400 text-sm pt-2">
                <Calendar className="w-4 h-4 text-brand-orange" />
                <span>{isRTL ? "تاريخ التعاقد:" : "Contract Date:"} {partner.contract_date}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Contract Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-6"
        >
          <div className="flex items-center gap-3 text-brand-orange border-b border-white/10 pb-4">
            <FileText className="w-6 h-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {isRTL ? "تفاصيل التعاقد والشراكة" : "Contract & Partnership Details"}
            </h2>
          </div>

          {contractDetails ? (
            <div className="text-gray-300 leading-relaxed whitespace-pre-line text-base sm:text-lg">
              {contractDetails}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400 italic">
              <CheckCircle className="w-5 h-5 text-brand-orange" />
              <span>
                {isRTL
                  ? "تم توقيع اتفاقية الشراكة الاستراتيجية وتفعيلها بنجاح."
                  : "Strategic partnership agreement has been successfully signed and activated."}
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}