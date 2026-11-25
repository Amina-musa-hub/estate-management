import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashboard';
import Apartments from './pages/apartments/apartments';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '/login', element: <Login /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/apartments',
    element: (
      <ProtectedRoute>
        <Apartments />
      </ProtectedRoute>
    ),
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
