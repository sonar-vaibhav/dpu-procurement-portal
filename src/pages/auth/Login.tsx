
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROLE_ROUTES } from '@/constants/roles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to DPU Procurement System",
        });
        
        // Get user from localStorage to determine redirect
        const userData = localStorage.getItem('dpu_user');
        if (userData) {
          const user = JSON.parse(userData);
          navigate(ROLE_ROUTES[user.role]);
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-2">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img src="/og_dpu_logo.png" alt="DPU Logo" className="w-28 h-16" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                DPU Procurement System
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to access your dashboard
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full dpu-button-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
              <div className="text-xs space-y-1 text-gray-500">

                <p>• teacher@dpu.edu.in (User Dept)</p>
                <p>• hod@dpu.edu.in (HOD)</p>
                <p>• store@dpu.edu.in (Store)</p>
                <p>• registrar@dpu.edu.in (Registrar)</p>
                <p>• cpd@dpu.edu.in (CPD)</p>
                <p>• management@dpu.edu.in (Management)</p>
                <p>• principal@dpu.edu.in (Principal)</p>
                <p>• vendor@techcorp.com (Vendor)</p>
                <p>• officer@dpu.edu.in (CPD Officer)</p>
                <p>• account@dpu.edu.in (Account Officer)</p>
                
                
                <p className="mt-2 font-medium">Password: dpu123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
