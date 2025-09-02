import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';

const AdminTestPage: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <AdminDashboard />
      </div>
    </AuthProvider>
  );
};

export default AdminTestPage;