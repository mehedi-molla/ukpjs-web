import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { WebsiteSettings } from '../../types';
import { ShieldCheck, Heart, Users, CheckCircle, MapPin, Compass } from 'lucide-react';

export const AboutPage: React.FC<{ setCurrentPage: (page: string) => void }> = ({ setCurrentPage }) => {
  const { lang, t } = useLanguage();
  const isBn = lang === 'bn';
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 pb-8 border-b border-stone-200">
        <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">
          {t('পরিচিতি ও লক্ষ্য', 'About & Objectives')}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight">
          {t('উমারখালী কিস্তুপুর প্রবাসী যুব সংঘ', 'Umarkhali Kistupur Probashi Jubo Songho')}
        </h1>
        <p className="text-sm sm:text-base font-serif text-emerald-800 font-medium">
          {t('মানবতার সেবায়, সমাজের কল্যাণে', 'In the Service of Humanity, for the Welfare of Society')}
        </p>
      </div>

      {/* Main Narrative & History */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Core story */}
        <div className="md:col-span-2 space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-stone-900">
              {t('সংগঠন কীভাবে শুরু হয়েছিল?', 'How Did The Organization Start?')}
            </h2>
            <p>
              {settings?.aboutHistoryBn || t(
                'প্রবাসে কর্মরত উমারখালী ও কিস্তুপুর গ্রামের তরুণ ও যুবকদের অন্তরে এলাকার অসহায় মানুষদের দুঃখ-কষ্ট লাঘব করার তীব্র তাগিদ থেকে এই সংগঠনের সূচনা। ২০২৪ সালে পবিত্র মসজিদে মিলাদ ও দোয়ার মধ্য দিয়ে সংগঠনের শুভ উদ্বোধন করা হয়। এরপর থেকে সদস্যদের নিয়মিত মাসিক হাদিয়া ও অনুদানের মাধ্যমে ফলের গাছ রোপণ, মসজিদে খেদমত, সৌর সড়কবাতি স্থাপন এবং অসহায় মানুষের চিকিৎসায় আমরা নিরলস কাজ করে যাচ্ছি।',
                'Founded by expatriates of Umarkhali and Kistupur driven by brotherhood and empathy. Inaugurated at the village mosque through a Milad and Dua congregation in 2024.'
              )}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-stone-900">
              {t('ইসলামি শরিয়াহর নীতিমালা ও মূল্যবোধ', 'Islamic Shariah Principles & Core Values')}
            </h2>
            <p>
              {t(
                'আমাদের প্রতিটি সেবামূলক কার্যক্রম পবিত্র কুরআন ও সুন্নাহর নির্দেশিত শরিয়াহ নীতিমালা অনুসরণ করে পরিচালিত হয়। আমরা সাধারণ হাদিয়া, সদকা এবং যাকাত তহবিলকে কখনোই মিশ্রিত করি না। যাকাতের অর্থ কেবল শরিয়াহ নির্দেশিত আটটি খাতের হকদার ব্যক্তি ও পরিবারগুলোর সরাসরি কল্যাণে ও চিকিৎসা ব্যয়ে ব্যয় করা হয়।',
                'All activities adhere strictly to Quranic and Sunnah welfare standards. Zakat, Sadaqah, and General Hadiya funds are preserved in discrete, transparent channels.'
              )}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-stone-900">
              {t('স্বচ্ছতা ও জবাবদিহিতা', 'Transparency & Auditing')}
            </h2>
            <p>
              {t(
                'সংগঠনে সংগৃহীত প্রতিটি অনুদানের ডিজিটাল রসিদ ও কেন্দ্রীয় ট্রানজেকশন ভাউচার তৈরি হয়। প্রতি মাসের আয়-ব্যয়ের হিসাব ওয়েবসাইটে উন্মুক্ত রাখা হয় যাতে প্রতিটি সদস্য ও শুভাকাঙ্ক্ষী নিশ্চিন্তে অবদান রাখতে পারেন।',
                'Every contribution produces an auditable money receipt and central voucher. Monthly ledgers are public for complete stakeholder peace of mind.'
              )}
            </p>
          </section>
        </div>

        {/* Right Column: Mission & Vision Cards */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Compass className="w-5 h-5 text-emerald-700" />
              <span>{t('আমাদের লক্ষ্য (Mission)', 'Our Mission')}</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {settings?.missionBn || t('এলাকার অসহায়, দরিদ্র ও দুস্থ মানুষের পাশে দাঁড়ানো, গ্রামীণ অবকাঠামো উন্নয়ন এবং সামাজিক সম্প্রীতি বৃদ্ধি করা।', 'Uplifting rural poor, developing infrastructure, and nurturing community solidarity.')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900 text-stone-100 border border-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{t('আমাদের স্বপ্ন (Vision)', 'Our Vision')}</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {settings?.visionBn || t('উমারখালী ও কিস্তুপুর এলাকাকে একটি দারিদ্র্যমুক্ত, আলোকোজ্জ্বল ও শান্তিপূর্ণ আদর্শ জনপদ হিসেবে গড়ে তোলা।', 'Establishing an illuminated, poverty-free, and cohesive model village.')}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              {t('কার্যনির্বাহী নেতৃত্ব', 'Leadership')}
            </span>
            <p className="text-xs text-stone-600">
              {t('সংগঠন পরিচালিত হয় প্রবাস ও স্থানীয় সমন্বয়ে গঠিত দক্ষ কার্যকরী কমিটির তত্ত্বাবধানে।', 'Governed by a joint executive council of diaspora coordinators and resident youth volunteers.')}
            </p>
            <button
              onClick={() => setCurrentPage('committee')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 pt-2 block cursor-pointer"
            >
              {t('কমিটির বিস্তারিত দেখুন →', 'View Executive Committee →')}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
