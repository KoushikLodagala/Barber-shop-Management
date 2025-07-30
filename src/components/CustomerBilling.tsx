import React, { useState, useEffect } from 'react';
import { User, Phone, Scissors, CreditCard, Gift, Calendar, CheckCircle, Clock } from 'lucide-react';
import { services, barbers, mockTransactions } from '../data/mockData';
import { Transaction } from '../types';
import { formatCurrency, formatDateTime } from '../utils/dateUtils';

interface CustomerBillingProps {
  darkMode: boolean;
}

const CustomerBilling: React.FC<CustomerBillingProps> = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    selectedServices: [] as string[],
    barberId: '',
    hasMembership: false,
    membershipStartDate: '',
    paymentMode: 'Cash' as 'Cash' | 'Paytm',
    manualAdjustment: 0,
  });

  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subtotal, setSubtotal] = useState(0);
  const [membershipDiscount, setMembershipDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    calculateBilling();
  }, [formData.selectedServices, formData.hasMembership, formData.manualAdjustment]);

  const calculateBilling = () => {
    const selectedServiceObjects = services.filter(service => 
      formData.selectedServices.includes(service.id)
    );
    
    const newSubtotal = selectedServiceObjects.reduce((sum, service) => sum + service.price, 0);
    const discount = formData.hasMembership ? newSubtotal * 0.1 : 0;
    const final = newSubtotal - discount + formData.manualAdjustment;

    setSubtotal(newSubtotal);
    setMembershipDiscount(discount);
    setFinalAmount(Math.max(0, final));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Phone number must be exactly 10 digits';
    }

    if (formData.selectedServices.length === 0) {
      newErrors.services = 'Please select at least one service';
    }

    if (!formData.barberId) {
      newErrors.barberId = 'Please select a barber';
    }

    if (formData.hasMembership && !formData.membershipStartDate) {
      newErrors.membershipStartDate = 'Membership start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const selectedBarber = barbers.find(b => b.id === formData.barberId);
    const selectedServiceObjects = services.filter(service => 
      formData.selectedServices.includes(service.id)
    );

    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      customerId: `cust_${Date.now()}`,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      barberId: formData.barberId,
      barberName: selectedBarber?.name || '',
      services: formData.selectedServices,
      serviceNames: selectedServiceObjects.map(s => s.name),
      subtotal,
      finalAmount,
      paymentMode: formData.paymentMode,
      hasMembership: formData.hasMembership,
      membershipDiscount,
      date: new Date(),
      timestamp: Date.now(),
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Reset form
    setFormData({
      customerName: '',
      customerPhone: '',
      selectedServices: [],
      barberId: '',
      hasMembership: false,
      membershipStartDate: '',
      paymentMode: 'Cash',
      manualAdjustment: 0,
    });

    setIsSubmitting(false);
  };

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const cardClass = `${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm transition-all duration-300`;
  const inputClass = `w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-1 focus:ring-white' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-1 focus:ring-gray-900'
  }`;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fadeIn">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Billing Form */}
        <div className={cardClass + ' p-8'}>
          <h2 className={`text-2xl font-bold mb-8 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <User className="mr-3 h-6 w-6" />
            Customer Billing
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Details */}
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  className={`${inputClass} ${errors.customerName ? 'border-red-500' : ''}`}
                  placeholder="Enter customer name"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1 animate-slideIn">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-3.5 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className={`${inputClass} pl-10 ${errors.customerPhone ? 'border-red-500' : ''}`}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
                {errors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1 animate-slideIn">{errors.customerPhone}</p>
                )}
              </div>
            </div>

            {/* Services Selection */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Services *
              </label>
              <div className={`grid grid-cols-2 gap-3 max-h-52 overflow-y-auto border rounded-lg p-4 ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                {services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                      formData.selectedServices.includes(service.id)
                        ? darkMode 
                          ? 'bg-white text-gray-900 border-white' 
                          : 'bg-gray-900 text-white border-gray-900'
                        : darkMode
                          ? 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                          : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm flex items-center justify-between">
                      {service.name}
                      {formData.selectedServices.includes(service.id) && (
                        <CheckCircle className="h-4 w-4 animate-scaleIn" />
                      )}
                    </div>
                    <div className="text-xs opacity-75 mt-1">{formatCurrency(service.price)}</div>
                  </div>
                ))}
              </div>
              {errors.services && (
                <p className="text-red-500 text-sm mt-1 animate-slideIn">{errors.services}</p>
              )}
            </div>

            {/* Barber Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Select Barber *
              </label>
              <select
                value={formData.barberId}
                onChange={(e) => setFormData(prev => ({ ...prev, barberId: e.target.value }))}
                className={`${inputClass} ${errors.barberId ? 'border-red-500' : ''}`}
              >
                <option value="">Choose a barber</option>
                {barbers.map(barber => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name} ({barber.experience} years exp.)
                  </option>
                ))}
              </select>
              {errors.barberId && (
                <p className="text-red-500 text-sm mt-1 animate-slideIn">{errors.barberId}</p>
              )}
            </div>

            {/* Membership */}
            <div className="space-y-4">
              <div className={`flex items-center space-x-3 p-4 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <input
                  type="checkbox"
                  id="membership"
                  checked={formData.hasMembership}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasMembership: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="membership" className={`text-sm font-medium flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <Gift className="mr-2 h-4 w-4" />
                  Customer has membership (10% discount)
                </label>
              </div>

              {formData.hasMembership && (
                <div className="animate-slideIn">
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Membership Start Date *
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-3.5 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type="date"
                      value={formData.membershipStartDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, membershipStartDate: e.target.value }))}
                      className={`${inputClass} pl-10 ${errors.membershipStartDate ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.membershipStartDate && (
                    <p className="text-red-500 text-sm mt-1 animate-slideIn">{errors.membershipStartDate}</p>
                  )}
                </div>
              )}
            </div>

            {/* Payment Mode */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Payment Mode
              </label>
              <div className="flex space-x-4">
                {['Cash', 'Paytm'].map(mode => (
                  <label key={mode} className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg border transition-all duration-200 ${darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="paymentMode"
                      value={mode}
                      checked={formData.paymentMode === mode}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMode: e.target.value as 'Cash' | 'Paytm' }))}
                      className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                    />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Manual Adjustment */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Manual Adjustment (₹)
              </label>
              <input
                type="number"
                value={formData.manualAdjustment}
                onChange={(e) => setFormData(prev => ({ ...prev, manualAdjustment: Number(e.target.value) }))}
                className={inputClass}
                placeholder="0"
              />
            </div>

            {/* Billing Summary */}
            {subtotal > 0 && (
              <div className={`rounded-lg p-4 space-y-2 border animate-slideIn ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex justify-between text-sm">
                  <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Subtotal:</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(subtotal)}</span>
                </div>
                {membershipDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="font-medium">Membership Discount (10%):</span>
                    <span className="font-semibold">-{formatCurrency(membershipDiscount)}</span>
                  </div>
                )}
                {formData.manualAdjustment !== 0 && (
                  <div className={`flex justify-between text-sm ${formData.manualAdjustment > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    <span className="font-medium">Manual Adjustment:</span>
                    <span className="font-semibold">{formData.manualAdjustment > 0 ? '+' : ''}{formatCurrency(formData.manualAdjustment)}</span>
                  </div>
                )}
                <hr className={`${darkMode ? 'border-gray-600' : 'border-gray-300'}`} />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(finalAmount)}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                isSubmitting
                  ? darkMode
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : darkMode
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  <span>Generate Bill</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recent Transactions */}
        <div className={cardClass + ' p-8'}>
          <h3 className={`text-xl font-bold mb-6 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <CreditCard className="mr-3 h-5 w-5" />
            Recent Transactions
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {transactions.slice(0, 10).map(transaction => (
              <div key={transaction.id} className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.customerName}</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{transaction.customerPhone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(transaction.finalAmount)}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatDateTime(transaction.date)}</p>
                  </div>
                </div>
                <div className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>Barber: {transaction.barberName}</p>
                  <p>Services: {transaction.serviceNames.join(', ')}</p>
                  <p className="flex items-center">
                    Payment: 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.paymentMode === 'Cash' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {transaction.paymentMode}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerBilling;