import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/constants/roles';

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


const MOCK_USERS: User[] = [
  { id: '1', name: 'John Teacher', email: 'teacher@dpu.edu.in', role: 'user_dept', department: 'Computer Science' },
  { id: '2', name: 'Dr. Smith', email: 'hod@dpu.edu.in', role: 'hod', department: 'Computer Science' },
  { id: '3', name: 'Store Manager', email: 'store@dpu.edu.in', role: 'store' },
  { id: '4', name: 'Dr. Registrar', email: 'registrar@dpu.edu.in', role: 'registrar' },
  { id: '5', name: 'CPD Officer', email: 'cpd@dpu.edu.in', role: 'cpd' },
  { id: '6', name: 'Purchase Officer', email: 'officer@dpu.edu.in', role: 'officer', department: 'Electronics & Lab Equipment' },
  { id: '7', name: 'Management Head', email: 'management@dpu.edu.in', role: 'management' },
  { id: '8', name: 'TechCorp Solutions', email: 'vendor@techcorp.com', role: 'vendor', department: 'Electronics' },
  { id: '9', name: 'Principal', email: 'principal@dpu.edu.in', role: 'principal' },
  { id: '10', name: 'Account Officer', email: 'account@dpu.edu.in', role: 'account' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('dpu_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem('dpu_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const foundUser = MOCK_USERS.find(u => u.email === email);
      if (foundUser && password === 'dpu123') {
        setUser(foundUser);
        localStorage.setItem('dpu_user', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dpu_user');
  };

  const value = { user, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthProvider;
