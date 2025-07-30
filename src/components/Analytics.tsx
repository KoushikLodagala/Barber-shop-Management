import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, Filter } from 'lucide-react';
import { mockTransactions, barbers, services } from '../data/mockData';
import { formatCurrency, getDateRangeFilter, isDateInRange } from '../utils/dateUtils';
import { Transaction } from '../types';

const Analytics: React.FC = () => {
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<'day' | 'week' | 'month'>('month');
  const [dateRange, setDateRange] = useState(() => getDateRangeFilter('month'));

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction => {
      const dateInRange = isDateInRange(transaction.date, dateRange.start, dateRange.end);
      const barberMatch = !selectedBarber || transaction.barberId === selectedBarber;
      const serviceMatch = !selectedService || transaction.services.includes(selectedService);
      
      return dateInRange && barberMatch && serviceMatch;
    });
  }, [selectedBarber, selectedService, dateRange]);

  const barberPerformance = useMemo(() => {
    const performance = barbers.map(barber => {
      const barberTransactions = filteredTransactions.filter(t => t.barberId === barber.id);
      const totalRevenue = barberTransactions.reduce((sum, t) => sum + t.finalAmount, 0);
      const totalServices = barberTransactions.reduce((sum, t) => sum + t.services.length, 0);
      
      return {
        name: barber.name,
        revenue: totalRevenue,
        services: totalServices,
        transactions: barberTransactions.length,
      };
    });
    
    return performance.sort((a, b) => b.revenue - a.revenue);
  }, [filteredTransactions]);

  const servicePerformance = useMemo(() => {
    const serviceStats: Record<string, { count: number; revenue: number }> = {};
    
    filteredTransactions.forEach(transaction => {
      transaction.services.forEach(serviceId => {
        const service = services.find(s => s.id === serviceId);
        if (service) {
          if (!serviceStats[service.name]) {
            serviceStats[service.name] = { count: 0, revenue: 0 };
          }
          serviceStats[service.name].count += 1;
          serviceStats[service.name].revenue += service.price;
        }
      });
    });
    
    return Object.entries(serviceStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.count - a.count);
  }, [filteredTransactions]);

  const dailyRevenue = useMemo(() => {
    const dailyStats: Record<string, number> = {};
    
    filteredTransactions.forEach(transaction => {
      const dateKey = transaction.date.toISOString().split('T')[0];
      dailyStats[dateKey] = (dailyStats[dateKey] || 0) + transaction.finalAmount;
    });
    
    return Object.entries(dailyStats)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTransactions]);

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.finalAmount, 0);
  const totalTransactions = filteredTransactions.length;
  const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const COLORS = ['#FF9933', '#138808', '#000080', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

  const updateDateRange = (period: 'day' | 'week' | 'month') => {
    setTimePeriod(period);
    setDateRange(getDateRangeFilter(period));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center">
          <TrendingUp className="mr-3 text-orange-500" />
          Employee Analytics
        </h2>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Time Period Filter */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {(['day', 'week', 'month'] as const).map(period => (
              <button
                key={period}
                onClick={() => updateDateRange(period)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  timePeriod === period
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          {/* Barber Filter */}
          <select
            value={selectedBarber}
            onChange={(e) => setSelectedBarber(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Barbers</option>
            {barbers.map(barber => (
              <option key={barber.id} value={barber.id}>{barber.name}</option>
            ))}
          </select>

          {/* Service Filter */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Services</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold">{totalTransactions}</p>
            </div>
            <Users className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Avg Transaction</p>
              <p className="text-2xl font-bold">{formatCurrency(avgTransactionValue)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-200" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Barber Performance Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Barber Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barberPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? formatCurrency(value as number) : value,
                name === 'revenue' ? 'Revenue' : name === 'services' ? 'Services' : 'Transactions'
              ]} />
              <Legend />
              <Bar dataKey="revenue" fill="#FF9933" name="Revenue" />
              <Bar dataKey="services" fill="#138808" name="Services" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Service Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Service Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={servicePerformance.slice(0, 8)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {servicePerformance.slice(0, 8).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Revenue Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value as number), 'Revenue']} />
              <Bar dataKey="revenue" fill="#FF9933" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Barber Performance Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Barber Performance Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2">Barber</th>
                  <th className="text-right py-3 px-2">Revenue</th>
                  <th className="text-right py-3 px-2">Services</th>
                  <th className="text-right py-3 px-2">Transactions</th>
                </tr>
              </thead>
              <tbody>
                {barberPerformance.map((barber, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{barber.name}</td>
                    <td className="py-3 px-2 text-right font-bold text-orange-600">
                      {formatCurrency(barber.revenue)}
                    </td>
                    <td className="py-3 px-2 text-right">{barber.services}</td>
                    <td className="py-3 px-2 text-right">{barber.transactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Performance Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Service Performance Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2">Service</th>
                  <th className="text-right py-3 px-2">Count</th>
                  <th className="text-right py-3 px-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {servicePerformance.map((service, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{service.name}</td>
                    <td className="py-3 px-2 text-right">{service.count}</td>
                    <td className="py-3 px-2 text-right font-bold text-green-600">
                      {formatCurrency(service.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;