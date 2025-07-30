import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import CustomerBilling from './components/CustomerBilling';
import Analytics from './components/Analytics';

function App() {
  const [activeTab, setActiveTab] = useState<'billing' | 'analytics'>('billing');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <main className="py-8">
        {activeTab === 'billing' && <CustomerBilling darkMode={darkMode} />}
        {activeTab === 'analytics' && <Analytics darkMode={darkMode} />}
      </main>
    </div>
  );
}

export default App;