import React, { createContext, useContext } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Member, User } from '../types';

interface SharedAuthUser { id: number; name: string; email: string; phone?: string | null; role: 'super_admin' | 'member'; member_id?: number | null; }
interface AuthContextType {
  user: User | null;
  member: Member | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMember: boolean;
  login: (email: string, pass?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRole: (role: 'super_admin' | 'member' | 'guest') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = usePage<{ auth?: { user?: SharedAuthUser | null } }>().props;
  const sharedUser = auth?.user ?? null;
  const user: User | null = sharedUser ? {
    id: String(sharedUser.id), name: sharedUser.name, email: sharedUser.email, phone: sharedUser.phone ?? '',
    role: sharedUser.role, memberId: sharedUser.member_id ? String(sharedUser.member_id) : undefined, createdAt: '',
  } : null;

  const login = async (email: string, pass = ''): Promise<{ success: boolean; message?: string }> => {
    router.post('/login', { email_or_member_id: email, password: pass }, { preserveScroll: true });
    return { success: true };
  };

  const logout = () => router.post('/logout');
  const switchRole = (_role: 'super_admin' | 'member' | 'guest') => router.visit('/login');

  return <AuthContext.Provider value={{ user, member: null, token: null, isAuthenticated: !!user, isAdmin: user?.role === 'super_admin', isMember: user?.role === 'member', login, logout, switchRole }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
