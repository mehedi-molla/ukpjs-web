import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { WebsiteSettings } from '../../types';
import { Save, Settings, Phone, Landmark, MapPin } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { lang, t } = useLanguage();
  const { showToast } = useNotification();

  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        showToast(t('সেটিংস সফলভাবে সংরক্ষিত হয়েছে', 'Settings saved successfully'), 'success');
      } else {
        showToast('সংরক্ষণ ব্যর্থ হয়েছে', 'error');
      }
    } catch {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-12 text-center text-xs text-stone-400">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
          {t('সংগঠন সেটিংস ও হিসাব নম্বর ব্যবস্থাপনা', 'Organization Settings & Payment Accounts')}
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          {t('বিকাশ, নগদ, ব্যাংক অ্যাকাউন্ট, যোগাযোগের ঠিকানা ও মূল লক্ষ্যসমূহ আপডেট করুন।', 'Update official payment channels, phone numbers, and organizational copy.')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 text-xs">
        
        {/* Payment Numbers */}
        <div className="space-y-4">
          <h2 className="text-sm font-serif font-bold text-stone-900 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-700" />
            <span>{t('অনুদান ও হাদিয়া গ্রহণের অ্যাকাউন্ট ও নম্বরসমূহ', 'Donation Accounts')}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('বিকাশ নম্বর (bKash)', 'bKash Number')}</label>
              <input
                type="text"
                value={settings.bkashNumber}
                onChange={e => setSettings({ ...settings, bkashNumber: e.target.value })}
                className="w-full px-3 py-2 font-mono text-sm text-stone-900 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('নগদ নম্বর (Nagad)', 'Nagad Number')}</label>
              <input
                type="text"
                value={settings.nagadNumber}
                onChange={e => setSettings({ ...settings, nagadNumber: e.target.value })}
                className="w-full px-3 py-2 font-mono text-sm text-stone-900 border border-stone-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h2 className="text-sm font-serif font-bold text-stone-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-700" />
            <span>{t('যোগাযোগের তথ্য ও হটলাইন', 'Contact & Hotline')}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('হটলাইন ফোন নম্বর', 'Hotline Phone')}</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3 py-2 font-mono text-sm text-stone-900 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('অফিসিয়াল ইমেইল', 'Official Email')}</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 font-mono text-sm text-stone-900 border border-stone-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">{t('গ্রামের কার্যালয় ঠিকানা', 'Village Address')}</label>
            <input
              type="text"
              value={settings.address}
              onChange={e => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 text-sm text-stone-900 border border-stone-300 rounded-xl"
            />
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h2 className="text-sm font-serif font-bold text-stone-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-700" />
            <span>{t('সংগঠনের ভিশন ও পরিচিতি তথ্য', 'Mission & About Statement')}</span>
          </h2>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">{t('সংগঠনের লক্ষ্য (Mission)', 'Mission')}</label>
            <textarea
              rows={2}
              value={settings.missionBn}
              onChange={e => setSettings({ ...settings, missionBn: e.target.value })}
              className="w-full px-3 py-2 text-xs text-stone-900 border border-stone-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">{t('সংগঠনের স্বপ্ন (Vision)', 'Vision')}</label>
            <textarea
              rows={2}
              value={settings.visionBn}
              onChange={e => setSettings({ ...settings, visionBn: e.target.value })}
              className="w-full px-3 py-2 text-xs text-stone-900 border border-stone-300 rounded-xl"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? t('সংরক্ষণ হচ্ছে...', 'Saving...') : t('সেটিংস সংরক্ষণ করুন', 'Save Settings')}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
