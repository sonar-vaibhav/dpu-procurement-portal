
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Login from "@/pages/Login";
import UsersDashboard from "@/pages/users/UsersDashboard";
import CreateIndent from "@/pages/users/CreateIndent";
import HODDashboard from "@/pages/hod/HODDashboard";
import CPDDashboard from "@/pages/cpd/CPDDashboard";
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
      <Route path="/users/create-indent" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.USER_DEPT]}>
          <CreateIndent />
        </ProtectedRoute>
      } />
      
      {/* HOD Routes */}
      <Route path="/hod" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.HOD]}>
          <HODDashboard />
        </ProtectedRoute>
      } />
      
      {/* Store Routes */}
      <Route path="/store" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.STORE]}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Store Dashboard</h1>
              <p className="text-gray-600">Coming Soon - Store Department functionality</p>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      {/* Registrar Routes */}
      <Route path="/registrar" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.REGISTRAR]}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Registrar Dashboard</h1>
              <p className="text-gray-600">Coming Soon - Registrar functionality</p>
            </div>
          </div>
        </ProtectedRoute>
      } />
      
      {/* CPD Routes */}
      <Route path="/cpd" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.CPD]}>
          <CPDDashboard />
        </ProtectedRoute>
      } />
      
      {/* Management Routes */}
      <Route path="/management" element={
        <ProtectedRoute allowedRoles={[USER_ROLES.MANAGEMENT]}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Management Dashboard</h1>
              <p className="text-gray-600">Coming Soon - Management functionality</p>
            </div>
          </div>
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
