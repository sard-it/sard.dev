import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Calendar, FileText, Building2, CheckCircle, ShieldCheck } from 'lucide-react';
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
        
        {/* Navigation Bar */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <button
            onClick={() => navigate('/')}
            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2 text-sm font-medium"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {isRTL ? "الرئيسية" : "Home"}
          </button>

          <LanguageSwitcher />
        </div>

        {/* Official Header Section: Sard AI Logo | Partner Logo / Name */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl bg-gradient-to-b from-white/10 via-white/5 to-black border border-white/15 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-center gap-4 sm:gap-8 my-4">
            {/* Sard Logo */}
            <div className="flex flex-col items-center gap-2">
              <img src={sardITLogo} alt="Sard AI" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
              <span className="text-xs sm:text-sm font-bold tracking-widest text-brand-orange">SARD AI</span>
            </div>

            {/* Official Divider Bar */}
            <div className="text-2xl sm:text-4xl text-brand-orange/60 font-light select-none">|</div>

            {/* Partner Logo / Name */}
            <div className="flex flex-col items-center gap-2">
              {partner.partner_logo_url ? (
                <img
                  src={partner.partner_logo_url}
                  alt={partnerName}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-orange/20 rounded-xl border border-brand-orange/30 flex items-center justify-center text-brand-orange">
                  <Building2 className="w-10 h-10" />
                </div>
              )}
              <span className="text-xs sm:text-sm font-bold text-white max-w-[120px] truncate">{partnerName}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/20 text-brand-orange text-xs font-semibold rounded-full border border-brand-orange/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isRTL ? "اتفاقية شراكة استراتيجية موثقة" : "Official Strategic Partnership"}
            </span>
          </div>
        </motion.div>

        {/* Formal Contract Breakdown Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3 text-brand-orange">
              <FileText className="w-6 h-6" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {isRTL ? "بيانات التعاقد والشراكة" : "Contract & Partnership Breakdown"}
              </h2>
            </div>

            {partner.contract_date && (
              <div className="flex items-center gap-2 text-gray-400 text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Calendar className="w-4 h-4 text-brand-orange" />
                <span>{partner.contract_date}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <span className="text-xs text-brand-orange uppercase tracking-wider font-semibold">
                {isRTL ? "نبذة عن الشريك" : "Partner Overview"}
              </span>
              <p className="text-gray-300 text-base leading-relaxed">{description}</p>
            </div>
          )}

          {/* Formal Contract Text */}
          <div className="space-y-3">
            <span className="text-xs text-brand-orange uppercase tracking-wider font-semibold">
              {isRTL ? "بنود وتفاصيل التعاقد الرسمية" : "Contract Details & Clauses"}
            </span>
            {contractDetails ? (
              <div className="p-6 rounded-xl bg-black/60 border border-white/10 text-gray-200 leading-relaxed whitespace-pre-line text-base font-normal">
                {contractDetails}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-black/60 border border-white/10 flex items-center gap-3 text-gray-400 italic">
                <CheckCircle className="w-5 h-5 text-brand-orange shrink-0" />
                <span>
                  {isRTL
                    ? "تم توقيع وتفعيل عقد الشراكة الاستراتيجية المعتمد بنجاح بين سرد AI والشريك."
                    : "Official strategic partnership agreement has been signed and activated."}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}