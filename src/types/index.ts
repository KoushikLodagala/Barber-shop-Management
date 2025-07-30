export interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface Barber {
  id: string;
  name: string;
  experience: number;
  specialties: string[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  hasMembership: boolean;
  membershipStartDate?: Date;
  membershipExpiryDate?: Date;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  barberId: string;
  barberName: string;
  services: string[];
  serviceNames: string[];
  subtotal: number;
  finalAmount: number;
  paymentMode: 'Cash' | 'Paytm';
  hasMembership: boolean;
  membershipDiscount: number;
  date: Date;
  timestamp: number;
}

export interface PerformanceData {
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  count: number;
  revenue: number;
  date: Date;
}