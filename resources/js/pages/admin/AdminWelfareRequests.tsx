import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { WelfareRequest } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { HeartHandshake, CheckCircle2, XCircle, Clock, DollarSign, X } from 'lucide-react';

export const AdminWelfareRequests: React.FC = () => {
  const { lang, t } = useLanguage();
  const { showToast } = useNotification();
  const isBn = lang === 'bn';

  const [requests, setRequests] = useState<WelfareRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Approval modal state
  const [activeReq, setActiveReq] = useState<WelfareRequest | null>(null);
  const [approvedAmount, setApprovedAmount] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [fundType, setFundType] = useState('zakat');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    fetch('/api/welfare-requests')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setRequests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleOpenApprove = (req: WelfareRequest) => {
    setActiveReq(req);
    setApprovedAmount(String(req.requestedAmount || 5000));
    setAdminNotes('যাচাই কমিটির সুপারিশক্রমে অনুমোদিত');
    setFundType('zakat');
  };

  const handleDisburseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReq || !approvedAmount) return;

    setIsProcessing(true);
    try {
      // 1. Update welfare request status
      const res = await fetch(`/api/welfare-requests/${activeReq.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'disbursed',
          approvedAmount: Number(approvedAmount),
          adminNotes,
          reviewedBy: 'সুপার এডমিন',
        }),
      });

      // 2. Automatically log an audited expense transaction in Central Ledger!
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'expense',
          fundType,
          amount: Number(approvedAmount),
          date: new Date().toISOString().split('T')[0],
          paidTo: `${activeReq.applicantName} (${activeReq.village})`,
          paymentMethod: 'cash',
          categoryId: 'cat-welfare-grant',
          categoryName: `অসহায় সহায়তা অনুদান (${activeReq.category})`,
          description: `সাহায্য আবেদন আইডি ${activeReq.id}: ${activeReq.description}`,
          enteredBy: 'সুপার এডমিন',
        }),
      });

      if (res.ok) {
        showToast(t(`৳${approvedAmount} অনুদান ছাড় ও কেন্দ্রীয় লেজারে খরচ লিপিবদ্ধ হয়েছে`, 'Welfare grant disbursed and ledger updated'), 'success');
        setActiveReq(null);
        fetchRequests();
      } else {
        showToast('প্রক্রিয়াকরণ ব্যর্থ হয়েছে', 'error');
      }
    } catch {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-stone-200">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
          {t('অসহায় মানুষের সাহায্য আবেদন পর্যালোচনা', 'Welfare Assistance Requests Review')}
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          {t('গ্রামের দুস্থ ও অসুস্থ মানুষের চিকিৎসা, খাদ্য ও ঘর মেরামত আবেদনের তদন্ত ও অনুদান বিতরণ।', 'Review emergency community welfare grants and disburse funds directly into central ledger.')}
        </p>
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 font-semibold">
            <tr>
              <th className="px-4 py-3">{t('আবেদনকারী', 'Applicant')}</th>
              <th className="px-4 py-3">{t('খাত ও এলাকা', 'Category & Area')}</th>
              <th className="px-4 py-3">{t('সমস্যার বিবরণ', 'Problem Description')}</th>
              <th className="px-4 py-3 text-right">{t('প্রার্থিত টাকা', 'Requested')}</th>
              <th className="px-4 py-3 text-right">{t('অনুমোদিত', 'Approved')}</th>
              <th className="px-4 py-3 text-center">{t('অবস্থা', 'Status')}</th>
              <th className="px-4 py-3 text-center">{t('অ্যাকশন', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-stone-400">
                  {t('কোনো আবেদন জমা নেই।', 'No requests found.')}
                </td>
              </tr>
            ) : (
              requests.map(req => (
                <tr key={req.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="font-bold text-stone-900">{req.applicantName}</div>
                    <div className="text-[11px] text-stone-400 font-mono">{req.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-emerald-800 block">{req.category}</span>
                    <span className="text-[11px] text-stone-500">{req.village}</span>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="line-clamp-2 text-stone-600">{req.description}</p>
                    <span className="text-[10px] text-stone-400">{formatDate(req.createdAt, isBn)}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-stone-900">
                    {formatCurrency(req.requestedAmount, isBn)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-800">
                    {req.approvedAmount ? formatCurrency(req.approvedAmount, isBn) : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold text-white ${
                      req.status === 'disbursed'
                        ? 'bg-emerald-800'
                        : req.status === 'approved'
                        ? 'bg-blue-800'
                        : req.status === 'pending'
                        ? 'bg-amber-800'
                        : 'bg-stone-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    {req.status === 'pending' || req.status === 'approved' ? (
                      <button
                        onClick={() => handleOpenApprove(req)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
                        {t('অনুদান ছাড় / বিতরণ', 'Disburse Grant')}
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>বিতরণ সম্পন্ন</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Disburse Grant Modal */}
      {activeReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold font-serif text-stone-900 text-base">
                {t('অনুদান অনুমোদন ও কেন্দ্রীয় খাতা থেকে ছাড়', 'Approve & Disburse Grant')}
              </h3>
              <button onClick={() => setActiveReq(null)} className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              গ্রহীতা: <strong>{activeReq.applicantName}</strong> ({activeReq.village})<br />
              আবেদনের কারণ: {activeReq.description}
            </p>

            <form onSubmit={handleDisburseSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('অনুমোদিত টাকার পরিমাণ (৳) *', 'Amount (BDT) *')}</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={approvedAmount}
                    onChange={e => setApprovedAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono font-bold text-stone-900 border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('কোন তহবিল থেকে দেওয়া হবে? *', 'Fund *')}</label>
                  <select
                    value={fundType}
                    onChange={e => setFundType(e.target.value)}
                    className="w-full px-3 py-2 text-xs text-stone-900 border border-stone-300 rounded-lg"
                  >
                    <option value="zakat">যাকাত তহবিল (শরিয়াহসম্মত)</option>
                    <option value="emergency_fund">জরুরি ত্রাণ তহবিল</option>
                    <option value="general_hadiya">সাধারণ হাদিয়া</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">{t('এডমিন তদন্ত নোট ও বিবরণ', 'Verification Notes')}</label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs text-stone-900 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] border border-emerald-200">
                {t('এই বাটনটি চাপার সাথে সাথে কেন্দ্রীয় ক্যাশ লেজারে ভাউচারসহ একটি ব্যয় হিসেবে এন্ট্রি হয়ে যাবে।', 'Disbursing will automatically record an expense voucher in the Central Ledger.')}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setActiveReq(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-sm"
                >
                  {isProcessing ? t('প্রক্রিয়াকরণ হচ্ছে...', 'Processing...') : t('অনুদান ছাড় করুন', 'Disburse Grant')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
