'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user;
  const isAuthenticated = !!user;
  const isLoading = status === 'loading';

  const login = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    
    if (!result?.error) {
      router.refresh();
    }
    
    return result;
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
    router.refresh();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
} 