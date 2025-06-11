
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/auth/Login';

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={`/${user.role.replace('_', '')}`} replace />;
  }

  return <Login />;
};

export default Index;
