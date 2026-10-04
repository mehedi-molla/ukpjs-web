import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Home, Layers, PieChart, PhoneCall, LayoutDashboard } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  setCurrentPage,
}) => {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();

  const dashboardTarget = isAdmin ? 'admin-dashboard' : (user ? 'member-dashboard' : 'login');
  const isDashboardActive = currentPage.startsWith('admin-') || currentPage.startsWith('member-') || currentPage === 'login';

  const items = [
    { id: 'home', label: t('হোম', 'Home'), icon: Home },
    { id: 'projects', label: t('প্রকল্প', 'Projects'), icon: Layers },
    { id: 'emergency', label: t('জরুরি', 'Help'), icon: PhoneCall },
    { id: dashboardTarget, label: user ? t('ড্যাশবোর্ড', 'Portal') : t('লগইন', 'Login'), icon: LayoutDashboard, isActive: isDashboardActive },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 text-stone-400">
      <div className="grid grid-cols-4 h-16 items-center">
        {items.map(tab => {
          const Icon = tab.icon;
          const active = tab.isActive !== undefined ? tab.isActive : currentPage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentPage(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 cursor-pointer transition-colors ${
                active ? 'text-emerald-400 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
