import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo = '/admin/login'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('adminToken');
      const admin = localStorage.getItem('adminData');
      
      if (requireAuth) {
        if (!token || !admin) {
          setIsAuthenticated(false);
        } else {
          // Validate token format and admin data
          try {
            const parsedAdmin = JSON.parse(admin);
            if (parsedAdmin && parsedAdmin.id && parsedAdmin.email && parsedAdmin.role) {
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(false);
              // Clear invalid data
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminData');
            }
          } catch (error) {
            setIsAuthenticated(false);
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
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
          <p className="text-gray-600">Verifying admin authentication...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    // Redirect to admin login with return URL
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${redirectTo}?returnUrl=${returnUrl}`} replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
