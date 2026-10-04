import React, { useState } from 'react';
import { Clock, MapPin, PhoneCall, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { EmergencyFieldLabels } from '../data/emergencyServices';
import type { EmergencyEntry } from '../types';

interface EmergencyEntryCardProps {
  entry: EmergencyEntry;
  fieldLabels: EmergencyFieldLabels;
  fallbackIcon: React.ComponentType<{ className?: string }>;
}

export const EmergencyEntryCard: React.FC<EmergencyEntryCardProps> = ({ entry, fieldLabels, fallbackIcon: FallbackIcon }) => {
  const { t, lang } = useLanguage();
  const isBn = lang === 'bn';
  const [photoFailed, setPhotoFailed] = useState(false);

  const name = isBn ? entry.nameBn : (entry.nameEn || entry.nameBn);
  const designation = isBn ? entry.designationBn : (entry.designationEn || entry.designationBn);
  const address = [isBn ? entry.addressBn : (entry.addressEn || entry.addressBn), entry.area].filter(Boolean).join(', ');

  const details = [
    { label: fieldLabels.designation, value: designation },
    { label: fieldLabels.serviceArea, value: entry.serviceArea },
    { label: fieldLabels.availability, value: entry.availability, icon: Clock },
  ].filter(detail => detail.label && detail.value);

  return (
    <li className="rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      <div className="relative w-full h-40 bg-rose-50 border-b border-stone-100">
        {entry.photoUrl && !photoFailed ? (
          <img src={entry.photoUrl} alt={name} onError={() => setPhotoFailed(true)} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" role="img" aria-label={t(`${name} — ছবি নেই`, `${name} — no photo`)}>
            <FallbackIcon className="w-12 h-12 text-rose-300" />
          </div>
        )}
        {entry.isDemo && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            {t('নমুনা তথ্য', 'Sample data')}
          </span>
        )}
        {entry.isVerified && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-white inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" aria-hidden="true" />{t('যাচাইকৃত', 'Verified')}
          </span>
        )}
      </div>

      <div className="p-4 flex-1 space-y-2">
        <h3 className="text-sm font-bold text-stone-900">{name}</h3>
        {details.length > 0 && (
          <dl className="space-y-1 text-xs">
            {details.map(detail => (
              <div key={detail.label!.en} className="flex gap-1.5">
                <dt className="text-stone-500 shrink-0">{t(detail.label!.bn, detail.label!.en)}:</dt>
                <dd className="text-stone-800 font-medium">{detail.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {address && (
          <p className="text-xs text-stone-500 flex items-start gap-1">
            <MapPin className="w-3.5 h-3.5 mt-px shrink-0 text-stone-400" aria-hidden="true" />
            <span>{address}</span>
          </p>
        )}
      </div>

      <div className="p-4 pt-0">
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          {entry.phone ? (
            <>
              <span className="text-xs font-mono font-semibold text-stone-700">{entry.phone}</span>
              <a
                href={`tel:${entry.phone}`}
                aria-label={t(`${name} — কল করুন ${entry.phone}`, `Call ${name} at ${entry.phone}`)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t('কল করুন', 'Call')}</span>
              </a>
            </>
          ) : (
            <span className="text-xs text-stone-400">{t('যাচাইকৃত নম্বর এখনো যুক্ত হয়নি', 'Verified number not added yet')}</span>
          )}
        </div>
      </div>
    </li>
  );
};
