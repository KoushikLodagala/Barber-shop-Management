import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Filter, Award, Target, BarChart3 } from 'lucide-react';
import { mockTransactions, barbers, services } from '../data/mockData';
import { formatCurrency, getDateRangeFilter, isDateInRange } from '../utils/dateUtils';

interface AnalyticsProps {
  darkMode: boolean;
}

const Analytics: React.FC<AnalyticsProps> = ({ darkMode }) => {
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

  const COLORS = ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6', '#111827', '#1F2937'];

  const updateDateRange = (period: 'day' | 'week' | 'month') => {
    setTimePeriod(period);
    setDateRange(getDateRangeFilter(period));
  };

  const cardClass = `${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border shadow-sm transition-all duration-300`;
  const selectClass = `px-3 py-2 border rounded-lg text-sm transition-all duration-200 ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
  }`;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className={`text-3xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <TrendingUp className="mr-3 h-8 w-8" />
          Analytics Dashboard
        </h2>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Time Period Filter */}
          <div className={`flex space-x-1 rounded-lg p-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {(['day', 'week', 'month'] as const).map(period => (
              <button
                key={period}
                onClick={() => updateDateRange(period)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  timePeriod === period
                    ? darkMode 
                      ? 'bg-white text-gray-900' 
                      : 'bg-gray-900 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
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
            className={selectClass}
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
            className={selectClass}
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
        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(totalRevenue)}</p>
            </div>
            <DollarSign className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </div>
        </div>

        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Transactions</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalTransactions}</p>
            </div>
            <Users className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </div>
        </div>

        <div className={`${cardClass} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Transaction</p>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(avgTransactionValue)}</p>
            </div>
            <TrendingUp className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Barber Performance Chart */}
        <div className={`${cardClass} p-6`}>
          <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Award className="mr-2 h-5 w-5" />
            Barber Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barberPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280', fontSize: 12 }}
              />
              <YAxis tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280', fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(value as number) : value,
                  name === 'revenue' ? 'Revenue' : name === 'services' ? 'Services' : 'Transactions'
                ]}
                contentStyle={{
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#FFFFFF' : '#000000'
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill={darkMode ? '#FFFFFF' : '#000000'} name="Revenue" radius={[2, 2, 0, 0]} />
              <Bar dataKey="services" fill={darkMode ? '#9CA3AF' : '#6B7280'} name="Services" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Service Distribution */}
        <div className={`${cardClass} p-6`}>
          <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Target className="mr-2 h-5 w-5" />
            Service Distribution
          </h3>
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
              <Tooltip 
                formatter={(value) => [value, 'Count']}
                contentStyle={{
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#FFFFFF' : '#000000'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Revenue Trend */}
        <div className={`${cardClass} p-6 lg:col-span-2`}>
          <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <BarChart3 className="mr-2 h-5 w-5" />
            Daily Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280', fontSize: 12 }}
              />
              <YAxis tick={{ fill: darkMode ? '#D1D5DB' : '#6B7280', fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                contentStyle={{
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#FFFFFF' : '#000000'
                }}
              />
              <Bar dataKey="revenue" fill={darkMode ? '#FFFFFF' : '#000000'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Barber Performance Table */}
        <div className={`${cardClass} p-6`}>
          <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Users className="mr-2 h-5 w-5" />
            Barber Performance Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Barber</th>
                  <th className={`text-right py-3 px-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Revenue</th>
                  <th className={`text-right py-3 px-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Services</th>
                  <th className={`text-right py-3 px-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Transactions</th>
                </tr>
              </thead>
              <tbody>
                {barberPerformance.map((barber, index) => (
                  <tr key={index} className={`border-b transition-colors duration-200 ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <td className={`py-3 px-2 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{barber.name}</td>
                    <td className={`py-3 px-2 text-right font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(barber.revenue)}
                    </td>
                    <td className={`py-3 px-2 text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{barber.services}</td>
                    <td className={`py-3 px-2 text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{barber.transactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Performance Table */}
        <div className={`${cardClass} p-6`}>
          <h3 className={`text-xl font-bold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Target className="mr-2 h-5 w-5" />
            Service Performance Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Service</th>
                  <th className={`text-right py-3 px-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Count</th>
                  <th className={`text-right py-3 px-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {servicePerformance.map((service, index) => (
                  <tr key={index} className={`border-b transition-colors duration-200 ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <td className={`py-3 px-2 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{service.name}</td>
                    <td className={`py-3 px-2 text-right ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{service.count}</td>
                    <td className={`py-3 px-2 text-right font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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