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
  // Sample default booked slots for demonstration
  const today = new Date().toISOString().split('T')[0];
  const defaults = [
    {
      id: 'default-1',
      date: today,
      timeSlot: '10:00 AM',
      name: 'مقتطع للتنسيق الداخلي',
      email: 'reserved@sard.ai',
      service: 'أتمتة الأعمال',
      notes: 'محجوز آلياً'
    },
    {
      id: 'default-2',
      date: today,
      timeSlot: '02:00 PM',
      name: 'استشارة فنية',
      email: 'client@sard.ai',
      service: 'مساعد المهام اليومية',
      notes: 'مواعيد محجوزة'
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

export const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM'
];