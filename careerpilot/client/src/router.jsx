import { createBrowserRouter } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AppShell } from './components/AppShell';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import InternshipExplorer from './pages/InternshipExplorer';
import { InternshipDetails } from './pages/InternshipDetails';
import { ApplicationTracker } from './pages/ApplicationTracker';
import { Analytics } from './pages/Analytics';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'profile', element: <Profile /> },
          { path: 'internships', element: <InternshipExplorer /> },
          { path: 'internships/:id', element: <InternshipDetails /> },
          { path: 'tracker', element: <ApplicationTracker /> },
          { path: 'analytics', element: <Analytics /> }
        ]
      }
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);

export default router;
