import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PatientEMR } from './components/PatientEMR';
import { Pharmacy } from './components/Pharmacy';
import { Billing } from './components/Billing';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { AIAssistant } from './components/AIAssistant';
import { ViewState } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD: return <Dashboard />;
      case ViewState.EMR: return <PatientEMR />;
      case ViewState.PHARMACY: return <Pharmacy />;
      case ViewState.BILLING: return <Billing />;
      case ViewState.SETTINGS: return <Settings />;
      default: return <Dashboard />;
    }
  };

  // If not authenticated, show Login screen
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-nexus-900 text-slate-100 font-sans selection:bg-nexus-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900 relative">
        {/* Pattern Background Overlay */}
        <div className="h-full overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
            {renderContent()}
        </div>
      </main>

      {/* Global AI Assistant Overlay */}
      <AIAssistant />
    </div>
  );
}

export default App;