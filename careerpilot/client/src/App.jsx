import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';

export default function App() {
  useEffect(() => {
    // App.jsx is now just a wrapper for the router
    // All auth logic is handled by ProtectedRoute
  }, []);

  return <RouterProvider router={router} />;
}
