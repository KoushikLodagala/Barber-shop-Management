import React from 'react';
import { Users, TrendingUp, Scissors, Moon, Sun } from 'lucide-react';

interface NavigationProps {
  activeTab: 'billing' | 'analytics';
  onTabChange: (tab: 'billing' | 'analytics') => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, darkMode, toggleDarkMode }) => {
  return (
    <nav className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b transition-all duration-300 shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Scissors className={`h-8 w-8 ${darkMode ? 'text-white' : 'text-gray-900'} transform hover:rotate-12 transition-all duration-300`} />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                MANAN Barber Shop
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} -mt-1`}>Premium Grooming</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              <button
                onClick={() => onTabChange('billing')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'billing'
                    ? darkMode 
                      ? 'bg-white text-gray-900' 
                      : 'bg-gray-900 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Billing</span>
              </button>
              
              <button
                onClick={() => onTabChange('analytics')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'analytics'
                    ? darkMode 
                      ? 'bg-white text-gray-900' 
                      : 'bg-gray-900 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Analytics</span>
              </button>
            </div>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-200 ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;