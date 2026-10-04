import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { EmergencyEntryCard } from '../../components/EmergencyEntryCard';
import { defaultEmergencyFieldLabels, emergencyFieldLabels, emergencyServiceIcon } from '../../data/emergencyServices';
import type { EmergencyEntry, EmergencyService } from '../../types';

interface EmergencyServiceCategoryPageProps {
  service: EmergencyService;
  entries: EmergencyEntry[];
}

export const EmergencyServiceCategoryPage: React.FC<EmergencyServiceCategoryPageProps> = ({ service, entries }) => {
  const { t } = useLanguage();
  const Icon = emergencyServiceIcon(service.icon);
  const fieldLabels = emergencyFieldLabels[service.slug] ?? defaultEmergencyFieldLabels;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      <Link href="/emergency" className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>{t('সকল জরুরি সেবা', 'All Emergency Services')}</span>
      </Link>

      {/* Header */}
      <div className="pb-6 border-b border-stone-200 flex items-center gap-4">
        <div className="w-14 h-14 shrink-0 rounded-2xl bg-rose-100 flex items-center justify-center" aria-hidden="true">
          <Icon className="w-6 h-6 text-rose-700" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {t(service.nameBn, service.nameEn || service.nameBn)}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            {t(service.descriptionBn, service.descriptionEn || service.descriptionBn)}
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="py-16 text-center bg-stone-50 rounded-2xl border border-stone-200">
          <p className="text-sm text-stone-500">{t('এখনো কোনো তথ্য যুক্ত হয়নি।', 'No entries yet.')}</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {entries.map(entry => (
            <EmergencyEntryCard key={entry.id} entry={entry} fieldLabels={fieldLabels} fallbackIcon={Icon} />
          ))}
        </ul>
      )}
    </div>
  );
};
