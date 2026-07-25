import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Calendar, FileText, Building2, CheckCircle, Handshake } from 'lucide-react';
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
        
        {/* Header Navigation Bar */}
        <div className="flex justify-between items-center pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2 text-sm"
            >
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{isRTL ? "الرئيسية" : "Home"}</span>
            </button>
            <div className="flex items-center gap-2 border-r pr-3 border-white/20">
              <img src={sardITLogo} alt="Sard AI" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg text-white">Sard AI</span>
            </div>
          </div>

          <LanguageSwitcher />
        </div>

        {/* Strategic Partnership Header (Fixed Sard AI Logo | Partner Logo) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-md text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-semibold rounded-full">
            <Handshake className="w-4 h-4" />
            <span>{isRTL ? "اتفاقية شراكة استراتيجية" : "Strategic Partnership Agreement"}</span>
          </div>

          {/* Fixed Logos Duo: Sard AI | Partner */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 py-4">
            
            {/* Fixed Sard AI Logo */}
            <div className="flex flex-col items-center gap-2">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20 shadow-lg w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                <img src={sardITLogo} alt="Sard AI" className="max-h-20 max-w-20 object-contain" />
              </div>
              <span className="text-sm font-bold text-brand-orange">Sard AI</span>
            </div>

            {/* Pipeline Separator | */}
            <div className="text-4xl sm:text-6xl font-light text-brand-orange/60 select-none">
              |
            </div>

            {/* Partner Logo */}
            <div className="flex flex-col items-center gap-2">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20 shadow-lg w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
                {partner.partner_logo_url ? (
                  <img
                    src={partner.partner_logo_url}
                    alt={partnerName}
                    className="max-h-20 max-w-20 object-contain"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-brand-orange" />
                )}
              </div>
              <span className="text-sm font-bold text-white">{partnerName}</span>
            </div>

          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{partnerName}</h1>
          
          {description && (
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}

          {partner.contract_date && (
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm pt-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <Calendar className="w-4 h-4 text-brand-orange" />
              <span>{isRTL ? "تاريخ بدء التعاقد:" : "Contract Date:"} {partner.contract_date}</span>
            </div>
          )}
        </motion.div>

        {/* Detailed Contract Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-6"
        >
          <div className="flex items-center gap-3 text-brand-orange border-b border-white/10 pb-4">
            <FileText className="w-6 h-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {isRTL ? "تفاصيل بنود الشراكة والتعاقد" : "Partnership & Contract Terms"}
            </h2>
          </div>

          {contractDetails ? (
            <div className="text-gray-300 leading-relaxed whitespace-pre-line text-base sm:text-lg bg-black/40 p-6 rounded-xl border border-white/5">
              {contractDetails}
            </div>
          ) : (
            <div className="flex items-center gap-3 text-gray-300 bg-black/40 p-6 rounded-xl border border-white/5">
              <CheckCircle className="w-6 h-6 text-brand-orange shrink-0" />
              <span>
                {isRTL
                  ? "تم اعتماد واتفاق عقد الشراكة بين شركة Sard AI وهذا الشريك لتأمين حلول وأتمتة العمليات بشكل متكامل."
                  : "The partnership agreement between Sard AI and this partner has been officially activated to deliver end-to-end automated solutions."}
              </span>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}