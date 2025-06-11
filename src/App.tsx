
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/auth/Login';
import NotFound from '@/pages/NotFound';
import UserDashboard from '@/pages/users/UsersDashboard';
import UserIndents from '@/pages/users/Indents';
import UserProfile from '@/pages/users/Profile';
import HODDashboard from '@/pages/hod/HODDashboard';
import HODIndents from '@/pages/hod/HODIndents';
import HODProfile from '@/pages/hod/HODProfile';
import StoreDashboard from '@/pages/store/StoreDashboard';
import StoreIndents from '@/pages/store/StoreIndents';
import StoreStock from '@/pages/store/StoreStock';
import StoreTrack from '@/pages/store/StoreTrack';
import StoreProfile from '@/pages/store/StoreProfile';
import RegistrarDashboard from '@/pages/registrar/RegistrarDashboard';
import RegistrarIndents from '@/pages/registrar/RegistrarIndents';
import RegistrarProfile from '@/pages/registrar/RegistrarProfile';
import CPDDashboard from '@/pages/cpd/CPDDashboard';
import CPDIndents from '@/pages/cpd/CPDIndents';
import CPDVendors from '@/pages/cpd/CPDVendors';
import CPDTrack from '@/pages/cpd/CPDTrack';
import CPDProfile from '@/pages/cpd/CPDProfile';
import ManagementDashboard from '@/pages/management/ManagementDashboard';
import ManagementProfile from '@/pages/management/ManagementProfile';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { USER_ROLES } from '@/constants/roles';
import { useAuth } from '@/contexts/AuthContext';

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={user ? <Navigate to={`/${user.role.replace('_', '')}`} replace /> : <Login />} 
        />
        <Route path="/login" element={<Login />} />

        {/* User Department Routes */}
        <Route
          path="/users/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.USER_DEPT]}>
              <Routes>
                <Route index element={<UserDashboard />} />
                <Route path="indents" element={<UserIndents />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* HOD Routes */}
        <Route
          path="/hod/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.HOD]}>
              <Routes>
                <Route index element={<HODDashboard />} />
                <Route path="indents" element={<HODIndents />} />
                <Route path="profile" element={<HODProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Store Routes */}
        <Route
          path="/store/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.STORE]}>
              <Routes>
                <Route index element={<StoreDashboard />} />
                <Route path="indents" element={<StoreIndents />} />
                <Route path="stock" element={<StoreStock />} />
                <Route path="track" element={<StoreTrack />} />
                <Route path="profile" element={<StoreProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Registrar Routes */}
        <Route
          path="/registrar/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.REGISTRAR]}>
              <Routes>
                <Route index element={<RegistrarDashboard />} />
                <Route path="indents" element={<RegistrarIndents />} />
                <Route path="profile" element={<RegistrarProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* CPD Routes */}
        <Route
          path="/cpd/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.CPD]}>
              <Routes>
                <Route index element={<CPDDashboard />} />
                <Route path="indents" element={<CPDIndents />} />
                <Route path="vendors" element={<CPDVendors />} />
                <Route path="track" element={<CPDTrack />} />
                <Route path="profile" element={<CPDProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Management Routes */}
        <Route
          path="/management/*"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.MANAGEMENT]}>
              <Routes>
                <Route index element={<ManagementDashboard />} />
                <Route path="profile" element={<ManagementProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
