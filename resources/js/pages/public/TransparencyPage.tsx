import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Transaction, FinancialSummary, Project } from '../../types';
import { formatCurrency, formatDate, getFundTypeLabel, toBengaliNumber } from '../../utils/formatters';
import { 
  ShieldCheck, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Receipt, 
  Filter,
  CheckCircle,
  FileText
} from 'lucide-react';

interface TransparencyPageProps {
  onOpenReceipt: (trx: Transaction) => void;
  initialFinancials?: FinancialSummary | null;
  initialTransactions?: Transaction[];
  initialProjects?: Project[];
}

export const TransparencyPage: React.FC<TransparencyPageProps> = ({ onOpenReceipt, initialFinancials, initialTransactions, initialProjects }) => {
  const { lang, t } = useLanguage();
  const isBn = lang === 'bn';

  const financials = initialFinancials ?? null;
  const transactions = initialTransactions ?? [];

  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [fundFilter, setFundFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredTrxs = transactions.filter(t => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (fundFilter !== 'all' && t.fundType !== fundFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.voucherNo.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q) ||
        (t.memberName && t.memberName.toLowerCase().includes(q)) ||
        (t.donorName && t.donorName.toLowerCase().includes(q)) ||
        (t.projectName && t.projectName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{t('১০০% উন্মুক্ত ও শরিয়াহসম্মত ক্যাশ লেজার', '100% Open & Audited Central Ledger')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
          {t('আর্থিক স্বচ্ছতা ও কেন্দ্রীয় হিসাব খাতা', 'Financial Transparency & Central Ledger')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
          {t(
            'সংগঠনের সকল আয় ও ব্যয়ের প্রতিটি ভাউচার সরাসরি ডাটাবেজ থেকে স্বয়ংক্রিয়ভাবে উপস্থাপিত। কোনো অনুদান গোপন নয়, প্রতিটি ব্যয়ের রয়েছে সুনির্দিষ্ট প্রমাণ।',
            'Every transaction is directly queried from our persistent database with auditable voucher numbers and receipts.'
          )}
        </p>
      </div>

      {/* Top Financial Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Income */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 block mb-1">
              {t('সর্বমোট সংগৃহীত অনুদান/আয়', 'Total Verified Income')}
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-800">
              {formatCurrency(financials?.totalIncome, isBn)}
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block">
              {t('সাধারণ হাদিয়া, মাসিক ও প্রজেক্ট অনুদান', 'Hadiya, Monthly & Project Contributions')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Expense */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-500 block mb-1">
              {t('সর্বমোট বাস্তবায়িত ব্যয়', 'Total Verified Expenses')}
            </span>
            <div className="text-2xl font-bold font-mono text-rose-800">
              {formatCurrency(financials?.totalExpense, isBn)}
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block">
              {t('প্রকল্প ও সমাজকল্যাণ সেবায় ব্যবহৃত', 'Directly applied to community projects')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        {/* Current Available Balance */}
        <div className="p-6 rounded-2xl bg-emerald-950 text-white border border-emerald-900 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-300 block mb-1">
              {t('বর্তমান কার্যকর তহবিল স্থিতি', 'Available Central Balance')}
            </span>
            <div className="text-2xl font-bold font-mono text-white">
              {formatCurrency(financials?.currentBalance, isBn)}
            </div>
            <span className="text-[11px] text-emerald-300/80 mt-1 block">
              {t('ব্যাংক ও ক্যাশে বর্তমান মজুত তহবিল', 'Presently in Bank and Cash accounts')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-900 text-emerald-300 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Shariah Fund Separation Breakdown */}
      <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
        <h2 className="text-sm font-serif font-bold text-stone-900 uppercase tracking-wider">
          {t('ইসলামি শরিয়াহ তহবিলভিত্তিক আলাদা স্থিতি', 'Shariah-Compliant Fund Segregation Ledger')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 bg-white rounded-xl border border-stone-200">
            <span className="text-[11px] text-stone-500 block">{t('সাধারণ হাদিয়া', 'General Hadiya')}</span>
            <span className="text-base font-bold font-mono text-stone-900 mt-1 block">
              {formatCurrency(financials?.totalGeneralHadiya, isBn)}
            </span>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-stone-200">
            <span className="text-[11px] text-stone-500 block">{t('মাসিক সদস্য চাঁদা', 'Monthly Donations')}</span>
            <span className="text-base font-bold font-mono text-stone-900 mt-1 block">
              {formatCurrency(financials?.totalMonthlyDonation, isBn)}
            </span>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-stone-200">
            <span className="text-[11px] text-stone-500 block">{t('প্রকল্প অনুদান', 'Project Funds')}</span>
            <span className="text-base font-bold font-mono text-stone-900 mt-1 block">
              {formatCurrency(financials?.totalProjectDonation, isBn)}
            </span>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-stone-200">
            <span className="text-[11px] text-stone-500 block">{t('যাকাত তহবিল', 'Zakat Fund')}</span>
            <span className="text-base font-bold font-mono text-stone-900 mt-1 block">
              {formatCurrency(financials?.totalZakat, isBn)}
            </span>
          </div>
          <div className="p-3.5 bg-white rounded-xl border border-stone-200 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-stone-500 block">{t('সদকাহ তহবিল', 'Sadaqah Fund')}</span>
            <span className="text-base font-bold font-mono text-stone-900 mt-1 block">
              {formatCurrency(financials?.totalSadaqah, isBn)}
            </span>
          </div>
        </div>
      </div>

      {/* Central Transaction Ledger Section */}
      <div className="space-y-4">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Type selector */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  typeFilter === 'all' ? 'bg-white font-semibold text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t('সকল লেনদেন', 'All Transactions')}
              </button>
              <button
                onClick={() => setTypeFilter('income')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  typeFilter === 'income' ? 'bg-white font-semibold text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t('শুধুমাত্র আয় (+)', 'Income (+)')}
              </button>
              <button
                onClick={() => setTypeFilter('expense')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  typeFilter === 'expense' ? 'bg-white font-semibold text-rose-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t('শুধুমাত্র ব্যয় (-)', 'Expenses (-)')}
              </button>
            </div>

            {/* Fund Filter */}
            <select
              value={fundFilter}
              onChange={e => setFundFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none"
            >
              <option value="all">{t('সকল তহবিল শ্রেণি', 'All Fund Types')}</option>
              <option value="general_hadiya">{t('সাধারণ হাদিয়া', 'General Hadiya')}</option>
              <option value="monthly_donation">{t('মাসিক চাঁদা', 'Monthly Donation')}</option>
              <option value="project_donation">{t('প্রকল্প অনুদান', 'Project Donation')}</option>
              <option value="zakat">{t('যাকাত', 'Zakat')}</option>
              <option value="sadaqah">{t('সদকাহ', 'Sadaqah')}</option>
            </select>

          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('ভাউচার নম্বর বা বিবরণ খুঁজুন...', 'Search voucher or note...')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 font-medium">
              <tr>
                <th className="px-4 py-3">{t('ভাউচার নং', 'Voucher No')}</th>
                <th className="px-4 py-3">{t('তারিখ', 'Date')}</th>
                <th className="px-4 py-3">{t('তহবিল ও খাত', 'Fund & Category')}</th>
                <th className="px-4 py-3">{t('বিবরণ / দাতা / প্রাপক', 'Description / Entity')}</th>
                <th className="px-4 py-3">{t('প্রকল্প', 'Project')}</th>
                <th className="px-4 py-3 text-right">{t('টাকা (পরিমাণ)', 'Amount')}</th>
                <th className="px-4 py-3 text-center">{t('রসিদ', 'Receipt')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredTrxs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-stone-400">
                    {t('কোনো লেনদেন পাওয়া যায়নি।', 'No transactions found matching your criteria.')}
                  </td>
                </tr>
              ) : (
                filteredTrxs.map(trx => (
                  <tr key={trx.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-stone-900 whitespace-nowrap">
                      {trx.voucherNo}
                    </td>
                    <td className="px-4 py-3 text-stone-500 whitespace-nowrap">
                      {formatDate(trx.date, isBn)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-stone-800 block">
                        {getFundTypeLabel(trx.fundType, isBn)}
                      </span>
                      <span className="text-[11px] text-stone-500">{trx.categoryName}</span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-medium text-stone-900 truncate">
                        {trx.type === 'income' ? (
                          trx.isAnonymous 
                            ? t('গোপনীয় দানশীল ভাই (Anonymous)', 'Anonymous') 
                            : (trx.memberName || trx.donorName || t('সাধারণ শুভাকাঙ্ক্ষী', 'General Donor'))
                        ) : (
                          trx.paidTo || trx.categoryName
                        )}
                      </div>
                      {trx.description && (
                        <p className="text-[11px] text-stone-500 italic truncate">{trx.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {trx.projectName ? (
                        <span className="truncate max-w-[150px] block font-medium text-emerald-800">
                          {trx.projectName}
                        </span>
                      ) : (
                        <span className="text-stone-400">{t('সাধারণ তহবিল', 'General Fund')}</span>
                      )}
                    </td>
                    <td className={`px-4 py-3 text-right font-mono font-bold whitespace-nowrap ${
                      trx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {trx.type === 'income' ? '+' : '-'}{formatCurrency(trx.amount, isBn)}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {trx.type === 'income' ? (
                        <button
                          onClick={() => onOpenReceipt(trx)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>{t('রসিদ', 'Receipt')}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-stone-400 font-mono">ভাউচার</span>
                      )}
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
