import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { Transaction, IslamicFundType } from '../../types';
import { formatCurrency, formatDate, getFundTypeLabel } from '../../utils/formatters';
import { 
  PlusCircle, 
  Search, 
  Receipt, 
  Trash2, 
  Download, 
  ShieldAlert, 
  X, 
  Filter, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

interface AdminTransactionsProps {
  onOpenQuickTransaction: () => void;
  onOpenReceipt: (trx: Transaction) => void;
}

export const AdminTransactions: React.FC<AdminTransactionsProps> = ({
  onOpenQuickTransaction,
  onOpenReceipt,
}) => {
  const { lang, t } = useLanguage();
  const { showToast } = useNotification();
  const isBn = lang === 'bn';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [fundFilter, setFundFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Cancel modal state
  const [cancelingTrx, setCancelingTrx] = useState<Transaction | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    fetch('/api/transactions?limit=250')
      .then(r => r.json())
      .then(data => {
        if (data && data.data) setTransactions(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelingTrx || !cancelReason) {
      showToast(t('বাতিলের কারণ উল্লেখ করুন', 'Please provide a cancellation reason'), 'error');
      return;
    }

    setIsCanceling(true);
    try {
      const res = await fetch(`/api/transactions/${cancelingTrx.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason, canceledBy: 'সুপার এডমিন' }),
      });

      if (res.ok) {
        showToast(t('লেনদেনটি সফলভাবে বাতিল করা হয়েছে', 'Transaction canceled'), 'success');
        setCancelingTrx(null);
        setCancelReason('');
        fetchTransactions();
      } else {
        showToast('বাতিলকরণ ব্যর্থ হয়েছে', 'error');
      }
    } catch {
      showToast('সার্ভার সংযোগ ত্রুটি', 'error');
    } finally {
      setIsCanceling(false);
    }
  };

  const exportCSV = () => {
    const headers = ['VoucherNo', 'Date', 'Type', 'FundType', 'Amount', 'Category', 'Entity', 'Project', 'Notes'];
    const rows = filteredTrxs.map(t => [
      t.voucherNo,
      t.date,
      t.type,
      t.fundType,
      t.amount,
      `"${t.categoryName || ''}"`,
      `"${t.memberName || t.donorName || t.paidTo || ''}"`,
      `"${t.projectName || ''}"`,
      `"${t.description || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ukpjs_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTrxs = transactions.filter(trx => {
    if (typeFilter !== 'all' && trx.type !== typeFilter) return false;
    if (fundFilter !== 'all' && trx.fundType !== fundFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        trx.voucherNo.toLowerCase().includes(q) ||
        trx.description.toLowerCase().includes(q) ||
        (trx.memberName && trx.memberName.toLowerCase().includes(q)) ||
        (trx.donorName && trx.donorName.toLowerCase().includes(q)) ||
        (trx.paidTo && trx.paidTo.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            {t('কেন্দ্রীয় লেনদেন লেজার ও হিসাব খাতা', 'Central Transaction Ledger & Cashbook')}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {t('আয়-ব্যয়ের সকল রেকর্ড পর্যবেক্ষণ, নতুন এন্ট্রি, মানি রসিদ মুদ্রণ ও বাতিলকরণ।', 'Audit, issue receipts, and manage all central transactions.')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>{t('CSV এক্সপোর্ট', 'Export CSV')}</span>
          </button>

          <button
            onClick={onOpenQuickTransaction}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('+ নতুন লেনদেন এন্ট্রি', '+ New Entry')}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                typeFilter === 'all' ? 'bg-white font-semibold text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('সকল', 'All')}
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                typeFilter === 'income' ? 'bg-white font-semibold text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('আয় (+)', 'Income (+)')}
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                typeFilter === 'expense' ? 'bg-white font-semibold text-rose-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t('ব্যয় (-)', 'Expense (-)')}
            </button>
          </div>

          <select
            value={fundFilter}
            onChange={e => setFundFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl text-stone-800 focus:outline-none"
          >
            <option value="all">{t('সকল তহবিল', 'All Funds')}</option>
            <option value="general_hadiya">সাধারণ হাদিয়া</option>
            <option value="monthly_donation">মাসিক চাঁদা</option>
            <option value="project_donation">প্রকল্প অনুদান</option>
            <option value="zakat">যাকাত</option>
            <option value="sadaqah">সদকাহ</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('ভাউচার বা নাম খুঁজুন...', 'Search voucher or name...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
            <tr>
              <th className="px-4 py-3 font-semibold">{t('ভাউচার নং', 'Voucher')}</th>
              <th className="px-4 py-3 font-semibold">{t('তারিখ', 'Date')}</th>
              <th className="px-4 py-3 font-semibold">{t('তহবিল ও খাত', 'Fund & Category')}</th>
              <th className="px-4 py-3 font-semibold">{t('সদস্য / দাতা / প্রাপক', 'Entity')}</th>
              <th className="px-4 py-3 font-semibold">{t('সংযুক্ত প্রকল্প', 'Project')}</th>
              <th className="px-4 py-3 font-semibold text-right">{t('টাকার পরিমাণ', 'Amount')}</th>
              <th className="px-4 py-3 font-semibold text-center">{t('অ্যাকশন', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-stone-400">
                  {t('লোড হচ্ছে...', 'Loading transactions...')}
                </td>
              </tr>
            ) : filteredTrxs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-stone-400">
                  {t('কোনো লেনদেন পাওয়া যায়নি।', 'No transactions found.')}
                </td>
              </tr>
            ) : (
              filteredTrxs.map(trx => (
                <tr key={trx.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-stone-900">{trx.voucherNo}</td>
                  <td className="px-4 py-3 text-stone-500 whitespace-nowrap">{formatDate(trx.date, isBn)}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-stone-800 block">{getFundTypeLabel(trx.fundType, isBn)}</span>
                    <span className="text-[11px] text-stone-500">{trx.categoryName}</span>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="font-medium text-stone-900 truncate">
                      {trx.type === 'income' 
                        ? (trx.isAnonymous ? t('গোপনীয় দানশীল ভাই', 'Anonymous') : (trx.memberName || trx.donorName || 'সাধারণ শুভাকাঙ্ক্ষী'))
                        : (trx.paidTo || trx.categoryName)}
                    </div>
                    {trx.description && <p className="text-[11px] text-stone-400 italic truncate">{trx.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {trx.projectName || t('সাধারণ', 'General')}
                  </td>
                  <td className={`px-4 py-3 text-right font-mono font-bold whitespace-nowrap ${
                    trx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {trx.type === 'income' ? '+' : '-'}{formatCurrency(trx.amount, isBn)}
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {trx.type === 'income' && (
                        <button
                          onClick={() => onOpenReceipt(trx)}
                          className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg cursor-pointer"
                          title="Print Receipt"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setCancelingTrx(trx)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Cancel Transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cancel Transaction Modal */}
      {cancelingTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>{t('লেনদেন বাতিল নিশ্চিতকরণ', 'Cancel Transaction Confirmation')}</span>
              </div>
              <button
                onClick={() => setCancelingTrx(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              {t(
                `আপনি ভাউচার নং ${cancelingTrx.voucherNo} এর ৳${cancelingTrx.amount} এর লেনদেনটি বাতিল করতে যাচ্ছেন। বাতিলের তথ্য অডিট লগে স্থায়ীভাবে সংরক্ষিত থাকবে।`,
                `You are canceling voucher ${cancelingTrx.voucherNo} of ৳${cancelingTrx.amount}. This action is logged permanently.`
              )}
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('বাতিলের কারণ লিখুন *', 'Cancellation Reason *')}
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder={t('যেমন: ভুল তথ্য এন্ট্রি বা ডুপ্লিকেট ভাউচার', 'e.g. Duplicate voucher or typo')}
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelingTrx(null)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  {t('ফিরে যান', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isCanceling}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isCanceling ? t('বাতিল হচ্ছে...', 'Processing...') : t('স্থায়ীভাবে বাতিল করুন', 'Confirm Cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
