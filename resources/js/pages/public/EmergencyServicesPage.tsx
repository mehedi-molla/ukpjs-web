import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { EmergencyServiceCard } from '../../components/EmergencyServiceCard';
import type { EmergencyService } from '../../types';

export const EmergencyServicesPage: React.FC<{ services: EmergencyService[] }> = ({ services }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">

      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-800 rounded-full text-xs font-semibold mb-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" aria-hidden="true" />
          <span>{t('জরুরি সেবা', 'Emergency Services')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
          {t('সকল জরুরি সেবা', 'All Emergency Services')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
          {t('একটি সেবা বেছে নিন — সংশ্লিষ্ট সকল যোগাযোগ দেখতে পাবেন।', 'Choose a service to see every contact in that category.')}
        </p>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {services.map(service => (
          <EmergencyServiceCard key={service.id} service={service} />
        ))}
      </ul>
    </div>
  );
};
