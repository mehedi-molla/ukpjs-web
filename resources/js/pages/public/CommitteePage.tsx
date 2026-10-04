import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Member } from '../../types';
import { ShieldCheck, MapPin, Phone, Mail, Award, Globe, User } from 'lucide-react';

export const CommitteePage: React.FC<{ initialMembers?: Member[] }> = ({ initialMembers }) => {
  const { lang, t } = useLanguage();
  const isBn = lang === 'bn';

  const [members] = useState<Member[]>(initialMembers ?? []);
  const loading = false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 pb-6 border-b border-stone-200">
        <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">
          {t('কার্যনির্বাহী পরিষদ ও কমিটি', 'Executive Council & Leadership')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
          {t('উমারখালী কিস্তুপুর প্রবাসী যুব সংঘের কমিটি', 'Executive Committee & Dedicated Members')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto">
          {t(
            'প্রবাসে কর্মরত ও স্থানীয় তরুণদের সমন্বয়ে গঠিত এই নিবেদিত দল নিঃস্বার্থভাবে এলাকার উন্নয়ন ও দরিদ্র মানুষের কল্যাণে কাজ করে যাচ্ছে।',
            'Our executive leadership seamlessly combines expatriate coordinators with local resident youth leaders.'
          )}
        </p>
      </div>

      {/* Advisory & Leadership Note */}
      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-emerald-950 text-base">
              {t('স্বেচ্ছাসেবী ও অরাজনৈতিক নেতৃত্ব', 'Honorary & Non-Political Leadership')}
            </h3>
            <p className="text-xs text-emerald-800">
              {t('সংগঠনের সকল পদ মর্যাদাপূর্ণ ও সম্পূর্ণ স্বেচ্ছাসেবী। কোনো ব্যক্তি সংগঠন থেকে কোনো আর্থিক সুবিধা গ্রহণ করে না।', 'All committee roles are strictly honorary; zero administrative allowances or personal benefits.')}
            </p>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-400">
          {t('কমিটির তথ্য লোড হচ্ছে...', 'Loading committee...')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 font-serif font-bold text-lg overflow-hidden">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.nameBn} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-7 h-7 text-stone-400" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {member.memberId}
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-xs font-semibold text-emerald-700 block">
                    {isBn ? member.designationBn : member.designationEn}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-stone-900 mt-0.5">
                    {isBn ? member.nameBn : member.nameEn}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>
                        {t('বর্তমান অবস্থান: ', 'Location: ')}
                        <strong className="text-stone-800">{member.country}</strong> ({member.city})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{t('গ্রাম: ', 'Village: ')}{member.village}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="font-mono">{member.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">{t('যোগদান:', 'Joined:')} {member.joiningDate}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-700">
                  {member.role === 'admin' ? t('কার্যনির্বাহী', 'Executive') : t('সদস্য', 'Member')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
