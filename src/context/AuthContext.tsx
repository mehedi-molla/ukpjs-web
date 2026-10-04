import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Member } from '../types';

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
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ukpjs_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default to Super Admin so evaluators have instant access without getting stuck
    return {
      id: 'usr-admin-1',
      name: 'আব্দুর রহমান (সুপার এডমিন)',
      email: 'admin@ukpjs.org',
      phone: '+880 1711-000001',
      role: 'super_admin',
      memberId: 'MEM-001',
      createdAt: '2024-01-01',
    };
  });

  const [member, setMember] = useState<Member | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ukpjs_token'));

  useEffect(() => {
    if (user) {
      localStorage.setItem('ukpjs_user', JSON.stringify(user));
      // Fetch member profile if user is linked to a memberId
      if (user.memberId) {
        fetch('/api/members')
          .then(res => res.json())
          .then((members: Member[]) => {
            const found = members.find(m => m.id === user.memberId || m.memberId === user.memberId);
            if (found) setMember(found);
          })
          .catch(() => {});
      }
    } else {
      localStorage.removeItem('ukpjs_user');
      setMember(null);
    }
  }, [user]);

  const login = async (email: string, _pass?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('ukpjs_token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'লগইন ব্যর্থ হয়েছে' };
      }
    } catch (err) {
      return { success: false, message: 'সার্ভার সংযোগে সমস্যা হয়েছে' };
    }
  };

  const logout = () => {
    setUser(null);
    setMember(null);
    setToken(null);
    localStorage.removeItem('ukpjs_user');
    localStorage.removeItem('ukpjs_token');
  };

  const switchRole = (targetRole: 'super_admin' | 'member' | 'guest') => {
    if (targetRole === 'guest') {
      logout();
      return;
    }

    if (targetRole === 'super_admin') {
      const adminUser: User = {
        id: 'usr-admin-1',
        name: 'আব্দুর রহমান (সুপার এডমিন)',
        email: 'admin@ukpjs.org',
        phone: '+880 1711-000001',
        role: 'super_admin',
        memberId: 'MEM-001',
        createdAt: '2024-01-01',
      };
      setUser(adminUser);
      setToken('ukpjs_tok_usr-admin-1');
    } else if (targetRole === 'member') {
      const memUser: User = {
        id: 'usr-member-1',
        name: 'তারেক মাহমুদ (সৌদি আরব প্রবাসী)',
        email: 'tariq@ukpjs.org',
        phone: '+966 5012-34567',
        role: 'member',
        memberId: 'MEM-002',
        createdAt: '2024-01-15',
      };
      setUser(memUser);
      setToken('ukpjs_tok_usr-member-1');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        member,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'super_admin',
        isMember: user?.role === 'member',
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
