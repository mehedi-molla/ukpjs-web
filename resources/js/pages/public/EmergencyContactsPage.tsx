import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { ImportantContact } from '../../types';
import { 
  PhoneCall, 
  Phone, 
  MessageSquare, 
  Search, 
  MapPin, 
  Car, 
  Truck, 
  HeartPulse, 
  ShieldAlert, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  Award, 
  Users, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Check, 
  Flame, 
  Building2, 
  Radio,
  Ambulance,
  Stethoscope
} from 'lucide-react';

export const EmergencyContactsPage: React.FC<{ initialContacts?: ImportantContact[] }> = ({ initialContacts }) => {
  const { lang, t } = useLanguage();
  const { showToast } = useNotification();
  const isBn = lang === 'bn';

  const [contacts] = useState<ImportantContact[]>(initialContacts ?? []);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'emergency' | 'verified'>('all');
  const [search, setSearch] = useState('');
  const loading = false;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPhone = (id: string, phone: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    showToast(t(`নম্বর কপি করা হয়েছে: ${phone}`, `Copied number: ${phone}`), 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatWhatsAppUrl = (number: string) => {
    const clean = number.replace(/[^0-9]/g, '');
    const full = clean.startsWith('88') ? clean : clean.startsWith('0') ? `88${clean}` : `880${clean}`;
    return `https://wa.me/${full}`;
  };

  // 5 Structured Categories matching prompt
  const categoryGroups = [
    {
      id: 'admin',
      nameBn: '১. উপজেলা ও থানা প্রশাসন',
      nameEn: '1. Upazila & Thana Administration',
      descBn: 'বদরপাশা ইউপি কার্যালয়, রাজৈর থানা, ইউএনও অফিস ও ফায়ার সার্ভিস',
      descEn: 'Badarpasha UP, Rajoir Thana Police, UNO Office & Fire Service',
      icon: ShieldAlert,
      filter: (c: ImportantContact) => 
        c.category === 'police' || 
        c.category === 'administration' || 
        c.category === 'fire_service' ||
        c.category === 'chairman' ||
        c.category === 'ward_member' ||
        c.category === 'women_member' ||
        c.categoryNameBn?.includes('উপজেলা') ||
        c.categoryNameBn?.includes('প্রশাসন') ||
        c.categoryNameBn?.includes('চেয়ারম্যান') ||
        c.categoryNameBn?.includes('মেম্বার')
    },
    {
      id: 'health',
      nameBn: '২. ডাক্তার ও স্বাস্থ্য সেবা',
      nameEn: '2. Doctors & Healthcare Services',
      descBn: 'রাজৈর উপজেলা স্বাস্থ্য কমপ্লেক্স, বিশেষজ্ঞ ডাক্তারদের তালিকা, স্থানীয় ডাক্তার ও হেলথ সেন্টার',
      descEn: 'Rajoir Upazila Health Complex, Specialist Doctors, Local Physicians & Health Center',
      icon: Stethoscope,
      filter: (c: ImportantContact) => 
        (c.category === 'hospital' || 
        c.category === 'doctor' || 
        c.categoryNameBn?.includes('হাসপাতাল') ||
        c.categoryNameBn?.includes('স্বাস্থ্য') ||
        c.categoryNameBn?.includes('ডাক্তার')) &&
        c.category !== 'pharmacy' &&
        !c.categoryNameBn?.includes('ফার্মেসি')
    },
    {
      id: 'pharmacy',
      nameBn: '৩. ফার্মেসি ও ঔষধ',
      nameEn: '3. Pharmacy & Medicines',
      descBn: 'স্থানীয় ২৪/৭ ফার্মেসির নাম ও জরুরি জীবনরক্ষাকারী ঔষধ সরবরাহ ফোন নম্বর',
      descEn: 'Local 24/7 Pharmacies, Life-saving Medicines & Emergency Contacts',
      icon: HeartPulse,
      filter: (c: ImportantContact) => 
        c.category === 'pharmacy' || 
        c.categoryNameBn?.includes('ফার্মেসি') ||
        c.categoryNameBn?.includes('ঔষধ') ||
        c.nameBn?.includes('ফার্মেসি')
    },
    {
      id: 'vehicles',
      nameBn: '৪. জরুরি যানবাহন ও এ্যাম্বুলেন্স',
      nameEn: '4. Emergency Vehicles & Ambulance',
      descBn: 'এ্যাম্বুলেন্স (Ambulance), মাইক্রোবাস (Microbus), অটো/ভ্যান (Auto/Van)',
      descEn: 'Ambulance, Microbus, Auto/Van verified driver contacts',
      icon: Ambulance,
      filter: (c: ImportantContact) => 
        c.category === 'ambulance' || 
        c.category === 'microbus' || 
        c.category === 'driver' || 
        c.category === 'auto_cng' || 
        c.category === 'auto_driver' || 
        c.category === 'autorickshaw' ||
        c.categoryNameBn?.includes('যানবাহন') ||
        c.categoryNameBn?.includes('এ্যাম্বুলেন্স') ||
        c.categoryNameBn?.includes('অ্যাম্বুলেন্স') ||
        c.categoryNameBn?.includes('মাইক্রোবাস') ||
        c.categoryNameBn?.includes('অটো')
    },
    {
      id: 'national',
      nameBn: '৫. জাতীয় হেল্পলাইন',
      nameEn: '5. National Emergency Helplines',
      descBn: 'জরুরি জাতীয় হটলাইন: ৯৯৯, ৩৩৩, ১০৯ (২৪ ঘণ্টা টোল-ফ্রি)',
      descEn: 'National Emergency Toll-Free Numbers: 999, 333, 109',
      icon: Radio,
      filter: (c: ImportantContact) => 
        c.category === 'national_helpline' || 
        c.category === 'emergency_service' ||
        c.phone === '999' || 
        c.phone === '333' || 
        c.phone === '109' ||
        c.categoryNameBn?.includes('জাতীয়') ||
        c.categoryNameBn?.includes('জাতীয় হেল্পলাইন')
    }
  ];

  // Contacts matching search and mode
  const filteredContacts = contacts.filter(c => {
    // Mode filter
    if (filterMode === 'emergency' && !c.isEmergency) return false;
    if (filterMode === 'verified' && !c.isVerified) return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = (c.nameBn && c.nameBn.toLowerCase().includes(q)) || (c.nameEn && c.nameEn.toLowerCase().includes(q));
      const matchPhone = (c.phone && c.phone.includes(q)) || (c.altPhone && c.altPhone.includes(q)) || (c.whatsapp && c.whatsapp.includes(q));
      const matchArea = (c.area && c.area.toLowerCase().includes(q)) || (c.serviceAreaBn && c.serviceAreaBn.toLowerCase().includes(q)) || (c.ward && c.ward.toLowerCase().includes(q));
      const matchVehicle = (c.vehicleType && c.vehicleType.toLowerCase().includes(q)) || (c.vehicleModel && c.vehicleModel.toLowerCase().includes(q)) || (c.vehicleNumber && c.vehicleNumber.toLowerCase().includes(q));
      const matchRole = (c.designationBn && c.designationBn.toLowerCase().includes(q)) || (c.categoryNameBn && c.categoryNameBn.toLowerCase().includes(q)) || (c.driverName && c.driverName.toLowerCase().includes(q));
      return matchName || matchPhone || matchArea || matchVehicle || matchRole;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      
      {/* 1. TOP NATIONAL EMERGENCY HOTLINE BANNER STRIP */}
      <div className="bg-rose-900 text-rose-100 border-b border-rose-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
            <span className="font-bold text-white tracking-wide">
              {t('জাতীয় জরুরি হটলাইন সমূহ:', 'National Emergency Hotlines:')}
            </span>
            <span className="hidden sm:inline text-rose-200">
              {t('টোল-ফ্রি ও ২৪ ঘণ্টা সক্রিয়', 'Toll-free & 24/7 active')}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 font-mono font-bold text-white flex-wrap">
            <a href="tel:999" className="hover:underline flex items-center gap-1.5 bg-rose-800/90 px-3 py-1 rounded-lg">
              <PhoneCall className="w-3.5 h-3.5 text-rose-300" />
              <span>৯৯৯ ({t('পুলিশ/অ্যাম্বুলেন্স/ফায়ার', 'Police/Ambulance/Fire')})</span>
            </a>
            <a href="tel:333" className="hover:underline flex items-center gap-1 bg-rose-800/90 px-3 py-1 rounded-lg">
              <span>৩৩৩ ({t('সরকারি সেবা ও তথ্য', 'Govt Info')})</span>
            </a>
            <a href="tel:109" className="hidden sm:flex items-center gap-1 bg-rose-800/90 px-3 py-1 rounded-lg">
              <span>১০৯ ({t('নারী ও শিশু সহায়তা', 'Women & Child Help')})</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. HERO / HEADER SECTION */}
      <section className="bg-white border-b border-stone-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold mb-3 border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('জরুরি সেবা ও জনপ্রতিনিধি ডিরেক্টরি', 'Emergency Services & Public Representatives')}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight leading-snug">
              {t('বদরপাশা ইউনিয়ন পরিষদ ও জরুরি সেবা নির্দেশিকা', 'Badarpasha UP & Emergency Services Directory')}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
              {t(
                'উপজেলা ও থানা প্রশাসন, হাসপাতাল ও স্বাস্থ্য সেবা, জরুরি যানবাহন এবং জাতীয় হেল্পলাইনের সরাসরি যাচাইকৃত মোবাইল নম্বর। যেকোনো জরুরি প্রয়োজনে সরাসরি কল করার সুব্যবস্থা।',
                'Comprehensive verified directory for Thana administration, hospitals, emergency ambulance & transports, and national helplines.'
              )}
            </p>
          </div>

          {/* Search & Quick Filters Bar */}
          <div className="mt-6 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('নাম, পদবী, থানা, হাসপাতাল, অ্যাম্বুলেন্স বা নম্বর দিয়ে খুঁজুন...', 'Search by name, hospital, police, ambulance or phone...')}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all shadow-inner"
                />
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 font-bold px-1.5 py-0.5"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter chips */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl self-start md:self-auto border border-stone-200">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    filterMode === 'all'
                      ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t('সকল', 'All')} ({contacts.length})
                </button>
                <button
                  onClick={() => setFilterMode('emergency')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    filterMode === 'emergency'
                      ? 'bg-rose-700 text-white shadow-sm'
                      : 'text-stone-600 hover:text-rose-700'
                  }`}
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>{t('জরুরি সেবা', 'Emergency')}</span>
                </button>
                <button
                  onClick={() => setFilterMode('verified')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    filterMode === 'verified'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-stone-600 hover:text-emerald-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('যাচাইকৃত', 'Verified')}</span>
                </button>
              </div>
            </div>

            {/* 5 Structured Category Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer col-span-2 sm:col-span-1 ${
                  activeCategory === 'all'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                }`}
              >
                <span>{t('সকল ক্যাটাগরি', 'All Categories')}</span>
              </button>

              {categoryGroups.map(grp => {
                const count = contacts.filter(grp.filter).length;
                const Icon = grp.icon;
                return (
                  <button
                    key={grp.id}
                    onClick={() => setActiveCategory(grp.id)}
                    className={`px-3 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                      activeCategory === grp.id
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{isBn ? grp.nameBn.replace(/^\d+\.\s*/, '') : grp.nameEn.replace(/^\d+\.\s*/, '')}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeCategory === grp.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN 4-CATEGORY STRUCTURED DIRECTORY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-stone-500">{t('যোগাযোগ ও সেবা তালিকা লোড হচ্ছে...', 'Loading emergency contacts...')}</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-900">{t('কোনো ফলাফল পাওয়া যায়নি', 'No Contacts Found')}</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
              {t('আপনার অনুসন্ধানের সাথে মিল রেখে কোনো যোগাযোগ পাওয়া যায়নি। ফিল্টার রিসেট করুন।', 'No contacts match your query. Try resetting filters.')}
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearch(''); setFilterMode('all'); }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
            >
              {t('সকল যোগাযোগ পুনরায় দেখুন', 'Reset All Filters')}
            </button>
          </div>
        ) : (
          categoryGroups.map(grp => {
            if (activeCategory !== 'all' && activeCategory !== grp.id) {
              return null;
            }

            const groupContacts = filteredContacts.filter(grp.filter);
            if (groupContacts.length === 0) return null;

            const Icon = grp.icon;

            return (
              <section key={grp.id} className="space-y-5">
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-stone-200 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                        {isBn ? grp.nameBn : grp.nameEn}
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {isBn ? grp.descBn : grp.descEn}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full self-start sm:self-auto">
                    {groupContacts.length} {t('টি যোগাযোগ', 'Contacts')}
                  </span>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupContacts.map(c => {
                    const isNational = grp.id === 'national';
                    const isAmbulanceOrVehicle = grp.id === 'vehicles' || c.category === 'ambulance';
                    const hasPhoto = Boolean(c.photoUrl || c.vehiclePhotoUrl);

                    return (
                      <div
                        key={c.id}
                        className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                          isNational 
                            ? 'border-rose-300 shadow-md hover:border-rose-500 bg-gradient-to-b from-rose-50/40 to-white' 
                            : isAmbulanceOrVehicle && c.category === 'ambulance'
                            ? 'border-rose-200 shadow-md hover:border-rose-400'
                            : 'border-stone-200 shadow-sm hover:shadow-md hover:border-emerald-300'
                        }`}
                      >
                        <div>
                          {/* Optional Vehicle or Profile Photo Banner */}
                          {hasPhoto && (
                            <div className="relative w-full h-44 bg-stone-100 overflow-hidden border-b border-stone-100">
                              <img
                                src={c.vehiclePhotoUrl || c.photoUrl}
                                alt={c.nameBn}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/75 text-white backdrop-blur-sm">
                                  {c.categoryNameBn || c.designationBn}
                                </span>
                                {c.isEmergency && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                                    {t('জরুরি', 'Emergency')}
                                  </span>
                                )}
                              </div>
                              {c.vehicleNumber && (
                                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-white/95 text-stone-900 shadow-sm font-semibold">
                                  {c.vehicleNumber}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="p-5 space-y-3">
                            {/* Header details */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    {c.categoryNameBn || c.designationBn}
                                  </span>
                                  {c.isVerified && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200" title="Verified">
                                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                      <span>{t('যাচাইকৃত', 'Verified')}</span>
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-base font-bold text-stone-900 leading-snug">
                                  {isBn ? c.nameBn : c.nameEn}
                                </h3>
                                {c.designationBn && c.designationBn !== c.categoryNameBn && (
                                  <p className="text-xs text-emerald-800 font-semibold truncate">
                                    {c.designationBn}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Driver / Institution / Route Info */}
                            {c.driverName && (
                              <p className="text-xs text-stone-600">
                                <span className="text-stone-400 font-medium">{t('চালক / প্রতিনিধি:', 'Driver/Person:')}</span>{' '}
                                <strong className="text-stone-800">{c.driverName}</strong>
                              </p>
                            )}

                            {c.institutionName && (
                              <p className="text-xs text-stone-600">
                                <span className="text-stone-400 font-medium">{t('প্রতিষ্ঠান:', 'Institution:')}</span>{' '}
                                <strong className="text-stone-800">{c.institutionName}</strong>
                              </p>
                            )}

                            {(c.area || c.serviceAreaBn || c.addressBn) && (
                              <div className="text-xs text-stone-500 flex items-start gap-1">
                                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{c.serviceAreaBn || c.area || c.addressBn}</span>
                              </div>
                            )}

                            {c.availabilityBn && (
                              <div className="text-[11px] text-stone-600 flex items-center gap-1.5 pt-0.5">
                                <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                <span>{c.availabilityBn}</span>
                              </div>
                            )}

                            {c.descriptionBn && (
                              <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/80 leading-relaxed line-clamp-3">
                                {c.descriptionBn}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Bottom Phone & Direct Action Bar */}
                        <div className="p-4 bg-stone-50 border-t border-stone-100 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[10px] text-stone-400 font-medium">{t('মোবাইল / হটলাইন:', 'Phone / Hotline:')}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-stone-900 text-sm">{c.phone}</span>
                              <button
                                onClick={(e) => handleCopyPhone(c.id, c.phone, e)}
                                title={t('নম্বর কপি করুন', 'Copy Phone')}
                                className="p-1 text-stone-400 hover:text-stone-700 rounded bg-white border border-stone-200 cursor-pointer"
                              >
                                {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            {c.whatsapp && (
                              <a
                                href={formatWhatsAppUrl(c.whatsapp)}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors border border-emerald-200"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                                <span>{t('হোয়াটসঅ্যাপ', 'WhatsApp')}</span>
                              </a>
                            )}

                            <a
                              href={`tel:${c.phone}`}
                              className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                                isNational || (c.isEmergency && c.category === 'ambulance')
                                  ? 'bg-rose-700 hover:bg-rose-600 text-white'
                                  : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>{t('সরাসরি কল দিন', 'Call Directly')}</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </main>

    </div>
  );
};
