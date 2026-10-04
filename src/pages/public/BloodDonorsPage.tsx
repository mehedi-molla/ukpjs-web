import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { BloodDonor, BloodGroup } from '../../types';
import { formatDate, toBengaliNumber } from '../../utils/formatters';
import { 
  Heart, 
  Search, 
  PhoneCall, 
  MapPin, 
  PlusCircle, 
  CheckCircle2, 
  Calendar,
  X,
  Droplet
} from 'lucide-react';

export const BloodDonorsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { showToast } = useNotification();
  const isBn = lang === 'bn';

  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Register donor modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('উমারখালী, কিস্তুপুর');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = () => {
    fetch('/api/blood-donors')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setDonors(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const filteredDonors = donors.filter(d => {
    if (selectedGroup !== 'all' && d.bloodGroup !== selectedGroup) return false;
    if (search) {
      const q = search.toLowerCase();
      const donorName = (d.name || d.nameBn || d.nameEn || '').toLowerCase();
      const donorPhone = (d.phone || '').toLowerCase();
      const donorArea = (d.area || d.areaBn || d.areaEn || '').toLowerCase();
      return (
        donorName.includes(q) ||
        donorPhone.includes(q) ||
        donorArea.includes(q)
      );
    }
    return true;
  });

  const handleRegisterDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      showToast(t('নাম ও ফোন নম্বর দিন', 'Name and phone required'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        bloodGroup,
        phone,
        area,
        lastDonationDate: lastDonationDate || undefined,
        isAvailable: true,
      };

      const res = await fetch('/api/blood-donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(t('ধন্যবাদ! রক্তদাতা হিসেবে নাম নিবন্ধিত হয়েছে।', 'Thank you! Registered as blood donor.'), 'success');
        setIsModalOpen(false);
        setName('');
        setPhone('');
        fetchDonors();
      } else {
        showToast('নিবন্ধন ব্যর্থ হয়েছে', 'error');
      }
    } catch {
      showToast('নেটওয়ার্ক ত্রুটি', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-800 rounded-full text-xs font-semibold mb-2">
            <Droplet className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span>{t('জরুরি মুমূর্ষু রোগীর জীবন বাঁচাতে', 'Save Lives in Medical Emergency')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            {t('স্বেচ্ছাসেবী রক্তদাতা ডিরেক্টরি', 'Voluntary Blood Donors Directory')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            {t(
              'উমারখালী ও কিস্তুপুর এলাকার স্বেচ্ছাসেবী রক্তদাতাদের তালিকা। যেকোনো অপারেশনে বা ডেলিভারির সময় জরুরি রক্তের প্রয়োজনে সরাসরি যোগাযোগ করুন।',
              'Connect immediately with verified voluntary blood donors across the region in case of accidents or urgent hospitalization.'
            )}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('রক্তদাতা হিসেবে নাম নিবন্ধন', 'Register as Donor')}</span>
        </button>
      </div>

      {/* Filter by Blood Group and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Blood group tags */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedGroup === 'all'
                ? 'bg-rose-700 text-white shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t('সকল গ্রুপ', 'All Groups')}
          </button>
          {bloodGroups.map(bg => (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap font-mono cursor-pointer ${
                selectedGroup === bg
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('নাম বা এলাকা দিয়ে খুঁজুন...', 'Search name or area...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
        </div>

      </div>

      {/* Donors Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-400">
          {t('রক্তদাতা তালিকা লোড হচ্ছে...', 'Loading blood donors...')}
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="py-16 text-center bg-stone-50 rounded-2xl border border-stone-200">
          <p className="text-sm text-stone-500">
            {t('এই গ্রুপের কোনো রক্তদাতা খুঁজে পাওয়া যায়নি।', 'No donors found for this blood group.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDonors.map(donor => (
            <div
              key={donor.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:border-rose-200 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-serif">
                    {donor.name || (isBn ? donor.nameBn : donor.nameEn) || 'স্বেচ্ছাসেবী ভাই'}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{donor.area || (isBn ? donor.areaBn : donor.areaEn) || 'উমারখালী, কিস্তুপুর'}</span>
                  </div>
                  {donor.lastDonationDate && (
                    <div className="flex items-center gap-1 text-[11px] text-stone-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{t('শেষ দান:', 'Last donated:')} {formatDate(donor.lastDonationDate, isBn)}</span>
                    </div>
                  )}
                </div>

                <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-mono font-black text-base flex items-center justify-center shadow-xs">
                  {donor.bloodGroup}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block">{t('যোগাযোগ নম্বর:', 'Contact:')}</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">{donor.phone}</span>
                </div>
                <a
                  href={`tel:${donor.phone}`}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{t('কল করুন', 'Call')}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Register Donor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-stone-900 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 font-serif">
                {t('রক্তদাতা হিসেবে নাম নিবন্ধন', 'Register as Blood Donor')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterDonor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">{t('আপনার নাম *', 'Full Name *')}</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: তারেক মাহমুদ"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('রক্তের গ্রুপ *', 'Blood Group *')}</label>
                  <select
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3 py-2 text-sm font-mono font-bold text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('মোবাইল নম্বর *', 'Phone Number *')}</label>
                  <input
                    type="text"
                    required
                    placeholder="01712-XXXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">{t('গ্রাম / এলাকা', 'Area / Village')}</label>
                <input
                  type="text"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">{t('সর্বশেষ রক্তদানের তারিখ (ঐচ্ছিক)', 'Last Donation Date (Optional)')}</label>
                <input
                  type="date"
                  value={lastDonationDate}
                  onChange={e => setLastDonationDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-stone-900 border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
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
                  className="px-5 py-2 font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm"
                >
                  {isSubmitting ? t('সংরক্ষণ হচ্ছে...', 'Saving...') : t('নিবন্ধন সম্পন্ন করুন', 'Complete Registration')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
