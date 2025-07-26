'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
        
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Welcome, {user?.name || user?.email}!</h2>
          <p className="text-gray-600">
            This is your protected dashboard. Only authenticated users can see this page.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
} 