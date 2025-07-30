import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (date: Date): string => {
  return format(date, 'dd/MM/yyyy');
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'dd/MM/yyyy HH:mm');
};

export const getDateRangeFilter = (period: 'day' | 'week' | 'month', date: Date = new Date()) => {
  switch (period) {
    case 'day':
      return {
        start: startOfDay(date),
        end: endOfDay(date),
      };
    case 'week':
      return {
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
      };
    case 'month':
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
    default:
      return {
        start: startOfDay(date),
        end: endOfDay(date),
      };
  }
};

export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  return isWithinInterval(date, { start, end });
};