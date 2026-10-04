import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Mail, Heart, Shield, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 pb-20 sm:pb-8 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          
          {/* Col 1: About Organization */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-white tracking-tight">
              উমারখালী কিস্তুপুর প্রবাসী যুব সংঘ
            </h3>
            <p className="text-xs text-emerald-400 font-medium">
              {t('মানবতার সেবায়, সমাজের কল্যাণে', 'In the Service of Humanity, for the Welfare of Society')}
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              {t(
                'ইসলামি শরিয়াহর আলোকে এলাকার অসহায় ও দরিদ্র মানুষের সহযোগিতা, গ্রামীণ উন্নয়ন, মসজিদ সেবা, স্ট্রিট লাইট স্থাপন ও জনকল্যাণে প্রবাসী ও স্থানীয়দের ঐকবদ্ধ প্রচেষ্টা।',
                'A dedicated welfare community driven by diaspora youth and village volunteers to uplift our native rural area according to Islamic principles.'
              )}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
              <Shield className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{t('১০০% স্বচ্ছ ও নিয়মিত নিরীক্ষিত তহবিল', '100% Transparent Audited Fund')}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-3">
              {t('প্রয়োজনীয় লিংক', 'Quick Navigation')}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => setCurrentPage('projects')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('আমাদের সকল প্রকল্প (All Projects)', 'All Projects')}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('emergency')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('জরুরি যোগাযোগ ও অ্যাম্বুলেন্স ডিরেক্টরি', 'Emergency Contacts & Ambulance')}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('blood-donors')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('রক্তদাতা তালিকা (Blood Donors)', 'Blood Donors Directory')}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  {t('যোগাযোগ ও তথ্য (Contact & Location)', 'Contact & Location')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Shariah Funds & Accounts */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-3">
              {t('তহবিল ও অনুদান মাধ্যম', 'Funds & Contributions')}
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                <span className="text-[11px] font-semibold text-emerald-400 block">{t('বিকাশ ও নগদ (ব্যক্তিগত)', 'bKash & Nagad (Personal)')}</span>
                <span className="font-mono text-stone-200 font-bold">01712-345678</span>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                <span className="text-[11px] font-semibold text-emerald-400 block">{t('ইসলামী ব্যাংক বাংলাদেশ লিঃ', 'Islami Bank Bangladesh Ltd')}</span>
                <span className="font-mono text-stone-200">A/C: 2050XXXXXXXXXXXX</span>
              </div>
              <p className="text-[11px] text-stone-500">
                {t('যাকাত, সদকা ও হাদিয়া আলাদা তহবিলে সংরক্ষণ করা হয়।', 'Zakat, Sadaqah, and Hadiya funds are maintained distinctly.')}
              </p>
            </div>
          </div>

          {/* Col 4: Contact & Location */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-3">
              {t('যোগাযোগের ঠিকানা', 'Contact Information')}
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  {t(
                    'উমারখালী কিস্তুপুর, ডাকঘর: কিস্তুপুর, জেলা: কুষ্টিয়া, বাংলাদেশ',
                    'Umarkhali Kistupur, Kushtia, Bangladesh'
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-mono">+880 1712-345678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-mono">ukpjs.welfare@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>
            © {new Date().getFullYear()} {t('উমারখালী কিস্তুপুর প্রবাসী যুব সংঘ। সর্বস্বত্ব সংরক্ষিত।', 'Umarkhali Kistupur Probashi Jubo Songho. All rights reserved.')}
          </p>
          <div className="flex items-center gap-2 text-stone-400">
            <span>{t('মানবতার তরে একতাবদ্ধ পথচলা', 'United for the service of humanity')}</span>
            <span aria-hidden="true">·</span>
            <span>{t('স্বেচ্ছাসেবী অরাজনৈতিক সংগঠন', 'Non-profit Welfare Organization')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
