import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { Member } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { PlusCircle, Edit, User, Phone, Globe, X } from 'lucide-react';

export const AdminMembers: React.FC = () => {
  const { lang, t } = useLanguage();
  const { showToast } = useNotification();
  const isBn = lang === 'bn';

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [memberId, setMemberId] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('সৌদি আরব');
  const [city, setCity] = useState('রিয়াদ');
  const [village, setVillage] = useState('উমারখালী');
  const [designationBn, setDesignationBn] = useState('সদস্য');
  const [monthlyPledgeAmount, setMonthlyPledgeAmount] = useState('1000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    fetch('/api/members')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setMembers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleOpenCreate = () => {
    setEditingMember(null);
    setMemberId(`MEM-00${members.length + 1}`);
    setNameBn('');
    setNameEn('');
    setPhone('');
    setCountry('সৌদি আরব');
    setCity('রিয়াদ');
    setVillage('উমারখালী');
    setDesignationBn('সদস্য');
    setMonthlyPledgeAmount('1000');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setMemberId(m.memberId);
    setNameBn(m.nameBn);
    setNameEn(m.nameEn);
    setPhone(m.phone);
    setCountry(m.country);
    setCity(m.city || '');
    setVillage(m.village);
    setDesignationBn(m.designationBn || 'সদস্য');
    setMonthlyPledgeAmount(String(m.monthlyPledgeAmount || 1000));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn || !phone) {
      showToast(t('নাম ও ফোন নম্বর দিন', 'Name and phone required'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        memberId,
        nameBn,
        nameEn: nameEn || nameBn,
        phone,
        country,
        city,
        village,
        designationBn,
        designationEn: designationBn,
        role: editingMember ? editingMember.role : 'member',
        monthlyPledgeAmount: Number(monthlyPledgeAmount),
        joiningDate: editingMember ? editingMember.joiningDate : new Date().toISOString().split('T')[0],
        isActive: true,
      };

      const url = editingMember ? `/api/members/${editingMember.id}` : '/api/members';
      const method = editingMember ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(t('সদস্যের তথ্য সফলভাবে সংরক্ষিত হয়েছে', 'Member saved successfully'), 'success');
        setIsModalOpen(false);
        fetchMembers();
      } else {
        showToast(t('সংরক্ষণ ব্যর্থ হয়েছে', 'Save failed'), 'error');
      }
    } catch (e) {
      console.error(e);
      showToast(t('সার্ভার ত্রুটি', 'Server error'), 'error');
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
            {t('সদস্য তালিকা ও অঙ্গীকার ব্যবস্থাপনা', 'Members & Monthly Pledges Directory')}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {t('প্রবাসী ও স্থানীয় সদস্যদের প্রোফাইল, মাসিক চাঁদা অঙ্গীকার ও যোগাযোগের তথ্য।', 'Manage member profiles, diaspora locations, and monthly commitments.')}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('+ নতুন সদস্য যুক্ত করুন', '+ Add New Member')}</span>
        </button>
      </div>

      {/* Members Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 font-semibold">
            <tr>
              <th className="px-4 py-3">{t('আইডি', 'ID')}</th>
              <th className="px-4 py-3">{t('নাম ও পদবী', 'Name & Role')}</th>
              <th className="px-4 py-3">{t('প্রবাসী দেশ / অবস্থান', 'Location')}</th>
              <th className="px-4 py-3">{t('গ্রাম', 'Village')}</th>
              <th className="px-4 py-3">{t('মোবাইল নম্বর', 'Phone')}</th>
              <th className="px-4 py-3 text-right">{t('মাসিক অঙ্গীকার', 'Monthly Pledge')}</th>
              <th className="px-4 py-3 text-center">{t('অ্যাকশন', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            {members.map(m => (
              <tr key={m.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-mono font-bold text-emerald-800">{m.memberId}</td>
                <td className="px-4 py-3">
                  <div className="font-bold text-stone-900">{isBn ? m.nameBn : m.nameEn}</div>
                  <div className="text-[11px] text-stone-500">{isBn ? m.designationBn : m.designationEn}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-stone-800">{m.country}</span>
                  <span className="text-[11px] text-stone-400 block">{m.city}</span>
                </td>
                <td className="px-4 py-3 text-stone-600">{m.village}</td>
                <td className="px-4 py-3 font-mono text-stone-700">{m.phone}</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-800">
                  {formatCurrency(m.monthlyPledgeAmount || 1000, isBn)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-1.5 text-stone-500 hover:text-emerald-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Create/Edit Member */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold font-serif text-stone-900 text-base">
                {editingMember ? t('সদস্য তথ্য সম্পাদনা', 'Edit Member') : t('নতুন সদস্য নিবন্ধন', 'Add New Member')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('সদস্য আইডি *', 'Member ID *')}</label>
                  <input
                    type="text"
                    required
                    value={memberId}
                    onChange={e => setMemberId(e.target.value)}
                    className="w-full px-3 py-1.5 font-mono font-bold text-stone-900 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('মাসিক অঙ্গীকার (৳) *', 'Monthly Pledge (BDT) *')}</label>
                  <input
                    type="number"
                    required
                    value={monthlyPledgeAmount}
                    onChange={e => setMonthlyPledgeAmount(e.target.value)}
                    className="w-full px-3 py-1.5 font-mono font-bold text-stone-900 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">{t('নাম (বাংলা) *', 'Full Name (Bangla) *')}</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: তারেক মাহমুদ"
                  value={nameBn}
                  onChange={e => setNameBn(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-stone-900 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('ফোন নম্বর *', 'Phone *')}</label>
                  <input
                    type="text"
                    required
                    placeholder="+966 50..."
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 font-mono text-stone-900 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('পদবী', 'Designation')}</label>
                  <input
                    type="text"
                    value={designationBn}
                    onChange={e => setDesignationBn(e.target.value)}
                    className="w-full px-3 py-1.5 text-stone-900 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('প্রবাসী দেশ', 'Country')}</label>
                  <input
                    type="text"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full px-3 py-1.5 text-stone-900 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('শহর / কর্মক্ষেত্র', 'City')}</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-1.5 text-stone-900 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-sm"
                >
                  {isSubmitting ? t('সংরক্ষণ হচ্ছে...', 'Saving...') : t('সংরক্ষণ করুন', 'Save Member')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
