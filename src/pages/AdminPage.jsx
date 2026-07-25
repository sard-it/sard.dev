import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBookedAppointments, saveAppointment, deleteAppointment, TIME_SLOTS } from '../utils/calendarStorage';
import { Lock, Calendar, Trash2, PlusCircle, Bot, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import sardLogo from '../assets/logo.png';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookings, setBookings] = useState([]);

  // AI Agent inside Admin
  const [agentPrompt, setAgentPrompt] = useState('');
  const [agentLog, setAgentLog] = useState('');
  const [agentLoading, setAgentLoading] = useState(false);

  // Manual creation form
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSlot, setNewSlot] = useState(TIME_SLOTS[0]);
  const [newName, setNewName] = useState('');
  const [newService, setNewService] = useState('أتمتة الأعمال وتوفير التكاليف');

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '246800') {
      setIsAuthenticated(true);
      setErrorMsg('');
      setBookings(getBookedAppointments());
    } else {
      setErrorMsg('كلمة المرور غير صحيحة');
    }
  };

  const handleDelete = (id) => {
    const updated = deleteAppointment(id);
    setBookings(updated);
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (!newName) return;

    saveAppointment({
      date: newDate,
      timeSlot: newSlot,
      name: newName,
      email: 'admin-created@sard.ai',
      service: newService,
      notes: 'تم إنشاؤه عبر لوحة الأدمن'
    });

    setBookings(getBookedAppointments());
    setNewName('');
  };

  // Admin AI Agent logic to automatically parse instructions and manage calendar
  const handleAgentRun = () => {
    if (!agentPrompt.trim()) return;
    setAgentLoading(true);

    setTimeout(() => {
      // Simulate AI Agent processing instruction
      const today = new Date().toISOString().split('T')[0];
      const created = saveAppointment({
        date: today,
        timeSlot: '03:00 PM',
        name: 'موعد منسق بواسطة AI Agent',
        email: 'agent@sard.ai',
        service: 'أتمتة وحجز آلي للأدمن',
        notes: `طلب المساعد: ${agentPrompt}`
      });

      setBookings(getBookedAppointments());
      setAgentLog(`✅ قام AI Agent بتحليل طلبك: "${agentPrompt}" وتم إضافة الموعد بنجاح في الكالندر.`);
      setAgentPrompt('');
      setAgentLoading(false);
    }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-6 shadow-2xl"
        >
          <img src={sardLogo} alt="Sard AI" className="w-16 h-16 object-contain mx-auto" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">لوحة تحكم الأدمن | Sard AI</h1>
            <p className="text-xs text-gray-400">يرجى إدخال رمز المرور الخاص بالإدارة للدخول</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز الدخول..."
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-center text-white outline-none focus:border-brand-orange text-lg tracking-widest"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-orange text-black font-bold hover:bg-brand-orange-400 transition-all"
            >
              تسجيل الدخول
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={sardLogo} alt="Sard AI" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="font-bold text-lg text-white">لوحة الإدارة والحجوزات (Admin)</h1>
              <p className="text-xs text-brand-orange">Sard AI Admin Dashboard</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs sm:text-sm text-gray-300"
          >
            الخروج إلى الرئيسية
          </button>
        </div>

        {/* AI Agent Helper Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-orange/15 via-black to-black border border-brand-orange/30 space-y-4">
          <div className="flex items-center gap-3 text-brand-orange">
            <Bot className="w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Admin AI Agent - مساعد الأدمن الذكي</h2>
          </div>
          <p className="text-xs text-gray-300">
            يمكنك إدخال أوامر ذكية للمساعد لإنشاء المواعيد أو معالجة الطلبات تلقائياً في الجدول.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={agentPrompt}
              onChange={(e) => setAgentPrompt(e.target.value)}
              placeholder="مثال: قم بجدولة اجتماع مع شركة جديدة اليوم الساعة 3 مساءً..."
              className="flex-1 bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-orange"
            />
            <button
              onClick={handleAgentRun}
              disabled={agentLoading}
              className="px-5 py-2.5 rounded-xl bg-brand-orange text-black font-bold text-sm hover:bg-brand-orange-400 flex items-center gap-2"
            >
              {agentLoading ? <Cpu className="animate-spin w-4 h-4" /> : "تنفيذ بواسطة AI"}
            </button>
          </div>

          {agentLog && (
            <p className="text-xs text-brand-orange bg-black/50 p-3 rounded-lg border border-brand-orange/20">
              {agentLog}
            </p>
          )}
        </div>

        {/* Admin Section Grid */}
        <div className="grid lg:grid-cols-12 gap-8">

          {/* Bookings Table */}
          <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-orange" />
                <span>قائمة المواعيد الحالية ({bookings.length})</span>
              </h3>
            </div>

            {bookings.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">لا توجد مواعيد محجوزة حالياً.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{b.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-brand-orange/20 text-brand-orange font-semibold">
                          {b.timeSlot}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">التاريخ: {b.date} | الخدمة: {b.service}</p>
                      {b.notes && <p className="text-xs text-gray-500 italic">ملاحظات: {b.notes}</p>}
                    </div>

                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="حذف الموعد"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manual Appointment Creator */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-brand-orange" />
              <span>إضافة موعد يدوي</span>
            </h3>

            <form onSubmit={handleManualAdd} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 mb-1 block">اسم العميل / الجهة</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="الاسم الكامل..."
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="text-gray-300 mb-1 block">التاريخ</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-orange"
                />
              </div>

              <div>
                <label className="text-gray-300 mb-1 block">الساعة</label>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-orange"
                >
                  {TIME_SLOTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 mb-1 block">نوع الخدمة</label>
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-orange"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-orange text-black font-bold hover:bg-brand-orange-400 mt-2"
              >
                إضافة للمخطط
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}