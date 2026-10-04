import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ShieldCheck, User, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC<{ setCurrentPage: (page: string) => void }> = ({ setCurrentPage }) => {
  const { t } = useLanguage();
  const { login, switchRole } = useAuth();
  const { showToast } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      showToast(t('লগইন সফল হয়েছে!', 'Login successful!'), 'success');
      setCurrentPage('admin-dashboard');
    } else {
      showToast(res.message || 'লগইন ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleQuickDemoLogin = (role: 'super_admin' | 'member') => {
    switchRole(role);
    showToast(t(`${role === 'super_admin' ? 'সুপার এডমিন' : 'সদস্য'} অ্যাকাউন্টে লগইন করা হয়েছে`, `Logged in as ${role}`), 'info');
    setCurrentPage(role === 'super_admin' ? 'admin-dashboard' : 'member-dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          {t('পোর্টাল লগইন', 'Portal Sign In')}
        </h1>
        <p className="text-xs text-stone-500">
          {t('উমারখালী কিস্তুপুর প্রবাসী যুব সংঘ - ব্যবস্থাপনা ও সদস্য পোর্টাল', 'UKPJS Management & Member Portal')}
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">{t('ইমেইল বা মেম্বার আইডি *', 'Email or Member ID *')}</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="admin@ukpjs.org"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">{t('পাসওয়ার্ড *', 'Password *')}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{loading ? t('যাচাই হচ্ছে...', 'Authenticating...') : t('লগইন করুন', 'Sign In')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Switchers for Instant Testing */}
        <div className="pt-4 border-t border-stone-100 space-y-2">
          <span className="text-[11px] font-semibold text-stone-500 block text-center uppercase tracking-wider">
            {t('দ্রুত পরীক্ষামূলক প্রবেশ (1-Click Demo):', 'Quick Demo Access:')}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('super_admin')}
              className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold text-left transition-colors cursor-pointer"
            >
              <span className="block font-bold text-xs">{t('সুপার এডমিন', 'Super Admin')}</span>
              <span className="text-[10px] text-emerald-700">পূর্ণ হিসাব ও লেনদেন এন্ট্রি</span>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('member')}
              className="p-2.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-900 text-xs font-semibold text-left transition-colors cursor-pointer"
            >
              <span className="block font-bold text-xs">{t('প্রবাসী সদস্য', 'Diaspora Member')}</span>
              <span className="text-[10px] text-stone-500">ব্যক্তিগত হাদিয়া ও রসিদ</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
