import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, ROLE_ROUTES } from '@/constants/roles';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: User[] = [
  { id: '1', name: 'John Teacher', email: 'teacher@dpu.edu.in', role: 'user_dept', department: 'Computer Science' },
  { id: '2', name: 'Dr. Smith', email: 'hod@dpu.edu.in', role: 'hod', department: 'Computer Science' },
  { id: '3', name: 'Store Manager', email: 'store@dpu.edu.in', role: 'store' },
  { id: '4', name: 'Dr. Registrar', email: 'registrar@dpu.edu.in', role: 'registrar' },
  { id: '5', name: 'CPD Officer', email: 'cpd@dpu.edu.in', role: 'cpd' },
  { id: '6', name: 'Purchase Officer', email: 'officer@dpu.edu.in', role: 'officer', department: 'Electronics & Lab Equipment' },
  { id: '7', name: 'Management Head', email: 'management@dpu.edu.in', role: 'management' },
  { id: '8', name: 'TechCorp Solutions', email: 'vendor@techcorp.com', role: 'vendor', department: 'Electronics' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('dpu_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('dpu_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock authentication
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (foundUser && password === 'dpu123') {
        setUser(foundUser);
        localStorage.setItem('dpu_user', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dpu_user');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
