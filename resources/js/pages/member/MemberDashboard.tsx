import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Transaction, FinancialSummary, Member } from '../../types';
import { formatCurrency, formatDate, getFundTypeLabel, toBengaliNumber } from '../../utils/formatters';
import { 
  User, 
  Heart, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Wallet, 
  Receipt, 
  ArrowUpRight, 
  Calendar,
  Globe,
  PlusCircle
} from 'lucide-react';

interface MemberDashboardProps {
  setCurrentPage: (page: string) => void;
  onOpenReceipt: (trx: Transaction) => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ setCurrentPage, onOpenReceipt }) => {
  const { lang, t } = useLanguage();
  const isBn = lang === 'bn';
  const { user, member } = useAuth();

  const [financials, setFinancials] = useState<FinancialSummary | null>(null);
  const [myTransactions, setMyTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const memberId = user?.memberId || 'MEM-002';

  useEffect(() => {
    Promise.all([
      fetch('/api/financial-summary').then(r => r.json()).catch(() => null),
      fetch(`/api/transactions?memberId=${memberId}`).then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([fin, trxs]) => {
      if (fin) setFinancials(fin);
      if (trxs && trxs.data) setMyTransactions(trxs.data);
      setLoading(false);
    });
  }, [memberId]);

  // Calculations for member
  const myTotalHadiya = myTransactions.reduce((acc, curr) => acc + (curr.type === 'income' ? curr.amount : 0), 0);
  const myProjectDonations = myTransactions
    .filter(t => t.fundType === 'project_donation' || !!t.projectId)
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Check this month's donation status
  const currentYearMonth = new Date().toISOString().slice(0, 7); // '2026-09'
  const hasPaidThisMonth = myTransactions.some(
    t => t.fundType === 'monthly_donation' && t.date.startsWith(currentYearMonth)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Member Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950 text-white border border-emerald-900 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-emerald-300 flex items-center justify-center font-serif text-2xl font-bold border border-emerald-700 shrink-0">
            {user?.name?.charAt(0) || 'ম'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-emerald-900 border border-emerald-700/60 px-2 py-0.5 rounded text-emerald-300">
                {memberId}
              </span>
              <span className="text-xs text-emerald-400 font-medium">{t('সম্মানিত সদস্য', 'Honorable Member')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white">
              {user?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300">
              <div className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{member?.country || 'প্রবাসী ভাই'} ({member?.city || 'কর্মক্ষেত্র'})</span>
              </div>
              <span aria-hidden="true">·</span>
              <span>{t('মাসিক অঙ্গীকার:', 'Pledged Monthly:')} <strong>{formatCurrency(member?.monthlyPledgeAmount || 1000, isBn)}</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('donation')}
          className="px-5 py-2.5 text-xs font-semibold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-emerald-950" />
          <span>{t('হাদিয়া / চাঁদা প্রদান করুন', 'Pay Hadiya / Donation')}</span>
        </button>
      </div>

      {/* 4 Mobile App-Style Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Card 1: My Total Hadiya */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>{t('আমার মোট হাদিয়া', 'My Total Hadiya')}</span>
            <Heart className="w-4 h-4 text-emerald-600 fill-emerald-100" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900">
            {formatCurrency(myTotalHadiya, isBn)}
          </div>
          <span className="text-[11px] text-stone-400 block">
            {t('সর্বমোট প্রদত্ত অনুদান', 'Lifetime Contribution')}
          </span>
        </div>

        {/* Card 2: This Month's Status */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>{t('এই মাসের চাঁদা স্ট্যাটাস', 'This Month Status')}</span>
            <Calendar className="w-4 h-4 text-stone-400" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            {hasPaidThisMonth ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('পরিশোধিত', 'Paid')}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>{t('পরিশোধ বাকি', 'Pending')}</span>
              </span>
            )}
          </div>
          <span className="text-[11px] text-stone-400 block pt-1">
            {t('অঙ্গীকার: ', 'Pledge: ')}{formatCurrency(member?.monthlyPledgeAmount || 1000, isBn)}
          </span>
        </div>

        {/* Card 3: Project Contributions */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>{t('প্রকল্পে মোট অবদান', 'Project Contribution')}</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900">
            {formatCurrency(myProjectDonations, isBn)}
          </div>
          <span className="text-[11px] text-stone-400 block">
            {t('সরাসরি বিভিন্ন প্রকল্পে', 'Dedicated to Projects')}
          </span>
        </div>

        {/* Card 4: Org Central Fund Status */}
        <div className="p-5 rounded-2xl bg-stone-900 text-stone-100 border border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>{t('সংগঠনের তহবিল স্থিতি', 'Org Fund Balance')}</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {formatCurrency(financials?.currentBalance, isBn)}
          </div>
          <span className="text-[11px] text-emerald-400 block">
            {t('১০০% উন্মুক্ত ও নিরীক্ষিত', 'Central Available Balance')}
          </span>
        </div>

      </div>

      {/* Recent Personal Transactions & Official Receipts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-stone-900">
            {t('আমার প্রদানকৃত হাদিয়া ও ভাউচার রসিদ', 'My Contributions & Verified Receipts')}
          </h2>
          <span className="text-xs text-stone-500">
            {toBengaliNumber(myTransactions.length)} {t('টি অনুদান রেকর্ড', 'records')}
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3 font-semibold">{t('ভাউচার নং', 'Voucher')}</th>
                <th className="px-4 py-3 font-semibold">{t('তারিখ', 'Date')}</th>
                <th className="px-4 py-3 font-semibold">{t('খাত ও বিবরণ', 'Category')}</th>
                <th className="px-4 py-3 font-semibold">{t('প্রকল্প', 'Project')}</th>
                <th className="px-4 py-3 font-semibold text-right">{t('টাকার পরিমাণ', 'Amount')}</th>
                <th className="px-4 py-3 text-center">{t('মানি রসিদ', 'Receipt')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {myTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-stone-400">
                    {t('এখনও কোনো ব্যক্তিগত অনুদানের রেকর্ড নেই।', 'No contribution records found.')}
                  </td>
                </tr>
              ) : (
                myTransactions.map(trx => (
                  <tr key={trx.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-mono font-medium text-stone-900">{trx.voucherNo}</td>
                    <td className="px-4 py-3 text-stone-500">{formatDate(trx.date, isBn)}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-stone-800 block">{getFundTypeLabel(trx.fundType, isBn)}</span>
                      <span className="text-[11px] text-stone-500">{trx.categoryName}</span>
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {trx.projectName || t('সাধারণ তহবিল', 'General Fund')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-800">
                      +{formatCurrency(trx.amount, isBn)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onOpenReceipt(trx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>{t('রসিদ প্রিন্ট', 'Print')}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
