import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (requireAuth) {
        if (!token || !user) {
          setIsAuthenticated(false);
        } else {
          // Validate token format (basic check)
          try {
            const parsedUser = JSON.parse(user);
            if (parsedUser && parsedUser.id && parsedUser.email) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
              // Clear invalid data
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          } catch (error) {
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } else {
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };

    checkAuthentication();
  }, [requireAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return URL
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${redirectTo}?returnUrl=${returnUrl}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
