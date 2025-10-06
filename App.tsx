
import React, { useState, useCallback } from 'react';
import { UserRole } from './types';
import LoginScreen from './screens/LoginScreen';
import ClientDashboard from './screens/ClientDashboard';
import OwnerDashboard from './screens/OwnerDashboard';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleLogin = useCallback((role: UserRole) => {
    setUserRole(role);
  }, []);
  
  const handleLogout = useCallback(() => {
    setUserRole(null);
  }, []);

  const renderContent = () => {
    switch (userRole) {
      case UserRole.CLIENT:
        return <ClientDashboard onLogout={handleLogout} />;
      case UserRole.OWNER:
        return <OwnerDashboard onLogout={handleLogout} />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {renderContent()}
    </div>
  );
};

export default App;
