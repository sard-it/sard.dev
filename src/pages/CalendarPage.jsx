import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBookedAppointments, saveAppointment, TIME_SLOTS } from '../utils/calendarStorage';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Clock, Lock, CheckCircle2, ArrowRight, ArrowLeft, Bot, PlusCircle } from 'lucide-react';
import sardLogo from '../assets/logo.png';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export default function CalendarPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('أتمتة العمليات وتقليل التكاليف');
  const [notes, setNotes] = useState('');
  const [bookings, setBookings] = useState([]);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    setBookings(getBookedAppointments());
  }, []);

  const bookedSlotsForDate = bookings
    .filter(b => b.date === selectedDate)
    .map(b => b.timeSlot);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedSlot || !name) return;

    saveAppointment({
      date: selectedDate,
      timeSlot: selectedSlot,
      name,
      email,
      service,
      notes
    });

    setBookings(getBookedAppointments());
    setSuccessMsg(true);
    setSelectedSlot('');
    setName('');
    setEmail('');
    setNotes('');

    setTimeout(() => setSuccessMsg(false), 5000);
  };

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2 text-sm font-medium"
            >
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {isRTL ? "الرئيسية" : "Home"}
            </button>

            <img src={sardLogo} alt="Sard AI" className="w-10 h-10 object-contain ml-2" />
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/ai"
              className="flex items-center gap-2 px-3 py-2 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange rounded-lg text-xs sm:text-sm font-semibold hover:bg-brand-orange/20"
            >
              <Bot className="w-4 h-4" />
              <span>{isRTL ? "الحجز بواسطة AI" : "Book via AI"}</span>
            </Link>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange text-xs sm:text-sm font-bold">
            <CalendarIcon className="w-4 h-4" />
            <span>{t('calendar.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {t('calendar.title')}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            {t('calendar.subtitle')}
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6 shrink-0 text-green-400" />
            <div>
              <p className="font-bold text-sm sm:text-base">{t('calendar.successTitle')}</p>
              <p className="text-xs">{t('calendar.successDesc')}</p>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Date and Slots Picker */}
          <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-brand-orange" />
                <span>{t('calendar.selectDate')}</span>
              </label>
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot('');
                }}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-brand-orange outline-none"
              />
            </div>

            <div className="text-xs text-gray-400 bg-white/5 p-3 rounded-lg border border-white/10 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-orange shrink-0" />
              <span>{t('calendar.workingHours')}</span>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-300">
                {t('calendar.slotsLabel')}
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const isBooked = bookedSlotsForDate.includes(slot);
                  const isSelected = selectedSlot === slot;

                  if (isBooked) {
                    return (
                      <div
                        key={slot}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed flex items-center justify-between opacity-50 select-none"
                      >
                        <span className="text-xs font-semibold">{slot}</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Lock className="w-3 h-3" />
                          <span>{t('calendar.booked')}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs sm:text-sm font-bold ${
                        isSelected
                          ? "bg-brand-orange text-black border-brand-orange shadow-lg shadow-brand-orange/30 scale-105"
                          : "bg-black/60 border-white/20 text-white hover:border-brand-orange/60"
                      }`}
                    >
                      <span>{slot}</span>
                      {isSelected ? <CheckCircle2 className="w-4 h-4 text-black" /> : <PlusCircle className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-white border-b border-white/10 pb-3">
              {t('calendar.confirmTitle')}
            </h3>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-gray-300 text-xs font-semibold">{t('calendar.fullName')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:border-brand-orange outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 text-xs font-semibold">{t('calendar.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:border-brand-orange outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 text-xs font-semibold">{t('calendar.service')}</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:border-brand-orange outline-none"
                >
                  <option value="أتمتة العمليات وتقليل التكاليف">أتمتة العمليات وتقليل التكاليف (B2B)</option>
                  <option value="مساعد المهام اليومية وتسهيل الحياة">مساعد المهام اليومية (B2C)</option>
                  <option value="تحليل البيانات وزيادة الإنتاجية">تحليل البيانات وزيادة الإنتاجية</option>
                  <option value="استشارة ذكاء اصطناعي عامة">استشارة ذكاء اصطناعي عامة</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 text-xs font-semibold">{t('calendar.notes')}</label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="..."
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:border-brand-orange outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!selectedSlot || !name}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all text-black ${
                    selectedSlot && name
                      ? "bg-brand-orange hover:bg-brand-orange-400 shadow-lg shadow-brand-orange/30 cursor-pointer"
                      : "bg-gray-600 cursor-not-allowed opacity-50"
                  }`}
                >
                  {selectedSlot
                    ? `${t('calendar.confirmButton')} (${selectedSlot})`
                    : t('calendar.selectSlotFirst')}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}