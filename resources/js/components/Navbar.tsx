import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Globe, User as UserIcon, LogOut, Menu, X, ChevronDown, PlusCircle } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onOpenQuickTransaction?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  onOpenQuickTransaction,
}) => {
  const { lang, toggleLang, t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  // All primary menu links displayed directly in a single line (no "More" dropdown)
  const navLinks = [
    { id: 'home', label: t('হোম', 'Home') },
    { id: 'about', label: t('পরিচিতি', 'About') },
    { id: 'projects', label: t('প্রকল্প', 'Projects') },
    { id: 'emergency', label: t('জরুরি সেবা', 'Emergency') },
    { id: 'blood-donors', label: t('রক্তদান', 'Blood Donors') },
    { id: 'contact', label: t('যোগাযোগ', 'Contact') },
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left font-serif text-sm sm:text-base lg:text-lg font-bold tracking-tight text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap cursor-pointer shrink-0"
        >
          {lang === 'bn' ? 'উমারখালী কিস্তুপুর যুব সংঘ' : 'UKPJS Welfare Org'}
        </button>

        {/* Zone 2: Single Line Navbar (All primary links visible directly without More dropdown) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2.5 text-xs xl:text-sm font-medium text-stone-300 shrink-0">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`px-2.5 py-1.5 rounded-lg hover:text-white hover:bg-stone-800/60 transition-colors cursor-pointer whitespace-nowrap ${
                currentPage === link.id
                  ? 'text-white bg-stone-800 border-b-2 border-emerald-500 font-semibold shadow-2xs'
                  : 'text-stone-300'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary actions & quick buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Quick Transaction Button for Super Admin */}
          {isAdmin && onOpenQuickTransaction && (
            <button
              onClick={onOpenQuickTransaction}
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('নতুন লেনদেন', 'New Entry')}</span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-medium text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-800 rounded-lg border border-stone-700/60 transition-colors whitespace-nowrap cursor-pointer"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          {/* User / Dashboard Action */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden md:inline truncate max-w-[100px]">
                  {isAdmin ? t('এডমিন', 'Admin') : t('সদস্য', 'Member')}
                </span>
                <ChevronDown className="w-3 h-3 text-stone-300" />
              </button>

              {isRoleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl py-2 z-50 text-xs text-stone-200"
                  onMouseLeave={() => setIsRoleMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-800">
                    <p className="font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-emerald-400 font-mono">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsRoleMenuOpen(false);
                      if (isAdmin) setCurrentPage('admin-dashboard');
                      else setCurrentPage('member-dashboard');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-stone-800 text-stone-200 hover:text-white transition-colors cursor-pointer"
                  >
                    {isAdmin ? t('এডমিন ড্যাশবোর্ড', 'Admin Dashboard') : t('সদস্য ড্যাশবোর্ড', 'Member Dashboard')}
                  </button>

                  <div className="border-t border-stone-800 my-1" />
                  <button
                    onClick={() => { logout(); setIsRoleMenuOpen(false); setCurrentPage('home'); }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-950/60 text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('লগআউট', 'Sign Out')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('login')}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-stone-900 bg-white hover:bg-stone-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            >
              {t('লগইন', 'Sign In')}
            </button>
          )}

          {/* Donate CTA button */}
          <button
            onClick={() => handleNavClick('donation')}
            className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            {t('দান / হাদিয়া', 'Donate')}
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-stone-300 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 bg-stone-900 px-4 py-3 space-y-1">
          {navLinks.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                currentPage === item.id
                  ? 'bg-emerald-800/80 text-white font-semibold'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
            <button
              onClick={() => handleNavClick('donation')}
              className="w-full text-center py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg"
            >
              {t('সহযোগিতা / অনুদান দিন', 'Make a Donation')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
