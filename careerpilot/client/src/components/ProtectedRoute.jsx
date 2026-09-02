import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LoadingState from './LoadingState';

export default function ProtectedRoute() {
  const { token, user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for Zustand to hydrate from localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // While hydrating, show loading state
  if (!isHydrated) {
    return <LoadingState message="Loading..." />;
  }

  // If not authenticated, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render child routes
  return <Outlet />;
}
