import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { WebsiteSettings, Project } from '../../types';
import { HeartHandshake, ShieldCheck, Copy, Check, Send, AlertCircle } from 'lucide-react';

export const DonationPage: React.FC<{ setCurrentPage: (page: string) => void; initialSettings?: WebsiteSettings | null; initialProjects?: Project[] }> = ({ setCurrentPage, initialSettings, initialProjects }) => {
  const { lang, t } = useLanguage();
  const { showToast } = useNotification();
  const isBn = lang === 'bn';

  const settings = initialSettings ?? null;
  const projects = initialProjects ?? [];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Contribution notification form state
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [fundType, setFundType] = useState('general_hadiya');
  const [projectId, setProjectId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [referenceNo, setReferenceNo] = useState('');
  const [notes, setNotes] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(t('নম্বর কপি করা হয়েছে', 'Number copied to clipboard'), 'info');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleLegacyNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      showToast(t('সঠিক টাকার পরিমাণ দিন', 'Please enter a valid amount'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // In this system, voluntary public donation submission creates an auditable transaction
      const payload = {
        type: 'income',
        fundType,
        amount: Number(amount),
        date: new Date().toISOString().split('T')[0],
        projectId: projectId || undefined,
        donorName: isAnonymous ? undefined : (donorName || 'শুভাকাঙ্ক্ষী'),
        isAnonymous,
        paymentMethod,
        referenceNo,
        description: `অনলাইন দান নোটিফিকেশন: ${notes || 'সাধারণ অনুদান'} (মোবাইল: ${phone})`,
        categoryId: 'cat-online-donation',
        categoryName: 'অনলাইন সরাসরি হাদিয়া/অনুদান',
        enteredBy: 'ওয়েবসাইট স্বয়ংক্রিয়',
      };

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(
          t(
            'জাযাকাল্লাহু খাইরান! আপনার অনুদানের তথ্য সফলভাবে নিবন্ধিত হয়েছে।',
            'JazakAllahu Khair! Your donation notification has been submitted.'
          ),
          'success'
        );
        // Reset form
        setDonorName('');
        setPhone('');
        setAmount('');
        setReferenceNo('');
        setNotes('');
        setCurrentPage('transparency');
      } else {
        showToast('সংরক্ষণ ব্যর্থ হয়েছে', 'error');
      }
    } catch (e) {
      showToast('সার্ভার সংযোগে সমস্যা', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      showToast(t('à¦¸à¦ à¦¿à¦• à¦Ÿà¦¾à¦•à¦¾à¦° à¦ªà¦°à¦¿à¦®à¦¾à¦£ à¦¦à¦¿à¦¨', 'Please enter a valid amount'), 'error');
      return;
    }

    setIsSubmitting(true);
    router.post('/donation-notifications', {
      donor_name: isAnonymous ? null : (donorName || null),
      phone: phone || null,
      amount: Number(amount),
      fund_type: fundType,
      project_id: projectId || null,
      payment_method: paymentMethod,
      reference_no: referenceNo || null,
      notes: notes || null,
      is_anonymous: isAnonymous,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        showToast(t('à¦œà¦¾à¦¯à¦¾à¦•à¦¾à¦²à§à¦²à¦¾à¦¹à§ à¦–à¦¾à¦‡à¦°à¦¾à¦¨!', 'JazakAllahu Khair! Your donation notification has been submitted.'), 'success');
        setDonorName('');
        setPhone('');
        setAmount('');
        setReferenceNo('');
        setNotes('');
        setIsSubmitting(false);
        setCurrentPage('transparency');
      },
      onError: () => {
        showToast(t('à¦¸à¦‚à¦°à¦•à§à¦·à¦£ à¦¬à§à¦¯à¦°à§à¦¥ à¦¹à¦¯à¦¼à§‡à¦›à§‡', 'Unable to submit donation confirmation'), 'error');
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 pb-6 border-b border-stone-200">
        <span className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">
          {t('হাদিয়া ও অনুদান সহায়িকা', 'Donation & Hadiya Guide')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
          {t('মানবতার কল্যাণে আপনার সাদকা ও হাদিয়া প্রদান করুন', 'Support With Your Sadaqah, Zakat & Hadiya')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto">
          {settings?.donationInstructionsBn || t(
            'উমারখালী কিস্তুপুর প্রবাসী যুব সংঘের সকল কার্যক্রমে আপনার যাকাত, সদকা ও সাধারণ অনুদান পাঠাতে পারেন। প্রতিটি পয়সার হিসাব ওয়েবসাইটে স্বচ্ছভাবে প্রকাশ করা হয়।',
            'Contribute your Zakat, Sadaqah, and Hadiya. Every penny is meticulously recorded in our central ledger.'
          )}
        </p>
      </div>

      {/* Shariah Fund Separation Info */}
      <div className="p-5 rounded-2xl bg-emerald-950 text-white border border-emerald-900 space-y-2">
        <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs sm:text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{t('শরিয়াহ নির্দেশিকা অনুযায়ী তহবিল পৃথকীকরণ নীতি', 'Islamic Shariah Fund Segregation Policy')}</span>
        </div>
        <p className="text-xs text-stone-300 leading-relaxed">
          {t(
            'আমরা যাকাত এবং সাধারণ তহবিলের অর্থ সম্পূর্ণ আলাদা রাখি। যাকাত কেবল শরিয়াহ নির্দেশিত হকদার অসহায় পরিবার ও রোগীর জন্য ব্যবহৃত হয়। সাধারণ হাদিয়া সংগঠনের চলমান প্রজেক্ট ও সেবায় ব্যয় করা হয়।',
            'Zakat funds are ring-fenced exclusively for Shariah-eligible recipients and medical aid. General Hadiya supports community infrastructure and social welfare.'
          )}
        </p>
      </div>

      {/* Payment Channels Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-stone-900">
          {t('অনুদান প্রেরণের মাধ্যমসমূহ', 'Official Payment Channels')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* bKash */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-pink-700">bKash (বিকাশ)</span>
              <span className="text-[11px] text-stone-400">{t('পার্সোনাল / মার্চেন্ট', 'Personal')}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-stone-900">
                {settings?.bkashNumber || t('অ্যাডমিন কর্তৃক এখনো নির্ধারিত হয়নি', 'Not configured by an administrator')}
              </span>
              <button
                onClick={() => settings?.bkashNumber && copyToClipboard(settings.bkashNumber, 'bkash')}
                disabled={!settings?.bkashNumber}
                className="p-1.5 text-stone-500 hover:text-stone-900 rounded cursor-pointer"
                title="Copy Number"
              >
                {copiedKey === 'bkash' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-stone-500 leading-tight">
              {t('সেন্ড মানি করার পর ট্রানজেকশন আইডি (TrxID) সংরক্ষণ করুন।', 'Please save the TrxID after sending funds.')}
            </p>
          </div>

          {/* Nagad */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-orange-600">Nagad (নগদ)</span>
              <span className="text-[11px] text-stone-400">{t('পার্সোনাল', 'Personal')}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-stone-900">
                {settings?.nagadNumber || t('অ্যাডমিন কর্তৃক এখনো নির্ধারিত হয়নি', 'Not configured by an administrator')}
              </span>
              <button
                onClick={() => settings?.nagadNumber && copyToClipboard(settings.nagadNumber, 'nagad')}
                disabled={!settings?.nagadNumber}
                className="p-1.5 text-stone-500 hover:text-stone-900 rounded cursor-pointer"
                title="Copy Number"
              >
                {copiedKey === 'nagad' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-stone-500 leading-tight">
              {t('নগদ মোবাইল ওয়ালেট দিয়ে সহজে অনুদান প্রেরণ করুন।', 'Send easily using Nagad mobile financial service.')}
            </p>
          </div>

          {/* Bank Account */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-800">{t('ইসলামী ব্যাংক হিসাব', 'Bank Account')}</span>
              <span className="text-[11px] text-stone-400">IBBL</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
              <div className="font-mono font-bold text-stone-900 truncate">
                {settings?.bankAccountDetails || t('অ্যাডমিন কর্তৃক এখনো নির্ধারিত হয়নি', 'Not configured by an administrator')}
              </div>
              <div className="text-[11px] text-stone-600">
                Title: Umarkhali Kistupur Probashi Jubo Songho
              </div>
            </div>
            <p className="text-[11px] text-stone-500 leading-tight">
              {t('প্রবাসী ভাইরা সরাসরি রেমিট্যান্স বা ব্যাংক ট্রান্সফার করতে পারেন।', 'Suitable for overseas remittances and direct bank transfers.')}
            </p>
          </div>

        </div>
      </div>

      {/* Donation Notification Form */}
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-10 border border-stone-200 space-y-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900">
            {t('টাকা পাঠানোর পর অবহিতকরণ ফর্ম', 'Submit Donation Confirmation')}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {t(
              'আপনি টাকা প্রেরণের পর এই ফর্মটি পূরণ করলে স্বয়ংক্রিয়ভাবে সংগঠনের ডিজিটাল হিসাব খাতায় তা অন্তর্ভুক্ত হবে এবং রসিদ তৈরি হবে।',
              'Fill this form with your payment reference so our system generates your verified money receipt.'
            )}
          </p>
        </div>

        <form onSubmit={handleNotificationSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('টাকার পরিমাণ (৳) *', 'Amount (BDT ৳) *')}
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="যেমন: 3000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-3.5 py-2 text-sm font-mono font-bold text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('তহবিলের উদ্দেশ্য / শ্রেণি *', 'Fund Classification *')}
              </label>
              <select
                value={fundType}
                onChange={e => setFundType(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="general_hadiya">{t('সাধারণ হাদিয়া (General Welfare)', 'General Welfare')}</option>
                <option value="project_donation">{t('প্রকল্প অনুদান (Specific Project)', 'Specific Project')}</option>
                <option value="zakat">{t('যাকাত (শরিয়াহসম্মত চিকিৎসা ও দরিদ্রদের জন্য)', 'Zakat Fund')}</option>
                <option value="sadaqah">{t('সদকাহ (গাছ রোপণ ও অবকাঠামো)', 'Sadaqah')}</option>
                <option value="emergency_fund">{t('জরুরি তহবিল (Emergency Relief)', 'Emergency Relief')}</option>
              </select>
            </div>
          </div>

          {fundType === 'project_donation' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('কোন প্রকল্পের জন্য? *', 'Select Target Project *')}
              </label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">{t('-- প্রকল্প নির্বাচন করুন --', '-- Select Project --')}</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.code}: {p.titleBn}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('পরিশোধের মাধ্যম *', 'Payment Method *')}
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="bkash">বিকাশ (bKash)</option>
                <option value="nagad">নগদ (Nagad)</option>
                <option value="rocket">রকেট (Rocket)</option>
                <option value="bank">ব্যাংক ট্রান্সফার (Bank Transfer)</option>
                <option value="cash">নগদ ক্যাশ (Cash)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('ট্রানজেকশন আইডি (TrxID) / রেফারেন্স', 'Transaction Reference / TrxID')}
              </label>
              <input
                type="text"
                placeholder="যেমন: BK99283741"
                value={referenceNo}
                onChange={e => setReferenceNo(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('আপনার নাম', 'Your Name')}
              </label>
              <input
                type="text"
                disabled={isAnonymous}
                placeholder={isAnonymous ? t('নাম প্রকাশে অনিচ্ছুক', 'Anonymous') : t('যেমন: কামরুল হাসান', 'e.g. Kamrul Hasan')}
                value={donorName}
                onChange={e => setDonorName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-stone-100"
              />
              <label className="mt-1 flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={e => setIsAnonymous(e.target.checked)}
                />
                <span>{t('নাম প্রকাশে অনিচ্ছুক (Anonymous হিসেবে রাখুন)', 'Keep my name anonymous in public records')}</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('মোবাইল / হোয়াটসঅ্যাপ নম্বর', 'Phone / WhatsApp Number')}
              </label>
              <input
                type="text"
                placeholder="যেমন: 01712-000000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-sm text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('কোনো বিশেষ দোয়া বা মন্তব্য (ঐচ্ছিক)', 'Remarks or Specific Prayer (Optional)')}
            </label>
            <textarea
              rows={2}
              placeholder={t('যেমন: মরহুম পিতামাতার মাগফিরাতের জন্য সদকা...', 'e.g. Sadaqah for deceased parents...')}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? t('জমা হচ্ছে...', 'Submitting...') : t('অনুদানের তথ্য সাবমিট করুন', 'Submit Donation Confirmation')}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
