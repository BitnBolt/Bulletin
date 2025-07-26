'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-4 text-center">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
          Welcome to <span className="text-blue-600">Bulletin</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600 sm:text-xl">
          A platform for creating and sharing bulletins with the world
        </p>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : isAuthenticated ? (
            <div className="space-y-6">
              <p className="text-lg">
                Hello, <span className="font-semibold">{user?.name || user?.email}</span>!
              </p>
              <div>
                <Link
                  href="/dashboard"
                  className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg">Join our community today!</p>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
                <Link
                  href="/auth/signin"
                  className="rounded-md bg-white px-6 py-3 text-blue-600 shadow hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-blue-600 px-6 py-3 text-white shadow hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
