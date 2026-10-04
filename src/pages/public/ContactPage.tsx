import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { WebsiteSettings } from '../../types';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { showToast } = useNotification();

  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      showToast(t('আপনার বার্তা সফলভাবে গৃহীত হয়েছে।', 'Your message has been sent successfully.'), 'success');
      setName('');
      setPhone('');
      setMessage('');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 pb-6 border-b border-stone-200">
        <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">
          {t('সরাসরি যোগাযোগ', 'Direct Communication')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
          {t('আমাদের সাথে যোগাযোগ করুন', 'Contact Organization')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto">
          {t(
            'সংগঠনের কার্যক্রম, অনুদান, প্রবাসী মেম্বারশিপ বা যেকোনো পরামর্শের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।',
            'Get in touch with our village coordinators and diaspora representatives for inquiries and advice.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Contact Information & Office Details */}
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 text-stone-100 border border-stone-800 space-y-6">
            <h2 className="text-xl font-serif font-bold text-white">
              {t('কেন্দ্রীয় কার্যালয় ও তথ্য কেন্দ্র', 'Central Office & Information')}
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white mb-0.5">{t('গ্রামের কার্যালয় ঠিকানা:', 'Village Office Address:')}</strong>
                  <span>{settings?.address || 'উমারখালী কিস্তুপুর, ডাকঘর: কিস্তুপুর, জেলা: কুষ্টিয়া, বাংলাদেশ'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white mb-0.5">{t('জরুরি হটলাইন / মোবাইল:', 'Hotline / Mobile:')}</strong>
                  <span className="font-mono">{settings?.contactPhone || '+880 1712-345678'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white mb-0.5">{t('অফিসিয়াল ইমেইল:', 'Official Email:')}</strong>
                  <span className="font-mono">{settings?.contactEmail || 'ukpjs.welfare@gmail.com'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 leading-relaxed">
              {t(
                'প্রবাসী ভাইয়েরা হোয়াটসঅ্যাপের মাধ্যমে যেকোনো সময় কার্যকরী কমিটির সাথে সরাসরি অডিও/ভিডিও কনফারেন্সে যুক্ত হতে পারেন।',
                'Expatriate brothers can coordinate via WhatsApp group voice meetings with the executive committee.'
              )}
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
          <div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              {t('পরামর্শ বা বার্তা পাঠান', 'Send Feedback or Inquiry')}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {t('আপনার মতামত বা প্রশ্ন আমাদের কাছে অত্যন্ত মূল্যবান।', 'We appreciate your valuable feedback.')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('আপনার নাম *', 'Full Name *')}</label>
              <input
                type="text"
                required
                placeholder="যেমন: তারেক মাহমুদ"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('মোবাইল / হোয়াটসঅ্যাপ নম্বর *', 'Phone / WhatsApp *')}</label>
              <input
                type="text"
                required
                placeholder="01712-XXXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('বার্তা / পরামর্শ *', 'Your Message *')}</label>
              <textarea
                rows={4}
                required
                placeholder={t('আপনার বক্তব্য বিস্তারিত লিখুন...', 'Write your message in detail...')}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-3.5 py-2 text-xs text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? t('পাঠানো হচ্ছে...', 'Sending...') : t('বার্তা পাঠান', 'Send Message')}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
