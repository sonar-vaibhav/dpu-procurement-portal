import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-dpu-red" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            404 - Page Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Button
            className="w-full bg-dpu-red hover:bg-dpu-red-dark text-white"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/')}
          >
            Return to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
