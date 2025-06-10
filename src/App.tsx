
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Login from "@/pages/Login";
import UsersDashboard from "@/pages/users/UsersDashboard";
import Indents from "@/pages/users/Indents";
import Profile from "@/pages/users/Profile";
import HODDashboard from "@/pages/hod/HODDashboard";
import HODIndents from "@/pages/hod/HODIndents";
import HODProfile from "@/pages/hod/HODProfile";
import StoreDashboard from "@/pages/store/StoreDashboard";
import StoreIndents from "@/pages/store/StoreIndents";
import StoreProfile from "@/pages/store/StoreProfile";
import RegistrarDashboard from "@/pages/registrar/RegistrarDashboard";
import RegistrarIndents from "@/pages/registrar/RegistrarIndents";
import RegistrarProfile from "@/pages/registrar/RegistrarProfile";
import CPDDashboard from "@/pages/cpd/CPDDashboard";
import CPDQuotes from "@/pages/cpd/CPDQuotes";
import CPDProfile from "@/pages/cpd/CPDProfile";
import ManagementDashboard from "@/pages/management/ManagementDashboard";
import ManagementProfile from "@/pages/management/ManagementProfile";
import { USER_ROLES } from "@/constants/roles";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${user.role.replace('_', '')}`} replace />} />
      
      {/* User Department Routes */}
      <Route path="/users" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.USER_DEPT]}>
          <UsersDashboard />
        </ProtectedRoute>
      } />
      <Route path="/users/indents" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.USER_DEPT]}>
          <Indents />
        </ProtectedRoute>
      } />
      <Route path="/users/profile" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.USER_DEPT]}>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* HOD Routes */}
      <Route path="/hod" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.HOD]}>
          <HODDashboard />
        </ProtectedRoute>
      } />
      <Route path="/hod/indents" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.HOD]}>
          <HODIndents />
        </ProtectedRoute>
      } />
      <Route path="/hod/profile" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.HOD]}>
          <HODProfile />
        </ProtectedRoute>
      } />
      
      {/* Store Routes */}
      <Route path="/store" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.STORE]}>
          <StoreDashboard />
        </ProtectedRoute>
      } />
      <Route path="/store/indents" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.STORE]}>
          <StoreIndents />
        </ProtectedRoute>
      } />
      <Route path="/store/profile" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.STORE]}>
          <StoreProfile />
        </ProtectedRoute>
      } />
      
      {/* Registrar Routes */}
      <Route path="/registrar" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.REGISTRAR]}>
          <RegistrarDashboard />
        </ProtectedRoute>
      } />
      <Route path="/registrar/indents" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.REGISTRAR]}>
          <RegistrarIndents />
        </ProtectedRoute>
      } />
      <Route path="/registrar/profile" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.REGISTRAR]}>
          <RegistrarProfile />
        </ProtectedRoute>
      } />
      
      {/* CPD Routes */}
      <Route path="/cpd" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CPD]}>
          <CPDDashboard />
        </ProtectedRoute>
      } />
      <Route path="/cpd/quotes" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CPD]}>
          <CPDQuotes />
        </ProtectedRoute>
      } />
      <Route path="/cpd/profile" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CPD]}>
          <CPDProfile />
        </ProtectedRoute>
      } />
      
      {/* Management Routes */}
      <Route path="/management" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.MANAGEMENT]}>
          <ManagementDashboard />
        </ProtectedRoute>
      } />
      <Route path="/management/profile" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.MANAGEMENT]}>
          <ManagementProfile />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
