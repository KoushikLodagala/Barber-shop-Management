import { Service, Barber, Transaction, Customer } from '../types';

export const services: Service[] = [
  { id: '1', name: 'Hair Cut', price: 150, category: 'Hair' },
  { id: '2', name: 'Beard Trim', price: 80, category: 'Beard' },
  { id: '3', name: 'Clean Shave', price: 100, category: 'Beard' },
  { id: '4', name: 'Facial (Basic)', price: 200, category: 'Facial' },
  { id: '5', name: 'Facial (Premium)', price: 350, category: 'Facial' },
  { id: '6', name: 'Hair Wash', price: 50, category: 'Hair' },
  { id: '7', name: 'Nail Cutting', price: 30, category: 'Nails' },
  { id: '8', name: 'Eyebrow Trimming', price: 40, category: 'Grooming' },
  { id: '9', name: 'Head Massage', price: 120, category: 'Massage' },
  { id: '10', name: 'Mustache Styling', price: 60, category: 'Beard' },
];

export const barbers: Barber[] = [
  { id: '1', name: 'Rajesh Kumar', experience: 8, specialties: ['Hair Cut', 'Beard Trim'] },
  { id: '2', name: 'Amit Singh', experience: 5, specialties: ['Facial', 'Clean Shave'] },
  { id: '3', name: 'Suresh Patel', experience: 12, specialties: ['Hair Cut', 'Mustache Styling'] },
  { id: '4', name: 'Deepak Sharma', experience: 6, specialties: ['Beard Trim', 'Head Massage'] },
  { id: '5', name: 'Vikram Gupta', experience: 4, specialties: ['Facial', 'Eyebrow Trimming'] },
];

export const customers: Customer[] = [
  { 
    id: '1', 
    name: 'Arjun Mehta', 
    phone: '9876543210', 
    hasMembership: true,
    membershipStartDate: new Date('2024-01-15'),
    membershipExpiryDate: new Date('2025-01-15')
  },
  { 
    id: '2', 
    name: 'Rohit Sharma', 
    phone: '9123456789', 
    hasMembership: false
  },
  { 
    id: '3', 
    name: 'Kiran Desai', 
    phone: '9988776655', 
    hasMembership: true,
    membershipStartDate: new Date('2024-03-10'),
    membershipExpiryDate: new Date('2025-03-10')
  },
];

// Generate mock transactions for the last 30 days
export const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();
  
  for (let i = 0; i < 50; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const transactionDate = new Date(today);
    transactionDate.setDate(today.getDate() - randomDaysAgo);
    
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const barber = barbers[Math.floor(Math.random() * barbers.length)];
    
    // Select 1-4 random services
    const numServices = Math.floor(Math.random() * 4) + 1;
    const selectedServices = [];
    const selectedServiceNames = [];
    let subtotal = 0;
    
    for (let j = 0; j < numServices; j++) {
      const service = services[Math.floor(Math.random() * services.length)];
      if (!selectedServices.includes(service.id)) {
        selectedServices.push(service.id);
        selectedServiceNames.push(service.name);
        subtotal += service.price;
      }
    }
    
    const membershipDiscount = customer.hasMembership ? subtotal * 0.1 : 0;
    const finalAmount = subtotal - membershipDiscount;
    
    transactions.push({
      id: `txn_${i + 1}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      barberId: barber.id,
      barberName: barber.name,
      services: selectedServices,
      serviceNames: selectedServiceNames,
      subtotal,
      finalAmount,
      paymentMode: Math.random() > 0.6 ? 'Paytm' : 'Cash',
      hasMembership: customer.hasMembership,
      membershipDiscount,
      date: transactionDate,
      timestamp: transactionDate.getTime(),
    });
  }
  
  return transactions.sort((a, b) => b.timestamp - a.timestamp);
};

export const mockTransactions = generateMockTransactions();