const STORAGE_KEY = 'sard_ai_calendar_bookings';

export function getBookedAppointments() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getInitialDefaultBookings();
  } catch (err) {
    console.error('Failed to read bookings from localStorage', err);
    return getInitialDefaultBookings();
  }
}

function getInitialDefaultBookings() {
  const today = new Date().toISOString().split('T')[0];
  const defaults = [
    {
      id: 'default-1',
      date: today,
      timeSlot: '02:00 PM',
      name: 'استشارة أتمتة الشركات',
      email: 'reserved@sard.ai',
      service: 'أتمتة العمليات وتقليل التكاليف',
      notes: 'حجز افتراضي للتنسيق'
    },
    {
      id: 'default-2',
      date: today,
      timeSlot: '06:00 PM',
      name: 'جلسة دعم الأفراد',
      email: 'client@sard.ai',
      service: 'مساعد المهام اليومية وتسهيل الحياة',
      notes: 'موعد مؤكد'
    }
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
}

export function saveAppointment(booking) {
  const current = getBookedAppointments();
  const newBooking = {
    id: 'booking-' + Date.now(),
    createdAt: new Date().toISOString(),
    ...booking
  };
  const updated = [...current, newBooking];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newBooking;
}

export function deleteAppointment(id) {
  const current = getBookedAppointments();
  const updated = current.filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// 12:00 PM to 12:00 AM Meeting Slots
export const TIME_SLOTS = [
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
  '09:00 PM',
  '10:00 PM',
  '11:00 PM',
  '12:00 AM'
];