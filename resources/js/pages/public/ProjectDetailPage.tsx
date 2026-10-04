import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Project, Transaction } from '../../types';
import { formatCurrency, formatDate, toBengaliNumber } from '../../utils/formatters';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  HeartHandshake, 
  Receipt, 
  Clock, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface ProjectDetailPageProps {
  projectSlug: string;
  setCurrentPage: (page: string) => void;
  onOpenReceipt?: (trx: Transaction) => void;
  initialData?: Project & { transactions?: Transaction[] };
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  projectSlug,
  setCurrentPage,
  onOpenReceipt,
  initialData,
}) => {
  const { lang, t } = useLanguage();
  const isBn = lang === 'bn';

  const [project] = useState<Project & { transactions?: Transaction[] } | null>(initialData ?? null);
  const loading = false;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-stone-400">
        {t('প্রকল্প লোড হচ্ছে...', 'Loading project details...')}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-base text-stone-600">{t('প্রকল্প খুঁজে পাওয়া যায়নি।', 'Project not found.')}</p>
        <button
          onClick={() => setCurrentPage('projects')}
          className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-lg cursor-pointer"
        >
          {t('সকল প্রকল্পে ফিরে যান', 'Back to Projects')}
        </button>
      </div>
    );
  }

  const collected = project.collectedAmount || 0;
  const spent = project.expenseAmount || 0;
  const budget = project.estimatedBudget || 1;
  const percent = Math.min(100, Math.round((collected / budget) * 100));

  const incomeTrxs = (project.transactions || []).filter(t => t.type === 'income');
  const expenseTrxs = (project.transactions || []).filter(t => t.type === 'expense');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Back Button */}
      <button
        onClick={() => setCurrentPage('projects')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('সকল প্রকল্পে ফিরে যান', 'Back to All Projects')}</span>
      </button>

      {/* Main Header & Image */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
            <span className="font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              {project.code}
            </span>
            <span aria-hidden="true">·</span>
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold text-white ${
              project.status === 'completed' ? 'bg-emerald-800' : 'bg-amber-800'
            }`}>
              {project.status === 'completed' ? t('সম্পন্ন প্রকল্প', 'Completed') : t('চলমান প্রকল্প', 'Active')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
            {isBn ? project.titleBn : project.titleEn}
          </h1>
          {project.isDemo && <p className="text-xs font-semibold text-amber-700">This imported prototype record is for demonstration only and is excluded from official financial totals.</p>}

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('শুরু:', 'Started:')} {formatDate(project.startDate, isBn)}</span>
            </div>
            {project.actualEndDate && (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('সম্পন্ন:', 'Completed:')} {formatDate(project.actualEndDate, isBn)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-stone-100 shadow-md">
          <img
            src={project.featuredImage}
            alt={project.titleBn}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Financial Statistics & Progress Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 text-stone-100 border border-stone-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              {t('প্রকল্পের আর্থিক হিসাব', 'Project Financial Overview')}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              {t('স্বচ্ছতা ও তহবিল হিসাব', 'Fund Status & Audit Summary')}
            </h2>
          </div>
          {project.status === 'running' && !project.isDemo && (
            <button
              onClick={() => setCurrentPage('donation')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer shadow-md self-start sm:self-auto"
            >
              {t('এই প্রকল্পে অনুদান দিন', 'Contribute to this Project')}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-stone-800/80 rounded-2xl border border-stone-700/50">
            <span className="text-[11px] text-stone-400 block">{t('প্রকল্প বাজেট', 'Budget')}</span>
            <span className="text-base sm:text-lg font-bold font-mono text-white">
              {formatCurrency(project.estimatedBudget, isBn)}
            </span>
          </div>

          <div className="p-4 bg-stone-800/80 rounded-2xl border border-stone-700/50">
            <span className="text-[11px] text-stone-400 block">{t('সংগৃহীত অনুদান', 'Collected')}</span>
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-400">
              {formatCurrency(collected, isBn)}
            </span>
          </div>

          <div className="p-4 bg-stone-800/80 rounded-2xl border border-stone-700/50">
            <span className="text-[11px] text-stone-400 block">{t('মোট ব্যয়িত অর্থ', 'Total Spent')}</span>
            <span className="text-base sm:text-lg font-bold font-mono text-rose-400">
              {formatCurrency(spent, isBn)}
            </span>
          </div>

          <div className="p-4 bg-stone-800/80 rounded-2xl border border-stone-700/50">
            <span className="text-[11px] text-stone-400 block">{t('অবশিষ্ট তহবিল স্থিতি', 'Remaining Fund')}</span>
            <span className="text-base sm:text-lg font-bold font-mono text-white">
              {formatCurrency(collected - spent, isBn)}
            </span>
          </div>
        </div>

        {project.status === 'running' && (
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <div className="flex justify-between text-xs text-stone-300">
              <span>{t('তহবিল সংগ্রহের অগ্রগতি', 'Fundraising Progress')}</span>
              <span className="font-mono font-bold text-emerald-400">{toBengaliNumber(percent)}%</span>
            </div>
            <div className="w-full bg-stone-800 rounded-full h-2.5 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${percent}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Full Description & Beneficiary Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Prose */}
        <div className="lg:col-span-2 space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base">
          <section className="space-y-3">
            <h3 className="text-xl font-serif font-bold text-stone-900">
              {t('প্রকল্পের বিস্তারিত পটভূমি', 'Detailed Background & Purpose')}
            </h3>
            <p className="whitespace-pre-line">
              {isBn ? project.fullDescBn : project.fullDescEn}
            </p>
          </section>

          {project.completionOutcomeBn && (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>{t('বাস্তবায়ন ও ফলাফল (Outcome)', 'Project Outcome')}</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700">
                {isBn ? project.completionOutcomeBn : project.completionOutcomeEn}
              </p>
            </div>
          )}

          {/* Gallery if present */}
          {project.galleryImages && project.galleryImages.length > 1 && (
            <section className="space-y-3 pt-4">
              <h3 className="text-lg font-serif font-bold text-stone-900">
                {t('প্রকল্পের স্থিরচিত্র ও কাজ', 'Project Photos')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {project.galleryImages.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-stone-100">
                    <img src={img} alt="Gallery" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 text-xs">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
              {t('প্রকল্পের তথ্য সংক্ষেপ', 'Project Metadata')}
            </h4>

            <div>
              <span className="text-stone-500 block">{t('উপকারভোগী সংখ্যা:', 'Beneficiaries:')}</span>
              <span className="font-semibold text-stone-900 text-sm">
                {toBengaliNumber(project.beneficiariesCount || 0)} {t('জন / পরিবার', 'People / Families')}
              </span>
              <p className="text-stone-500 text-[11px] mt-0.5">
                {isBn ? project.beneficiaryInfoBn : project.beneficiaryInfoEn}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-200">
              <span className="text-stone-500 block">{t('দায়িত্বশীল সদস্যবৃন্দ:', 'Responsible Members:')}</span>
              <span className="font-medium text-stone-800">
                {project.responsibleMembers?.join(', ') || t('কার্যকরী পরিষদ', 'Executive Committee')}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Linked Transactions Table */}
      {project.transactions && project.transactions.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              {t('প্রকল্পের লেনদেন ও অনুদান তালিকা', 'Project Transactions & Contributions')}
            </h3>
            <span className="text-xs text-stone-500">
              {toBengaliNumber(project.transactions.length)} {t('টি লেনদেন রেকর্ড', 'records')}
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t('ভাউচার নম্বর', 'Voucher')}</th>
                  <th className="px-4 py-3 font-semibold">{t('তারিখ', 'Date')}</th>
                  <th className="px-4 py-3 font-semibold">{t('বিবরণ / দাতা', 'Description / Donor')}</th>
                  <th className="px-4 py-3 font-semibold">{t('ধরন', 'Type')}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t('টাকা', 'Amount')}</th>
                  <th className="px-4 py-3 text-center">{t('রসিদ', 'Receipt')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {project.transactions.map(trx => (
                  <tr key={trx.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-mono font-medium text-stone-900">{trx.voucherNo}</td>
                    <td className="px-4 py-3 text-stone-500">{formatDate(trx.date, isBn)}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-stone-800">
                        {trx.type === 'income' 
                          ? (trx.isAnonymous ? t('গোপনীয় দানশীল ভাই', 'Anonymous') : (trx.memberName || trx.donorName || trx.categoryName))
                          : (trx.paidTo || trx.categoryName)}
                      </span>
                      {trx.description && <p className="text-[11px] text-stone-400 italic truncate max-w-xs">{trx.description}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        trx.type === 'income' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                      }`}>
                        {trx.type === 'income' ? t('আয়', 'Income') : t('ব্যয়', 'Expense')}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-mono font-bold ${
                      trx.type === 'income' ? 'text-emerald-800' : 'text-rose-800'
                    }`}>
                      {trx.type === 'income' ? '+' : '-'}{formatCurrency(trx.amount, isBn)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {trx.type === 'income' && onOpenReceipt && (
                        <button
                          onClick={() => onOpenReceipt(trx)}
                          className="p-1 text-emerald-700 hover:text-emerald-900 rounded cursor-pointer"
                          title="View Receipt"
                        >
                          <Receipt className="w-4 h-4 mx-auto" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

    </div>
  );
};
