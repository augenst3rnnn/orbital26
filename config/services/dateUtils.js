export const getDayName = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(date).getDay()];
};

export const getDayNumber = (date) => {
  return new Date(date).getDate();
};

export const isToday = (date) => {
  const today = new Date().toISOString().split('T')[0];
  return date === today;
};

export const isPastDate = (date) => {
  const today = new Date().toISOString().split('T')[0];
  return date < today;
};

export const formatDateDisplay = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
};

export const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
};

export const getWeekDates = (weekStart) => {
  const dates = [];
  const start = new Date(weekStart);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};