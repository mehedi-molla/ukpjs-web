import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Notice } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Bell, Pin, Calendar, Tag, FileText } from 'lucide-react';

export const NoticesPage: React.FC<{ initialNotices?: Notice[] }> = ({ initialNotices }) => {
  const { lang, t } = useLanguage();
  const isBn = lang === 'bn';

  const [notices] = useState<Notice[]>(initialNotices ?? []);
  const loading = false;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold mb-2">
          <Bell className="w-4 h-4 text-emerald-600" />
          <span>{t('অফিসিয়াল বিজ্ঞপ্তি ও নোটিশ বোর্ড', 'Official Announcements & Notice Board')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
          {t('জরুরি বিজ্ঞপ্তি ও সিদ্ধান্তসমূহ', 'Notice Board & Meeting Minutes')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          {t(
            'সংগঠনের মাসিক মিটিং, নতুন প্রকল্প অনুমোদন, সাধারণ সভা এবং জরুরি সিদ্ধান্তসমূহের অফিসিয়াল প্রকাশনা।',
            'Stay updated with monthly meetings, project approvals, and official announcements from the executive committee.'
          )}
        </p>
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-400">
          {t('বিজ্ঞপ্তি লোড হচ্ছে...', 'Loading notices...')}
        </div>
      ) : notices.length === 0 ? (
        <div className="py-16 text-center bg-stone-50 rounded-2xl border border-stone-200">
          <p className="text-sm text-stone-500">{t('বর্তমানে কোনো নোটিশ নেই।', 'No notices posted currently.')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {notices.map(notice => (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm transition-all space-y-4 ${
                notice.isPinned ? 'border-emerald-300 ring-2 ring-emerald-50' : 'border-stone-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {notice.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      <Pin className="w-3 h-3 fill-emerald-800" />
                      <span>{t('গুরুত্বপূর্ণ নোটিশ', 'Pinned Notice')}</span>
                    </span>
                  )}
                  <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                    {notice.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>{formatDate(notice.date, isBn)}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                  {isBn ? notice.titleBn : notice.titleEn}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                  {isBn ? notice.contentBn : notice.contentEn}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>{t('কর্তৃপক্ষ:', 'Authority:')} <strong>{notice.publishedBy}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
