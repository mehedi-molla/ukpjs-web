import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FinancialSummary, Transaction } from '../../types';
import { formatCurrency, formatDate, getFundTypeLabel } from '../../utils/formatters';
import { Printer, Download, Calendar, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { lang, t } = useLanguage();
  const isBn = lang === 'bn';

  const [financials, setFinancials] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    Promise.all([
      fetch('/api/financial-summary').then(r => r.json()),
      fetch('/api/transactions?limit=500').then(r => r.json()),
    ]).then(([fin, trxs]) => {
      if (fin) setFinancials(fin);
      if (trxs && trxs.data) setTransactions(trxs.data);
    });
  }, []);

  const filtered = transactions.filter(t => t.date >= startDate && t.date <= endDate);
  const periodIncome = filtered.filter(t => t.type === 'income').reduce((acc, c) => acc + c.amount, 0);
  const periodExpense = filtered.filter(t => t.type === 'expense').reduce((acc, c) => acc + c.amount, 0);
  const periodNet = periodIncome - periodExpense;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header (Hidden in Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            {t('আর্থিক প্রতিবেদন ও নিরীক্ষা স্টেটমেন্ট', 'Financial Audit Report Generator')}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {t('নির্দিষ্ট সময়কালের আয়, ব্যয় ও শরিয়াহ তহবিল নিরীক্ষা রিপোর্ট প্রস্তুত ও মুদ্রণ করুন।', 'Generate custom date-range financial statements for committee meetings.')}
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>{t('রিপোর্ট প্রিন্ট করুন', 'Print Statement')}</span>
        </button>
      </div>

      {/* Date Range Selector (Hidden in Print) */}
      <div className="print:hidden p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-stone-500" />
          <span className="font-semibold text-stone-700">{t('শুরু তারিখ:', 'From:')}</span>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-900"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-700">{t('শেষ তারিখ:', 'To:')}</span>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-900"
          />
        </div>
      </div>

      {/* Printable Report Document Sheet */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-sm print:border-none print:p-0 space-y-8">
        
        {/* Document Header */}
        <div className="text-center pb-6 border-b border-stone-300 space-y-1">
          <div className="text-xs font-serif font-semibold text-emerald-800">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950">
            উমারখালী কিস্তুপুর প্রবাসী যুব সংঘ
          </h2>
          <p className="text-xs text-stone-500">
            {t('আর্থিক বিবরণী ও আয়-ব্যয় অডিট রিপোর্ট', 'Financial Statement & Audit Report')}
          </p>
          <p className="text-xs font-mono text-stone-600 pt-1">
            {t('সময়কাল: ', 'Period: ')}{formatDate(startDate, isBn)} - {formatDate(endDate, isBn)}
          </p>
        </div>

        {/* Period Summary Numbers */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block">{t('মোট প্রাপ্তি / আয়', 'Period Income')}</span>
            <span className="text-xl font-bold font-mono text-emerald-800 mt-1 block">
              {formatCurrency(periodIncome, isBn)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 block">{t('মোট ব্যয়', 'Period Expense')}</span>
            <span className="text-xl font-bold font-mono text-rose-800 mt-1 block">
              {formatCurrency(periodExpense, isBn)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 block">{t('সময়কালের উদ্বৃত্ত', 'Period Surplus')}</span>
            <span className="text-xl font-bold font-mono text-emerald-950 mt-1 block">
              {formatCurrency(periodNet, isBn)}
            </span>
          </div>
        </div>

        {/* Detailed Transactions in Period */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-stone-900 text-sm">
            {t('সময়কালের বিস্তারিত লেনদেন তালিকা', 'Transactions Recorded in Period')}
          </h3>
          <table className="w-full text-left text-xs border border-stone-200">
            <thead className="bg-stone-100 text-stone-700 border-b border-stone-200">
              <tr>
                <th className="p-2.5">ভাউচার</th>
                <th className="p-2.5">তারিখ</th>
                <th className="p-2.5">খাত ও বিবরণ</th>
                <th className="p-2.5">ধরন</th>
                <th className="p-2.5 text-right">টাকা (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-stone-700">
              {filtered.map(t => (
                <tr key={t.id}>
                  <td className="p-2.5 font-mono">{t.voucherNo}</td>
                  <td className="p-2.5">{formatDate(t.date, isBn)}</td>
                  <td className="p-2.5">
                    <span className="font-medium text-stone-900">{t.categoryName}</span>
                    <span className="text-stone-500 block text-[11px]">{t.description || t.memberName || t.paidTo}</span>
                  </td>
                  <td className="p-2.5">
                    <span className={t.type === 'income' ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                      {t.type === 'income' ? 'আয়' : 'ব্যয়'}
                    </span>
                  </td>
                  <td className={`p-2.5 text-right font-mono font-bold ${
                    t.type === 'income' ? 'text-emerald-800' : 'text-rose-800'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, isBn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="pt-16 flex items-end justify-between text-xs text-stone-600">
          <div className="text-center">
            <div className="w-32 border-b border-stone-400 mb-1 mx-auto" />
            <span>{t('অর্থ সম্পাদক / কোষাধ্যক্ষ', 'Treasurer')}</span>
          </div>

          <div className="text-center">
            <div className="w-32 border-b border-stone-400 mb-1 mx-auto" />
            <span>{t('সাধারণ সম্পাদক', 'General Secretary')}</span>
          </div>

          <div className="text-center">
            <div className="w-32 border-b border-stone-400 mb-1 mx-auto" />
            <span>{t('সভাপতি', 'President')}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
