import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { FinancialSummary, Project, WelfareRequest, AuditLog } from '../../types';
import { formatCurrency, formatDate, toBengaliNumber } from '../../utils/formatters';
import { 
  PlusCircle, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Layers, 
  Users, 
  PhoneCall, 
  FileText, 
  Settings, 
  ShieldCheck, 
  HeartHandshake, 
  Clock, 
  ChevronRight,
  Database
} from 'lucide-react';

interface AdminDashboardProps {
  setCurrentPage: (page: string) => void;
  onOpenQuickTransaction: () => void;
  initialData?: {
    financials: FinancialSummary;
    projects: Project[];
    welfareRequests: WelfareRequest[];
    logs: AuditLog[];
  };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  setCurrentPage,
  onOpenQuickTransaction,
  initialData,
}) => {
  const { lang, t } = useLanguage();
  const isBn = lang === 'bn';

  const financials = initialData?.financials ?? null;
  const projects = initialData?.projects ?? [];
  const welfareRequests = initialData?.welfareRequests ?? [];
  const logs = initialData?.logs ?? [];

  const pendingWelfare = welfareRequests.filter(w => w.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Admin Header with Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{t('সুপার এডমিন নিয়ন্ত্রণ প্যানেল', 'Super Admin Control Center')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            {t('কেন্দ্রীয় পরিচালনা ও হিসাব ড্যাশবোর্ড', 'Central Governance & Financial Overview')}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenQuickTransaction}
            className="px-5 py-2.5 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-950" />
            <span>{t('+ দ্রুত লেনদেন এন্ট্রি', '+ Quick Entry')}</span>
          </button>
          <button
            onClick={() => setCurrentPage('admin-transactions')}
            className="px-4 py-2.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-colors cursor-pointer"
          >
            {t('কেন্দ্রীয় লেজার', 'Central Ledger')}
          </button>
        </div>
      </div>

      {/* Primary Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>{t('মোট সংগৃহীত অনুদান', 'Total Verified Income')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-800">
            {formatCurrency(financials?.totalIncome, isBn)}
          </div>
          <span className="text-[11px] text-stone-400 block">{t('১০০% ভাউচার অন্তর্ভুক্ত', 'All verified receipts')}</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>{t('মোট বাস্তবায়িত ব্যয়', 'Total Verified Expenses')}</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-rose-800">
            {formatCurrency(financials?.totalExpense, isBn)}
          </div>
          <span className="text-[11px] text-stone-400 block">{t('সকল প্রকল্প ও খরচ', 'All project disbursements')}</span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-950 text-white border border-emerald-900 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>{t('বর্তমান নেট তহবিল স্থিতি', 'Current Central Balance')}</span>
            <Wallet className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {formatCurrency(financials?.currentBalance, isBn)}
          </div>
          <span className="text-[11px] text-emerald-300/80 block">{t('হাতে মজুত ও ব্যাংক স্থিতি', 'Bank & Cash Balance')}</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>{t('পেন্ডিং সাহায্য আবেদন', 'Pending Help Requests')}</span>
            <HeartHandshake className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-700">
            {toBengaliNumber(pendingWelfare.length)}
          </div>
          <button
            onClick={() => setCurrentPage('admin-welfare')}
            className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold block text-left"
          >
            {t('যাচাই ও অনুমোদন করুন →', 'Review & Approve →')}
          </button>
        </div>

      </div>

      {/* Admin Modules Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-stone-900">
          {t('পরিচালনা মডিউলসমূহ', 'Governance & Operational Modules')}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <button
            onClick={() => setCurrentPage('admin-transactions')}
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800">
              {t('লেনদেন ও ক্যাশ লেজার', 'Ledger & Transactions')}
            </h3>
            <p className="text-[11px] text-stone-500 leading-tight">
              {t('সকল আয়-ব্যয় এন্ট্রি, বাতিলকরণ ও রসিদ মুদ্রণ', 'Manage all records, cancellations & receipts')}
            </p>
          </button>

          <button
            onClick={() => setCurrentPage('admin-projects')}
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-blue-800">
              {t('প্রকল্প ব্যবস্থাপনা', 'Projects Manager')}
            </h3>
            <p className="text-[11px] text-stone-500 leading-tight">
              {t('নতুন প্রকল্প তৈরি, বাজেট ও অগ্রগতি আপডেট', 'Add/edit projects, progress & budgets')}
            </p>
          </button>

          <button
            onClick={() => setCurrentPage('admin-monthly')}
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center group-hover:bg-purple-700 group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-purple-800">
              {t('মাসিক চাঁদা গ্রিড', 'Monthly Donation Matrix')}
            </h3>
            <p className="text-[11px] text-stone-500 leading-tight">
              {t('কোন সদস্যের কোন মাসের চাঁদা বাকি বা পরিশোধিত', 'Member-wise year/month payment grid')}
            </p>
          </button>

          <button
            onClick={() => setCurrentPage('admin-members')}
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center group-hover:bg-stone-800 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-stone-800">
              {t('সদস্য তালিকা ও অঙ্গীকার', 'Members & Pledges')}
            </h3>
            <p className="text-[11px] text-stone-500 leading-tight">
              {t('সদস্য তথ্য, দেশ, পদবী ও মাসিক অঙ্গীকার', 'Profiles, country, designation & pledges')}
            </p>
          </button>

          <button
            onClick={() => setCurrentPage('admin-contacts')}
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-rose-300 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center group-hover:bg-rose-700 group-hover:text-white transition-colors">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-rose-800">
              {t('জরুরি ফোন ডিরেক্টরি', 'Emergency Contacts')}
            </h3>
            <p className="text-[11px] text-stone-500 leading-tight">
              {t('অ্যাম্বুলেন্স, মাইক্রোবাস ড্রাইভার ও ডাক্তার', 'Ambulance, drivers & physicians')}
            </p>
          </button>

          <button
            onClick={() => setCurrentPage('admin-welfare')}
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-amber-300 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:bg-amber-700 group-hover:text-white transition-colors">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-amber-800">
              {t('সাহায্যের আবেদনসমূহ', 'Welfare Applications')}
            </h3>
            <p className="text-[11px] text-stone-500 leading-tight">
              {t('অসহায় পরিবারের চিকিৎসা ও অনুদান অনুমোদন', 'Review, approve & disburse grants')}
            </p>
          </button>

          <button
            onClick={() => setCurrentPage('admin-reports')}
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800">
              {t('রিপোর্ট ও নিরীক্ষা অডিট', 'Audit & Reports')}
            </h3>
            <p className="text-[11px] text-stone-500 leading-tight">
              {t('তারিখভিত্তিক আয়-ব্যয় রিপোর্ট ও CSV ডাউনলোড', 'Date-range reports & CSV exports')}
            </p>
          </button>

          <button
            onClick={() => setCurrentPage('admin-settings')}
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-stone-400 hover:shadow-md transition-all text-left space-y-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-800 group-hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 group-hover:text-stone-800">
              {t('সংগঠন সেটিংস ও একাউন্ট', 'Org Settings & Accounts')}
            </h3>
            <p className="text-[11px] text-stone-500 leading-tight">
              {t('বিকাশ, নগদ, ব্যাংক ও পরিচিতি তথ্য সম্পাদনা', 'bKash, Nagad, bank & contact details')}
            </p>
          </button>

        </div>
      </div>

      {/* Recent Audit Activity Log */}
      <div className="space-y-3">
        <h2 className="text-base font-serif font-bold text-stone-900">
          {t('সাম্প্রতিক অডিট ও সিস্টেম লগ', 'Recent System & Financial Audit Logs')}
        </h2>
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 divide-y divide-stone-200 text-xs">
          {logs.length === 0 ? (
            <p className="text-stone-400 py-3 text-center">{t('কোনো সাম্প্রতিক লগ নেই।', 'No recent logs.')}</p>
          ) : (
            logs.map(log => (
              <div key={log.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-800">{log.action}: </span>
                  <span className="text-stone-600">{log.entityType} ({log.entityId})</span>
                  <span className="text-stone-400 ml-2 font-mono text-[10px]">{log.userEmail}</span>
                </div>
                <span className="text-stone-400 font-mono text-[11px]">{formatDate(log.timestamp, isBn)}</span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
