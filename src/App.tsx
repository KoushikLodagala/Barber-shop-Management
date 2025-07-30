import React, { useState } from 'react';
import Navigation from './components/Navigation';
import CustomerBilling from './components/CustomerBilling';
import Analytics from './components/Analytics';

function App() {
  const [activeTab, setActiveTab] = useState<'billing' | 'analytics'>('billing');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="py-8">
        {activeTab === 'billing' && <CustomerBilling />}
        {activeTab === 'analytics' && <Analytics />}
      </main>
    </div>
  );
}

export default App;