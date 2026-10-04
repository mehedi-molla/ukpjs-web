import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { WelfareCategory } from '../../types';
import { HeartHandshake, ShieldCheck, Send, CheckCircle2, Lock } from 'lucide-react';

export const WelfareApplyPage: React.FC<{ setCurrentPage: (page: string) => void }> = ({ setCurrentPage }) => {
  const { lang, t } = useLanguage();
  const { showToast } = useNotification();

  const [applicantName, setApplicantName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('উমারখালী');
  const [category, setCategory] = useState<WelfareCategory>('medical');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !phone || !description) {
      showToast(t('প্রয়োজনীয় তথ্য পূরণ করুন', 'Please fill required fields'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        applicantName,
        guardianName,
        phone,
        village,
        category,
        requestedAmount: Number(requestedAmount) || 0,
        description,
      };

      const res = await fetch('/api/welfare-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
        showToast(t('আবেদনটি সফলভাবে জমা হয়েছে', 'Application submitted successfully'), 'success');
      } else {
        showToast('আবেদন জমা ব্যর্থ হয়েছে', 'error');
      }
    } catch {
      showToast('সার্ভার সংযোগ ত্রুটি', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 pb-6 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold">
          <HeartHandshake className="w-4 h-4 text-emerald-600" />
          <span>{t('মানবতার তরে আমাদের হাত প্রসারিত', 'Extending Support with Compassion')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
          {t('অসহায় মানুষের জন্য আর্থিক সাহায্য আবেদন', 'Welfare & Emergency Assistance Application')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto">
          {t(
            'উমারখালী ও কিস্তুপুর এলাকার যেকোনো দুস্থ পরিবার বা ব্যক্তি জটিল চিকিৎসা, অসহায়ত্ব, এতিম লালন-পালন বা দুর্যোগ সহায়তার জন্য আবেদন করতে পারেন।',
            'Confidential welfare grant application for medical emergencies, orphan care, education support, and destitution.'
          )}
        </p>
      </div>

      {submitted ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-stone-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            {t('আপনার আবেদনটি সফলভাবে গৃহীত হয়েছে', 'Your Request Has Been Received')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
            {t(
              'সংগঠনের দায়িত্বশীল প্রতিনিধি দল অতি দ্রুত আপনার সাথে যোগাযোগ করবে এবং সরেজমিনে যাচাই করে সর্বোচ্চ গোপনীয়তার সাথে প্রয়োজনীয় সহায়তা প্রদান করবে।',
              'Our verification committee will review your submission discreetly and contact you via phone shortly.'
            )}
          </p>
          <div className="pt-4">
            <button
              onClick={() => setCurrentPage('home')}
              className="px-6 py-2.5 text-xs font-semibold text-emerald-950 bg-emerald-300 hover:bg-emerald-200 rounded-xl transition-colors cursor-pointer"
            >
              {t('মূল পাতায় ফিরে যান', 'Back to Home')}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl text-stone-600 text-xs border border-stone-200">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              {t('গোপনীয়তার নিশ্চয়তা: আবেদনকারীর তথ্য কঠোর গোপনীয়তার সাথে সংরক্ষণ করা হয়। কোনো প্রকার লোকলজ্জা ছাড়াই নির্ভয়ে আবেদন করুন।', 'Strict Confidentiality: Beneficiary identities are guarded with utmost privacy.')}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t('আবেদনকারীর পূর্ণ নাম *', 'Applicant Full Name *')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোছাঃ সালমা খাতুন"
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t('পিতা / স্বামীর নাম (অভিভাবক)', 'Father / Husband Name')}
                </label>
                <input
                  type="text"
                  placeholder="যেমন: মরহুম আব্দুল করিম"
                  value={guardianName}
                  onChange={e => setGuardianName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t('মোবাইল নম্বর *', 'Phone / Contact Number *')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t('গ্রাম ও এলাকা *', 'Village / Locality *')}
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t('সাহায্যের খাত / শ্রেণি *', 'Assistance Category *')}
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as WelfareCategory)}
                  className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="medical">{t('চিকিৎসা ও ওষুধ সহায়তা (Medical)', 'Medical & Healthcare')}</option>
                  <option value="food">{t('খাদ্য সামগ্রী সহায়তা (Food Relief)', 'Food Relief')}</option>
                  <option value="education">{t('শিক্ষা ও এতিম সহায়তা (Education/Orphan)', 'Education & Orphan')}</option>
                  <option value="shelter_repair">{t('ঘরবাড়ি মেরামত / পুনর্বাসন (Housing Repair)', 'Housing Repair')}</option>
                  <option value="debt_relief">{t('ঋণমুক্তি ও জরুরি ঋণ সহায়তা (Debt Relief)', 'Debt Relief')}</option>
                  <option value="marriage_help">{t('দরিদ্র কন্যার বিবাহ সহায়তা (Marriage Help)', 'Marriage Aid')}</option>
                  <option value="other">{t('অন্যান্য মানবিক সংকট', 'Other Emergency')}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t('আনুমানিক প্রয়োজনীয় টাকার পরিমাণ (৳)', 'Estimated Needed Amount (BDT)')}
                </label>
                <input
                  type="number"
                  placeholder="যেমন: 5000"
                  value={requestedAmount}
                  onChange={e => setRequestedAmount(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {t('সমস্যার বিস্তারিত বিবরণ *', 'Detailed Explanation of Need *')}
              </label>
              <textarea
                rows={4}
                required
                placeholder={t('পরিবারের বর্তমান অবস্থা, অসুস্থতার বিবরণ বা আর্থিক সংকটের কথা বিস্তারিত লিখুন...', 'Explain the specific condition, illness diagnosis, or financial emergency...')}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-stone-900 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? t('জমা হচ্ছে...', 'Submitting...') : t('সাহায্যের আবেদন জমা দিন', 'Submit Welfare Request')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
