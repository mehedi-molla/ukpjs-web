import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { Member, Transaction } from '../../types';
import { formatCurrency, toBengaliNumber } from '../../utils/formatters';
import { Check, X, Clock, Plus, Receipt, UserCheck } from 'lucide-react';

export const AdminMonthlyDonations: React.FC<{ onOpenReceipt: (trx: Transaction) => void }> = ({ onOpenReceipt }) => {
  const { lang, t } = useLanguage();
  const { showToast } = useNotification();
  const isBn = lang === 'bn';

  const [members, setMembers] = useState<Member[]>([]);
  const [monthlyTrxs, setMonthlyTrxs] = useState<Transaction[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [loading, setLoading] = useState(true);

  // Quick record modal
  const [recordingMember, setRecordingMember] = useState<Member | null>(null);
  const [recordMonth, setRecordMonth] = useState<number>(1);
  const [recordAmount, setRecordAmount] = useState<number>(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  const fetchData = () => {
    Promise.all([
      fetch('/api/members').then(r => r.json()),
      fetch('/api/transactions?fundType=monthly_donation&limit=500').then(r => r.json()),
    ]).then(([mems, trxs]) => {
      if (Array.isArray(mems)) setMembers(mems);
      if (trxs && trxs.data) setMonthlyTrxs(trxs.data);
      setLoading(false);
    });
  };

  const monthsBn = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = isBn ? monthsBn : monthsEn;

  // Check if member paid for month (monthIdx: 1..12)
  const getMemberMonthTrx = (memberId: string, monthIdx: number): Transaction | undefined => {
    const monthStr = monthIdx < 10 ? `0${monthIdx}` : `${monthIdx}`;
    const pattern = `${selectedYear}-${monthStr}`;
    return monthlyTrxs.find(t => t.memberId === memberId && t.date.startsWith(pattern));
  };

  const handleOpenRecord = (member: Member, monthIdx: number) => {
    setRecordingMember(member);
    setRecordMonth(monthIdx);
    setRecordAmount(member.monthlyPledgeAmount || 1000);
  };

  const handleSubmitRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingMember) return;

    setIsSubmitting(true);
    try {
      const monthStr = recordMonth < 10 ? `0${recordMonth}` : `${recordMonth}`;
      const payload = {
        type: 'income',
        fundType: 'monthly_donation',
        amount: Number(recordAmount),
        date: `${selectedYear}-${monthStr}-15`,
        memberId: recordingMember.id,
        categoryId: 'cat-monthly-pledge',
        categoryName: `${months[recordMonth - 1]} ${selectedYear} মাসিক চাঁদা`,
        paymentMethod: 'bkash',
        description: `${recordingMember.nameBn} - ${months[recordMonth - 1]} ${selectedYear} মাসিক অনুদান`,
        enteredBy: 'সুপার এডমিন',
      };

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedTrx = await res.json();
        showToast(t('মাসিক চাঁদা পরিশোধ সংরক্ষিত হয়েছে', 'Monthly donation recorded'), 'success');
        setRecordingMember(null);
        fetchData();
        // Offer instant receipt
        if (savedTrx) onOpenReceipt(savedTrx);
      } else {
        showToast('সংরক্ষণ ব্যর্থ হয়েছে', 'error');
      }
    } catch {
      showToast('সার্ভার ত্রুটি', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            {t('সদস্যদের মাসিক চাঁদা ও অনুদান গ্রিড', 'Monthly Contribution Tracking Matrix')}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {t('কোন সদস্যের কোন মাসের চাঁদা পরিশোধিত বা বকেয়া তা এক নজরে দেখুন ও এক ক্লিকে এন্ট্রি করুন।', 'Real-time overview of monthly pledges across all 12 months with 1-click recording.')}
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-600">{t('বছর:', 'Year:')}</span>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="px-3.5 py-1.5 text-xs font-mono font-bold bg-white border border-stone-300 rounded-xl text-stone-900 focus:outline-none"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
          </select>
        </div>
      </div>

      {/* Monthly Donation Grid Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-center text-xs border-collapse">
          <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-semibold">
            <tr>
              <th className="px-4 py-3.5 text-left min-w-[200px]">{t('সদস্যের নাম ও দেশ', 'Member & Country')}</th>
              <th className="px-2 py-3.5 text-right">{t('অঙ্গীকার', 'Pledge')}</th>
              {months.map((m, idx) => (
                <th key={idx} className="px-2 py-3.5 font-medium">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            {members.map(member => (
              <tr key={member.id} className="hover:bg-stone-50/80 transition-colors">
                <td className="px-4 py-3 text-left">
                  <div className="font-bold text-stone-900">{isBn ? member.nameBn : member.nameEn}</div>
                  <div className="text-[11px] text-stone-400">
                    <span className="font-mono">{member.memberId}</span> · {member.country}
                  </div>
                </td>
                <td className="px-2 py-3 text-right font-mono font-bold text-emerald-800">
                  {formatCurrency(member.monthlyPledgeAmount || 1000, isBn)}
                </td>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(monthIdx => {
                  const trx = getMemberMonthTrx(member.id, monthIdx);
                  return (
                    <td key={monthIdx} className="px-1.5 py-3">
                      {trx ? (
                        <button
                          onClick={() => onOpenReceipt(trx)}
                          className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto hover:bg-emerald-200 transition-colors cursor-pointer"
                          title={`Paid: ${trx.amount} BDT (Voucher: ${trx.voucherNo}) - Click for receipt`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenRecord(member, monthIdx)}
                          className="w-7 h-7 rounded-lg bg-stone-100 text-stone-400 hover:bg-emerald-600 hover:text-white flex items-center justify-center mx-auto transition-colors cursor-pointer group"
                          title="Click to record payment"
                        >
                          <Plus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      {recordingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-bold font-serif text-stone-900 text-base">
              {t('মাসিক চাঁদা পরিশোধ রেকর্ড', 'Record Monthly Donation')}
            </h3>
            <p className="text-xs text-stone-600">
              <strong>{recordingMember.nameBn}</strong> ({recordingMember.country}) এর জন্য{' '}
              <strong>{months[recordMonth - 1]} {selectedYear}</strong> এর চাঁদা যুক্ত করুন।
            </p>

            <form onSubmit={handleSubmitRecord} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">{t('টাকার পরিমাণ (৳) *', 'Amount *')}</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={recordAmount}
                  onChange={e => setRecordAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-mono font-bold text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRecordingMember(null)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-sm"
                >
                  {isSubmitting ? t('সংরক্ষণ হচ্ছে...', 'Saving...') : t('পরিশোধ নিশ্চিত করুন', 'Confirm & Issue Receipt')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
