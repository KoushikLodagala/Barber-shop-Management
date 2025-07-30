import React, { useState, useEffect } from 'react';
import { User, Phone, Scissors, CreditCard, Gift, Calendar, Plus, Trash2 } from 'lucide-react';
import { services, barbers, mockTransactions } from '../data/mockData';
import { Transaction } from '../types';
import { formatCurrency, formatDateTime } from '../utils/dateUtils';

const CustomerBilling: React.FC = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const selectedBarber = barbers.find(b => b.id === formData.barberId);
    const selectedServiceObjects = services.filter(service => 
      formData.selectedServices.includes(service.id)
    );

    const membershipExpiry = formData.hasMembership && formData.membershipStartDate
      ? new Date(new Date(formData.membershipStartDate).setFullYear(new Date(formData.membershipStartDate).getFullYear() + 1))
      : undefined;

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

    alert('Bill generated successfully!');
  };

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Billing Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <User className="mr-2 text-orange-500" />
            Customer Billing
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter customer name"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>
                {errors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                )}
              </div>
            </div>

            {/* Services Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Services *
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      formData.selectedServices.includes(service.id)
                        ? 'bg-orange-50 border-orange-300 text-orange-700'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium text-sm">{service.name}</div>
                    <div className="text-xs text-gray-600">{formatCurrency(service.price)}</div>
                  </div>
                ))}
              </div>
              {errors.services && (
                <p className="text-red-500 text-sm mt-1">{errors.services}</p>
              )}
            </div>

            {/* Barber Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Barber *
              </label>
              <select
                value={formData.barberId}
                onChange={(e) => setFormData(prev => ({ ...prev, barberId: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.barberId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Choose a barber</option>
                {barbers.map(barber => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name} ({barber.experience} years exp.)
                  </option>
                ))}
              </select>
              {errors.barberId && (
                <p className="text-red-500 text-sm mt-1">{errors.barberId}</p>
              )}
            </div>

            {/* Membership */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="membership"
                  checked={formData.hasMembership}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasMembership: e.target.checked }))}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="membership" className="text-sm font-medium text-gray-700 flex items-center">
                  <Gift className="mr-1 h-4 w-4 text-orange-500" />
                  Customer has membership (10% discount)
                </label>
              </div>

              {formData.hasMembership && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membership Start Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.membershipStartDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, membershipStartDate: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.membershipStartDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.membershipStartDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.membershipStartDate}</p>
                  )}
                </div>
              )}
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Mode
              </label>
              <div className="flex space-x-4">
                {['Cash', 'Paytm'].map(mode => (
                  <label key={mode} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMode"
                      value={mode}
                      checked={formData.paymentMode === mode}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMode: e.target.value as 'Cash' | 'Paytm' }))}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Manual Adjustment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manual Adjustment (₹)
              </label>
              <input
                type="number"
                value={formData.manualAdjustment}
                onChange={(e) => setFormData(prev => ({ ...prev, manualAdjustment: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Billing Summary */}
            {subtotal > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {membershipDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Membership Discount (10%):</span>
                    <span>-{formatCurrency(membershipDiscount)}</span>
                  </div>
                )}
                {formData.manualAdjustment !== 0 && (
                  <div className={`flex justify-between text-sm ${formData.manualAdjustment > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    <span>Manual Adjustment:</span>
                    <span>{formData.manualAdjustment > 0 ? '+' : ''}{formatCurrency(formData.manualAdjustment)}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-orange-600">{formatCurrency(finalAmount)}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-5 w-5" />
              <span>Generate Bill</span>
            </button>
          </form>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.slice(0, 10).map(transaction => (
              <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800">{transaction.customerName}</h4>
                    <p className="text-sm text-gray-600">{transaction.customerPhone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">{formatCurrency(transaction.finalAmount)}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(transaction.date)}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Barber: {transaction.barberName}</p>
                  <p>Services: {transaction.serviceNames.join(', ')}</p>
                  <p>Payment: {transaction.paymentMode}</p>
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