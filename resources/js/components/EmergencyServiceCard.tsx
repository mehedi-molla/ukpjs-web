import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { emergencyServiceIcon } from '../data/emergencyServices';
import type { EmergencyService } from '../types';

interface EmergencyServiceCardProps {
  service: EmergencyService;
}

export const EmergencyServiceCard: React.FC<EmergencyServiceCardProps> = ({ service }) => {
  const { t } = useLanguage();
  const Icon = emergencyServiceIcon(service.icon);

  return (
    <li>
      <Link
        href={service.url}
        className="group h-full rounded-2xl border border-stone-200 bg-stone-50 p-4 flex items-center gap-3 hover:shadow-md hover:border-rose-300 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
      >
        <div className="w-12 h-12 shrink-0 rounded-xl bg-rose-100 flex items-center justify-center" aria-hidden="true">
          <Icon className="w-5 h-5 text-rose-700" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm text-stone-900">{t(service.nameBn, service.nameEn || service.nameBn)}</h3>
          <p className="text-xs text-stone-500 leading-snug">{t(service.descriptionBn, service.descriptionEn || service.descriptionBn)}</p>
        </div>
        <ChevronRight className="w-4 h-4 shrink-0 text-stone-400 group-hover:text-rose-700 transition-colors" aria-hidden="true" />
      </Link>
    </li>
  );
};
