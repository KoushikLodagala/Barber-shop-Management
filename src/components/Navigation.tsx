import React from 'react';
import { Users, TrendingUp, Scissors } from 'lucide-react';

interface NavigationProps {
  activeTab: 'billing' | 'analytics';
  onTabChange: (tab: 'billing' | 'analytics') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Scissors className="h-8 w-8" />
            <h1 className="text-xl font-bold">Scissor Barber Shop</h1>
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => onTabChange('billing')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'billing'
                  ? 'bg-white text-orange-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Customer Billing</span>
            </button>
            
            <button
              onClick={() => onTabChange('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'analytics'
                  ? 'bg-white text-orange-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;