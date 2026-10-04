import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { Project, Member, TransactionType, IslamicFundType, PaymentMethod } from '../types';
import { X, TrendingUp, TrendingDown, Save, Check } from 'lucide-react';

interface QuickTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const QuickTransactionModal: React.FC<QuickTransactionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const { showToast } = useNotification();

  const [type, setType] = useState<TransactionType>('income');
  const [fundType, setFundType] = useState<IslamicFundType>('general_hadiya');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [projectId, setProjectId] = useState('');
  const [donorType, setDonorType] = useState<'member' | 'guest' | 'anonymous'>('member');
  const [memberId, setMemberId] = useState('');
  const [donorName, setDonorName] = useState('');
  const [paidTo, setPaidTo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [referenceNo, setReferenceNo] = useState('');
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/projects').then(r => r.json()).then(setProjects).catch(() => {});
      fetch('/api/members').then(r => r.json()).then(setMembers).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      showToast(t('অনুগ্রহ করে সঠিক টাকার পরিমাণ লিখুন', 'Please enter a valid amount'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        type,
        fundType,
        amount: Number(amount),
        date,
        projectId: projectId || undefined,
        memberId: type === 'income' && donorType === 'member' ? memberId : undefined,
        donorName: type === 'income' && donorType === 'guest' ? donorName : undefined,
        isAnonymous: type === 'income' && donorType === 'anonymous',
        paidTo: type === 'expense' ? paidTo : undefined,
        paymentMethod,
        referenceNo,
        description,
        categoryId: `cat-${type}-${Date.now()}`,
        categoryName: categoryName || (type === 'income' ? 'সাধারণ অনুদান' : 'প্রকল্প / সাধারণ ব্যয়'),
        enteredBy: 'সুপার এডমিন',
      };

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(
          t(
            `সফলভাবে ৳${amount} এর ${type === 'income' ? 'আয়' : 'ব্যয়'} লেনদেন সংরক্ষিত হয়েছে`,
            `Successfully recorded ${type} transaction of ৳${amount}`
          ),
          'success'
        );
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        showToast(err.error || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
      }
    } catch (err) {
      showToast('নেটওয়ার্ক সংযোগ ত্রুটি', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white text-stone-900 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
              {t('নতুন দ্রুত লেনদেন এন্ট্রি', 'Quick Transaction Entry')}
            </h3>
            <p className="text-xs text-stone-500">
              {t('সরাসরি কেন্দ্রীয় হিসাবের খাতায় যুক্ত হবে', 'Directly posted to central ledger')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Segmented Type Toggle (Income / Expense) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => { setType('income'); setFundType('general_hadiya'); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{t('আয় / হাদিয়া / অনুদান', 'Income / Donation')}</span>
            </button>
            <button
              type="button"
              onClick={() => { setType('expense'); setFundType('general_hadiya'); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>{t('ব্যয় / খরচ', 'Expense')}</span>
            </button>
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('টাকার পরিমাণ (৳) *', 'Amount (BDT ৳) *')}
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="যেমন: 5000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-3.5 py-2 text-sm font-mono font-bold text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('তারিখ *', 'Date *')}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Islamic Fund Category */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('ইসলামি তহবিল শ্রেণি *', 'Shariah Fund Classification *')}
            </label>
            <select
              value={fundType}
              onChange={e => setFundType(e.target.value as IslamicFundType)}
              className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="general_hadiya">{t('সাধারণ হাদিয়া (General Hadiya)', 'General Hadiya')}</option>
              <option value="monthly_donation">{t('মাসিক অনুদান / চাঁদা (Monthly Contribution)', 'Monthly Contribution')}</option>
              <option value="project_donation">{t('প্রকল্প অনুদান (Project Specific Fund)', 'Project Specific Fund')}</option>
              <option value="zakat">{t('যাকাত তহবিল - শরিয়াহসম্মত (Zakat)', 'Zakat Fund')}</option>
              <option value="sadaqah">{t('সদকাহ (Sadaqah)', 'Sadaqah')}</option>
              <option value="special_campaign">{t('বিশেষ ক্যাম্পেইন (Special Campaign)', 'Special Campaign')}</option>
              <option value="emergency_fund">{t('জরুরি তহবিল (Emergency Aid)', 'Emergency Aid')}</option>
            </select>
          </div>

          {/* Project Association */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('সংযুক্ত প্রকল্প (ঐচ্ছিক)', 'Associated Project (Optional)')}
            </label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">{t('-- কোনো নির্দিষ্ট প্রকল্প নয় --', '-- None (General Org Fund) --')}</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code}: {p.titleBn}
                </option>
              ))}
            </select>
          </div>

          {/* INCOME SPECIFIC: Donor Information */}
          {type === 'income' ? (
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
              <label className="block text-xs font-semibold text-stone-700">
                {t('দাতার ধরন', 'Donor Type')}
              </label>
              <div className="flex gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="donorType"
                    checked={donorType === 'member'}
                    onChange={() => setDonorType('member')}
                  />
                  <span>{t('নিবন্ধিত সদস্য', 'Member')}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="donorType"
                    checked={donorType === 'guest'}
                    onChange={() => setDonorType('guest')}
                  />
                  <span>{t('অ-সদস্য / শুভাকাঙ্ক্ষী', 'Guest Donor')}</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="donorType"
                    checked={donorType === 'anonymous'}
                    onChange={() => setDonorType('anonymous')}
                  />
                  <span>{t('বেনামী (Anonymous)', 'Anonymous')}</span>
                </label>
              </div>

              {donorType === 'member' && (
                <div>
                  <label className="block text-xs text-stone-600 mb-1">{t('সদস্য নির্বাচন করুন:', 'Select Member:')}</label>
                  <select
                    value={memberId}
                    onChange={e => setMemberId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs text-stone-900 border border-stone-300 rounded-lg"
                  >
                    <option value="">{t('-- সদস্য তালিকা --', '-- Select Member --')}</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.memberId}: {m.nameBn} ({m.country})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {donorType === 'guest' && (
                <div>
                  <label className="block text-xs text-stone-600 mb-1">{t('দাতার নাম:', 'Donor Name:')}</label>
                  <input
                    type="text"
                    placeholder="যেমন: হাজী আব্দুল কাদের"
                    value={donorName}
                    onChange={e => setDonorName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs text-stone-900 border border-stone-300 rounded-lg"
                  />
                </div>
              )}
            </div>
          ) : (
            /* EXPENSE SPECIFIC: Recipient */
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('কাকে দেওয়া হলো (Recipient / Paid To) *', 'Paid To / Vendor *')}
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: সোলার টেকনো ট্রেডার্স অথবা রমিজ উদ্দিন"
                value={paidTo}
                onChange={e => setPaidTo(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          )}

          {/* Payment Method & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('পরিশোধের মাধ্যম', 'Payment Method')}
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="cash">{t('নগদ ক্যাশ (Cash)', 'Cash')}</option>
                <option value="bkash">{t('বিকাশ (bKash)', 'bKash')}</option>
                <option value="nagad">{t('নগদ (Nagad)', 'Nagad')}</option>
                <option value="rocket">{t('রকেট (Rocket)', 'Rocket')}</option>
                <option value="bank">{t('ব্যাংক ট্রান্সফার (Bank)', 'Bank')}</option>
                <option value="other">{t('অন্যান্য', 'Other')}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('ট্রানজেকশন / ভাউচার রেফারেন্স', 'Ref / TrxID / Voucher')}
              </label>
              <input
                type="text"
                placeholder="যেমন: BK99283741"
                value={referenceNo}
                onChange={e => setReferenceNo(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Description & Category Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('খাতের নাম ও বিবরণ', 'Category & Description')}
            </label>
            <input
              type="text"
              placeholder={t('যেমন: সড়কবাতি সরঞ্জাম ক্রয় অথবা জানুয়ারি চাঁদা', 'e.g. Solar equipment or Monthly pledge')}
              value={categoryName}
              onChange={e => setCategoryName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none mb-2"
            />
            <textarea
              rows={2}
              placeholder={t('অতিরিক্ত নোট / বিবরণ...', 'Additional notes or remarks...')}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              {t('বাতিল', 'Cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-700 hover:bg-emerald-600'
                  : 'bg-rose-700 hover:bg-rose-600'
              } disabled:opacity-50`}
            >
              {isSubmitting ? (
                <span>{t('সংরক্ষণ হচ্ছে...', 'Saving...')}</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t('লেনদেন সংরক্ষণ করুন', 'Save Transaction')}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
