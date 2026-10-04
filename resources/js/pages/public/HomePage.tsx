import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Project, FinancialSummary, ImportantContact, Notice } from '../../types';
import { formatCurrency, toBengaliNumber, formatDate } from '../../utils/formatters';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowRight, 
  PhoneCall, 
  ShieldCheck, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  HeartHandshake,
  Lightbulb,
  TreeDeciduous,
  Moon,
  Sparkles,
  Building2,
  MessageCircle,
  ShieldAlert,
  Stethoscope,
  Pill,
  Ambulance,
  Radio,
  Car
} from 'lucide-react';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
  setSelectedProjectSlug?: (slug: string) => void;
  initialData?: {
    financials?: FinancialSummary | null;
    projects?: Project[];
    contacts?: ImportantContact[];
    notices?: Notice[];
  };
}

// Fallback Chairman Data
const fallbackChairman: ImportantContact = {
  id: 'cnt-chairman-1',
  nameBn: 'জনাব মোঃ আফতাব উদ্দিন শেখ',
  nameEn: 'Janab Md. Aftab Uddin Sheikh',
  category: 'chairman',
  categoryNameBn: 'ইউপি চেয়ারম্যান (Chairman)',
  designationBn: 'চেয়ারম্যান — ১০নং বদরপাশা ইউনিয়ন পরিষদ',
  designationEn: 'Chairman — 10 No. Badarpasha Union Parishad',
  unionName: '১০নং বদরপাশা ইউনিয়ন পরিষদ',
  ward: 'ইউপি পরিষদ কমপ্লেক্স',
  area: '১০নং বদরপাশা ইউনিয়ন, রাজৈর',
  phone: '01711-889900',
  altPhone: '01911-332211',
  whatsapp: '+8801711889900',
  addressBn: 'ইউপি কমপ্লেক্স ভবন, বদরপাশা, রাজৈর',
  descriptionBn: 'বদরপাশা ইউনিয়নবাসীর যেকোনো দাপ্তরিক সনদ, জন্ম নিবন্ধন ও সামাজিক সমস্যা নিরসনে সকাল ৯টা থেকে বিকাল ৫টা পর্যন্ত সরাসরি ইউপি কার্যালয়ে সাক্ষাৎ করুন। ১০নং বদরপাশা ইউনিয়ন পরিষদের সার্বিক উন্নয়ন ও নাগরিক সেবায় আমরা সর্বদা নিবেদিত।',
  photoUrl: '/images/chairman_portrait_1790160770116.jpg',
  isEmergency: false,
  isVerified: true,
  isPublished: true,
  isDemoPlaceholder: true,
};

// Fallback Female Member Data (No description text)
const fallbackFemaleMember: ImportantContact = {
  id: 'cnt-women-member-1',
  nameBn: 'মোছাঃ পারভীন আক্তার',
  nameEn: 'Mst. Parvin Akhter',
  category: 'women_member',
  categoryNameBn: 'মহিলা সদস্য (সংরক্ষিত)',
  designationBn: 'মহিলা সদস্য — সংরক্ষিত ৪, ৫ ও ৬ নং ওয়ার্ড',
  designationEn: 'Female Member — Reserved Wards 4, 5 & 6',
  unionName: '১০নং বদরপাশা ইউনিয়ন পরিষদ',
  ward: 'সংরক্ষিত ওয়ার্ড: ৪, ৫ ও ৬',
  area: 'বদরপাশা ইউনিয়ন, রাজৈর',
  phone: '01760-445566',
  altPhone: '01960-112233',
  whatsapp: '+8801760445566',
  addressBn: 'বদরপাশা, রাজৈর',
  descriptionBn: '',
  photoUrl: '/images/female_member_1790160802115.jpg',
  isEmergency: false,
  isVerified: true,
  isPublished: true,
  isDemoPlaceholder: true,
};

// Fallback Ward Members Data (No description text)
const fallbackWardMembers: ImportantContact[] = [
  {
    id: 'cnt-ward-5',
    nameBn: 'মোঃ রফিকুল ইসলাম বিশ্বাস',
    nameEn: 'Md. Rafiqul Islam Biswas',
    category: 'ward_member',
    categoryNameBn: 'ওয়ার্ড সদস্য',
    designationBn: 'ওয়ার্ড সদস্য — ৫ নং ওয়ার্ড',
    designationEn: 'Ward Member — Ward No. 5',
    ward: '৫ নং ওয়ার্ড',
    unionName: '১০নং বদরপাশা ইউনিয়ন পরিষদ',
    area: '৫ নং ওয়ার্ড, বদরপাশা ইউনিয়ন',
    phone: '01720-334455',
    altPhone: '01820-998877',
    whatsapp: '+8801720334455',
    addressBn: 'বদরপাশা, ৫ নং ওয়ার্ড',
    descriptionBn: '',
    photoUrl: '/images/ward_member_1790160878758.jpg',
    isEmergency: false,
    isVerified: true,
    isPublished: true,
    isDemoPlaceholder: true,
  },
  {
    id: 'cnt-ward-4',
    nameBn: 'মোঃ মতিউর রহমান মণ্ডল',
    nameEn: 'Md. Motiur Rahman Mondol',
    category: 'ward_member',
    categoryNameBn: 'ওয়ার্ড সদস্য',
    designationBn: 'ওয়ার্ড সদস্য — ৪ নং ওয়ার্ড',
    designationEn: 'Ward Member — Ward No. 4',
    ward: '৪ নং ওয়ার্ড',
    unionName: '১০নং বদরপাশা ইউনিয়ন পরিষদ',
    area: '৪ নং ওয়ার্ড, বদরপাশা ইউনিয়ন',
    phone: '01735-112233',
    whatsapp: '+8801735112233',
    addressBn: 'বদরপাশা, ৪ নং ওয়ার্ড',
    descriptionBn: '',
    photoUrl: '/images/ward_member_four_1790162085034.jpg',
    isEmergency: false,
    isVerified: true,
    isPublished: true,
    isDemoPlaceholder: true,
  },
  {
    id: 'cnt-ward-6',
    nameBn: 'মোঃ এনামুল হক',
    nameEn: 'Md. Enamul Haque',
    category: 'ward_member',
    categoryNameBn: 'ওয়ার্ড সদস্য',
    designationBn: 'ওয়ার্ড সদস্য — ৬ নং ওয়ার্ড',
    designationEn: 'Ward Member — Ward No. 6',
    ward: '৬ নং ওয়ার্ড',
    unionName: '১০নং বদরপাশা ইউনিয়ন পরিষদ',
    area: '৬ নং ওয়ার্ড, বদরপাশা ইউনিয়ন',
    phone: '01744-556677',
    whatsapp: '+8801744556677',
    addressBn: 'বদরপাশা, ৬ নং ওয়ার্ড',
    descriptionBn: '',
    photoUrl: '/images/ward_member_six_1790162098913.jpg',
    isEmergency: false,
    isVerified: true,
    isPublished: true,
    isDemoPlaceholder: true,
  },
];

// The homepage never invents representative identities or phone numbers when
// the administrator has not configured the contact directory yet.
const makeUnconfiguredContact = (id: string, category: ImportantContact['category'], categoryName: string): ImportantContact => ({
  id,
  category,
  categoryNameBn: categoryName,
  categoryNameEn: categoryName,
  nameBn: 'Representative information not configured',
  nameEn: 'Representative information not configured',
  designationBn: categoryName,
  designationEn: categoryName,
  phone: '',
  isEmergency: false,
  isVerified: false,
  isPublished: false,
  isDemoPlaceholder: true,
});

const safeFallbackChairman = makeUnconfiguredContact('unconfigured-chairman', 'chairman', 'Chairman');
const safeFallbackFemaleMember = makeUnconfiguredContact('unconfigured-women-member', 'women_member', 'Women Member');
const safeFallbackWardMembers = [
  makeUnconfiguredContact('unconfigured-ward-member', 'ward_member', 'Ward Member'),
];

export const HomePage: React.FC<HomePageProps> = ({ setCurrentPage, setSelectedProjectSlug, initialData }) => {
  const { lang, t } = useLanguage();
  const isBn = lang === 'bn';

  const [financials, setFinancials] = useState<FinancialSummary | null>(initialData?.financials ?? null);
  const [projects, setProjects] = useState<Project[]>(initialData?.projects ?? []);
  const [contacts, setContacts] = useState<ImportantContact[]>(initialData?.contacts ?? []);
  const [notices, setNotices] = useState<Notice[]>(initialData?.notices ?? []);
  const [loading] = useState(false);

  const completedProjects = projects.filter(p => p.status === 'completed');
  const runningProjects = projects.filter(p => p.status === 'running');
  const upcomingProjects = projects.filter(p => p.status === 'upcoming');

  // Dynamic Public Representatives extracted from contacts
  const chairman = contacts.find(c => (c.category === 'chairman' || c.categoryId === 'cat-c1') && c.isPublished !== false) || safeFallbackChairman;
  const femaleMember = contacts.find(c => (c.category === 'women_member' || c.categoryId === 'cat-c3') && c.isPublished !== false) || safeFallbackFemaleMember;
  const dbWardMembers = contacts.filter(c => (c.category === 'ward_member' || c.categoryId === 'cat-c2') && c.isPublished !== false);
  const wardMembers = dbWardMembers.length > 0 ? dbWardMembers : safeFallbackWardMembers;
  const wardMember = wardMembers[0] || safeFallbackWardMembers[0];

  // Emergency highlights only use administrator-supplied, verified contacts.
  const verifiedEmergencyContacts = contacts.filter(c => c.isEmergency && c.isPublished !== false && c.isVerified && !c.isDemoPlaceholder && Boolean(c.phone));
  const canCall = (contact: ImportantContact) => Boolean(contact.phone && contact.isVerified && !contact.isDemoPlaceholder);

  const handleProjectClick = (slug: string) => {
    if (setSelectedProjectSlug) setSelectedProjectSlug(slug);
    setCurrentPage('project-detail');
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0">
          <img
            src="/images/hero_community_welfare_1790158962676.jpg"
            alt="Umarkhali Kistupur Community Welfare"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 brightness-75 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-stone-900/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32 flex flex-col items-center text-center">
          
          {/* Subtle Bismillah Kicker */}
          <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-950/70 border border-emerald-500/30 rounded-full text-xs font-serif text-emerald-300 backdrop-blur-md">
            <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span aria-hidden="true">·</span>
            <span>{t('শরিয়াহসম্মত সমাজকল্যাণ', 'Islamic Social Welfare')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-white max-w-4xl leading-tight">
            {t('উমারখালী কিস্তুপুর প্রবাসী যুব সংঘ', 'Umarkhali Kistupur Probashi Jubo Songho')}
          </h1>

          <p className="mt-4 text-base sm:text-xl lg:text-2xl font-serif text-emerald-300 font-medium max-w-2xl">
            {t('মানবতার সেবায়, সমাজের কল্যাণে', 'In the Service of Humanity, for the Welfare of Society')}
          </p>

          <p className="mt-4 text-xs sm:text-base text-stone-300 max-w-2xl leading-relaxed">
            {t(
              'প্রবাসে কর্মরত ভাইদের ঘামঝরা উপার্জন ও স্থানীয় যুবকদের আন্তরিক শ্রমে এলাকার অসহায় মানুষের পাশে দাঁড়ানো, গ্রামীণ উন্নয়ন, মসজিদ সেবা এবং আলোকোজ্জ্বল জনপদ গড়ার অঙ্গীকার।',
              'A dedicated platform bridging diaspora expatriates and local youth for rural upliftment, mosque services, and helping the needy according to Islamic Shariah.'
            )}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setCurrentPage('projects')}
              className="px-6 py-3 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{t('আমাদের প্রকল্পসমূহ', 'Our Projects')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage('donation')}
              className="px-6 py-3 text-sm font-semibold text-stone-900 bg-white hover:bg-stone-100 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-700" />
              <span>{t('সহযোগিতা / হাদিয়া দিন', 'Support / Donate')}</span>
            </button>

            <button
              onClick={() => setCurrentPage('about')}
              className="px-5 py-3 text-sm font-semibold text-stone-200 hover:text-white bg-stone-800/80 hover:bg-stone-800 rounded-xl border border-stone-700 transition-all cursor-pointer"
            >
              {t('আমাদের সম্পর্কে', 'About Us')}
            </button>
          </div>

          {/* Quick Notice Banner if pinned */}
          {notices.length > 0 && (
            <div className="mt-10 max-w-2xl w-full p-3 bg-stone-800/90 border border-emerald-500/40 rounded-xl backdrop-blur-md flex items-center justify-between text-left text-xs gap-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold shrink-0">
                <Sparkles className="w-4 h-4" />
                <span>{t('জরুরি ঘোষণা:', 'Notice:')}</span>
              </div>
              <p className="text-stone-200 truncate flex-1">
                {isBn ? notices[0].titleBn : notices[0].titleEn}
              </p>
            </div>
          )}

        </div>
      </section>

      {/* 2. LOCAL CIVIC LEADERSHIP & REPRESENTATIVES (50/50 Split Layout Right Below Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-stone-100">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t('১০নং বদরপাশা ইউনিয়ন পরিষদ', '10 No. Badarpasha Union Parishad')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                {t('জনপ্রতিনিধিবৃন্দ - বদরপাশা ইউনিয়ন পরিষদ', 'Representatives - Badarpasha UP')}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed">
                {t(
                  '১০নং বদরপাশা ইউনিয়ন পরিষদের সম্মানিত চেয়ারম্যান, মহিলা সদস্য ও ওয়ার্ড সদস্যের পরিচিতি এবং নাগরিক যোগাযোগ নম্বর।',
                  'Elected Representatives of 10 No. Badarpasha Union Parishad - Chairman, Female Member and Ward Member.'
                )}
              </p>
            </div>

            <button
              onClick={() => setCurrentPage('emergency')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer shrink-0 shadow-2xs self-start md:self-auto"
            >
              <PhoneCall className="w-4 h-4 text-emerald-700" />
              <span>{t('জরুরি যোগাযোগ সেবা', 'Emergency Directory')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 50/50 Split Container: Left Side Chairman (50%), Right Side Members Section (50%) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            {/* LEFT SIDE (50% WIDTH): Chairman Section (Featured Photo, Name, Designation, Description/Message) */}
            <div className="bg-gradient-to-br from-emerald-50/80 via-white to-stone-50/70 rounded-2xl p-6 sm:p-7 border-2 border-emerald-600/35 hover:border-emerald-600/60 transition-all shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  {/* Large Featured Chairman Photo */}
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden bg-stone-100 border-2 border-emerald-700/30 shadow-md shrink-0 mx-auto sm:mx-0">
                    <img
                      src={chairman.photoUrl || '/images/chairman_portrait_1790160770116.jpg'}
                      alt={chairman.nameBn}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 p-1.5 bg-emerald-700 text-white rounded-full shadow-sm" title={t('যাচাইকৃত', 'Verified')}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Chairman Core Details */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-2xs">
                        {t('চেয়ারম্যান', 'Chairman')}
                      </span>
                      <span className="text-xs text-stone-600 font-medium">
                        {chairman.unionName || '১০নং বদরপাশা ইউনিয়ন পরিষদ'}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 leading-snug">
                      {isBn ? chairman.nameBn : chairman.nameEn}
                    </h3>
                    <p className="text-sm text-emerald-800 font-bold">
                      {isBn ? (chairman.designationBn || 'চেয়ারম্যান - ১০নং বদরপাশা ইউনিয়ন পরিষদ') : 'Chairman — 10 No. Badarpasha Union Parishad'}
                    </p>
                    <p className="text-xs text-stone-500 flex items-center justify-center sm:justify-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{chairman.area || chairman.addressBn || '১০নং বদরপাশা ইউনিয়ন, রাজৈর'}</span>
                    </p>
                  </div>
                </div>

                {/* Chairman Description / Message (Only the Chairman has Description) */}
                <div className="bg-white/90 p-4 rounded-xl border border-stone-200/90 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{t('চেয়ারম্যানের বক্তব্য ও নাগরিক বার্তা', "Chairman's Message & Civic Support")}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {chairman.descriptionBn || t(
                      'বদরপাশা ইউনিয়নবাসীর যেকোনো দাপ্তরিক সনদ, জন্ম নিবন্ধন ও সামাজিক সমস্যা নিরসনে সরাসরি ইউপি কার্যালয়ে সাক্ষাৎ করুন। ১০নং বদরপাশা ইউনিয়ন পরিষদের সার্বিক উন্নয়ন ও নাগরিক সেবায় আমরা সর্বদা নিবেদিত।',
                      'For any civic certificates, registration, or public matters, please reach out to the Union Parishad office.'
                    )}
                  </p>
                </div>
              </div>

              {/* Chairman Contact Buttons */}
              <div className="pt-4 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {canCall(chairman) ? <a
                    href={`tel:${chairman.phone}`}
                    className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span className="font-mono text-sm">{chairman.phone}</span>
                  </a> : <span className="text-xs text-stone-500">{t('যাচাইকৃত নম্বর প্রকাশিত হয়নি', 'Verified phone not published')}</span>}
                  {canCall(chairman) && chairman.whatsapp && (
                    <a
                      href={`https://wa.me/${chairman.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 rounded-xl flex items-center gap-1.5 transition-colors border border-emerald-300 shadow-2xs"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-800" />
                      <span>{t('হোয়াটসঅ্যাপ', 'WhatsApp')}</span>
                    </a>
                  )}
                </div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-lg">
                  {t('সাক্ষাৎ: সকাল ৯টা - বিকাল ৫টা', 'Hours: 9 AM - 5 PM')}
                </span>
              </div>
            </div>

            {/* RIGHT SIDE (50% WIDTH): Members Section (1 Female Member + 1 Word Member) - No description text */}
            <div className="flex flex-col gap-5 justify-between">
              
              {/* 1. Female Member Card (1 Female Member: Photo, Name, Designation, Ward No, Contact info - No description) */}
              <div className="bg-gradient-to-br from-rose-50/70 via-white to-purple-50/40 rounded-2xl p-5 sm:p-6 border-2 border-rose-500/30 hover:border-rose-500/50 transition-all shadow-xs flex flex-col justify-between space-y-4 flex-1">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Photo */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-stone-100 border-2 border-rose-500/25 shadow-sm shrink-0">
                    <img
                      src={femaleMember.photoUrl || '/images/female_member_1790160802115.jpg'}
                      alt={femaleMember.nameBn}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full shadow-2xs" title={t('যাচাইকৃত', 'Verified')}>
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Basic Details: Photo, Name, Designation, Ward Number */}
                  <div className="space-y-1.5 flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-2xs">
                        {t('মহিলা সদস্য', 'Female Member')}
                      </span>
                      <span className="text-[11px] font-semibold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded-md">
                        {femaleMember.ward || t('সংরক্ষিত ওয়ার্ড ৪, ৫ ও ৬', 'Reserved Ward 4, 5 & 6')}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold font-serif text-stone-900 leading-snug">
                      {isBn ? femaleMember.nameBn : femaleMember.nameEn}
                    </h4>
                    <p className="text-xs text-rose-800 font-semibold">
                      {isBn ? femaleMember.designationBn : femaleMember.designationEn}
                    </p>
                    <p className="text-[11px] text-stone-500 flex items-center justify-center sm:justify-start gap-1">
                      <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                      <span>{femaleMember.area || femaleMember.addressBn || 'বদরপাশা ইউনিয়ন, রাজৈর'}</span>
                    </p>
                  </div>
                </div>

                {/* Contact Info Bar */}
                <div className="pt-3 border-t border-rose-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {canCall(femaleMember) && <a
                      href={`tel:${femaleMember.phone}`}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-600 rounded-xl flex items-center gap-2 transition-colors shadow-2xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span className="font-mono">{femaleMember.phone}</span>
                    </a>}
                    {canCall(femaleMember) && femaleMember.whatsapp && (
                      <a
                        href={`https://wa.me/${femaleMember.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 text-xs font-semibold text-rose-950 bg-rose-100 hover:bg-rose-200 rounded-xl flex items-center gap-1.5 transition-colors border border-rose-300"
                        title={t('হোয়াটসঅ্যাপ', 'WhatsApp')}
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-rose-800" />
                        <span>{t('হোয়াটসঅ্যাপ', 'WhatsApp')}</span>
                      </a>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-rose-700 bg-rose-100/70 px-2.5 py-1 rounded-lg">
                    {femaleMember.ward || t('সংরক্ষিত ৪, ৫ ও ৬ নং ওয়ার্ড', 'Wards 4, 5 & 6')}
                  </span>
                </div>
              </div>

              {/* 2. Word Member Card (1 Word Member: Photo, Name, Designation, Ward No, Contact info - No description) */}
              <div className="bg-gradient-to-br from-emerald-50/60 via-white to-stone-50/60 rounded-2xl p-5 sm:p-6 border-2 border-emerald-600/25 hover:border-emerald-600/45 transition-all shadow-xs flex flex-col justify-between space-y-4 flex-1">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  {/* Photo */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-stone-100 border-2 border-emerald-700/20 shadow-sm shrink-0">
                    <img
                      src={wardMember.photoUrl || '/images/ward_member_1790160878758.jpg'}
                      alt={wardMember.nameBn}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 p-1 bg-emerald-700 text-white rounded-full shadow-2xs" title={t('যাচাইকৃত', 'Verified')}>
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Basic Details: Photo, Name, Designation, Ward Number */}
                  <div className="space-y-1.5 flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-700 text-white shadow-2xs">
                        {t('ওয়ার্ড সদস্য', 'Ward Member')}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                        {wardMember.ward || t('৫ নং ওয়ার্ড', 'Ward No. 5')}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold font-serif text-stone-900 leading-snug">
                      {isBn ? wardMember.nameBn : wardMember.nameEn}
                    </h4>
                    <p className="text-xs text-emerald-800 font-semibold">
                      {isBn ? wardMember.designationBn : wardMember.designationEn}
                    </p>
                    <p className="text-[11px] text-stone-500 flex items-center justify-center sm:justify-start gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{wardMember.area || wardMember.addressBn || '৫ নং ওয়ার্ড, বদরপাশা ইউনিয়ন'}</span>
                    </p>
                  </div>
                </div>

                {/* Contact Info Bar */}
                <div className="pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {canCall(wardMember) && <a
                      href={`tel:${wardMember.phone}`}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl flex items-center gap-2 transition-colors shadow-2xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span className="font-mono">{wardMember.phone}</span>
                    </a>}
                    {canCall(wardMember) && wardMember.whatsapp && (
                      <a
                        href={`https://wa.me/${wardMember.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 rounded-xl flex items-center gap-1.5 transition-colors border border-emerald-300"
                        title={t('হোয়াটসঅ্যাপ', 'WhatsApp')}
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-800" />
                        <span>{t('হোয়াটসঅ্যাপ', 'WhatsApp')}</span>
                      </a>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                    {wardMember.ward || t('৫ নং ওয়ার্ড', 'Ward No. 5')}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. DYNAMIC DATABASE-DRIVEN FINANCIAL & PROJECT STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          
          {/* Card 1: Completed Projects */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
              <span>{t('সম্পন্ন প্রকল্প', 'Completed')}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900">
              {toBengaliNumber(completedProjects.length)}
            </div>
            <span className="text-[11px] text-stone-400 block mt-1">
              {t('সফলভাবে বাস্তবায়িত', 'Successfully Done')}
            </span>
          </div>

          {/* Card 2: Running Projects */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
              <span>{t('চলমান প্রকল্প', 'Active')}</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900">
              {toBengaliNumber(runningProjects.length)}
            </div>
            <span className="text-[11px] text-stone-400 block mt-1">
              {t('বর্তমানে মাঠে কাজ চলছে', 'Work in Progress')}
            </span>
          </div>

          {/* Card 3: Total Donations */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
              <span>{t('মোট অনুদান/হাদিয়া', 'Total Raised')}</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-emerald-800">
              {formatCurrency(financials?.totalIncome, isBn)}
            </div>
            <span className="text-[11px] text-stone-400 block mt-1">
              {t('১০০% রেকর্ডভুক্ত হিসাব', 'Audited Records')}
            </span>
          </div>

          {/* Card 4: Total Expenses */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
              <span>{t('মোট জনকল্যাণ ব্যয়', 'Total Spent')}</span>
              <TrendingDown className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-rose-800">
              {formatCurrency(financials?.totalExpense, isBn)}
            </div>
            <span className="text-[11px] text-stone-400 block mt-1">
              {t('ভাউচারসহ প্রকল্প ব্যয়', 'With Vouchers')}
            </span>
          </div>

          {/* Card 5: Current Balance */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-900 text-white shadow-md border border-emerald-800 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-emerald-300 text-xs mb-2">
              <span>{t('বর্তমান তহবিল স্থিতি', 'Current Fund')}</span>
              <Wallet className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono text-white">
              {formatCurrency(financials?.currentBalance, isBn)}
            </div>
            <span className="text-[11px] text-emerald-300/80 block mt-1">
              {t('হাতে মজুত তহবিল', 'Available Balance')}
            </span>
          </div>

        </div>
      </section>

      {/* 3. RUNNING PROJECTS SPOTLIGHT */}
      {runningProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <span>{t('অগ্রাধিকারমূলক উদ্যোগ', 'Priority Initiative')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                {t('চলমান জনকল্যাণ প্রকল্প', 'Running Welfare Projects')}
              </h2>
            </div>
            <button
              onClick={() => setCurrentPage('projects')}
              className="mt-3 sm:mt-0 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>{t('সকল প্রকল্প দেখুন', 'View All Projects')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {runningProjects.map(project => {
              const collected = project.collectedAmount || 0;
              const budget = project.estimatedBudget || 1;
              const percent = Math.min(100, Math.round((collected / budget) * 100));

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video overflow-hidden bg-stone-100">
                    <img
                      src={project.featuredImage}
                      alt={project.titleBn}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm">
                      {project.isDemo && <span className="ml-2 rounded bg-amber-400 px-2 py-1 text-[10px] text-amber-950">Demo data</span>}
                      {t('চলমান প্রকল্প', 'Active Project')}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-xs text-stone-500 mb-1">
                        <span>{project.category}</span>
                        <span aria-hidden="true"> · </span>
                        <span>{project.location}</span>
                      </div>
                      <h3 className="text-xl font-bold font-serif text-stone-900 group-hover:text-emerald-800 transition-colors">
                        {isBn ? project.titleBn : project.titleEn}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                        {isBn ? project.shortDescBn : project.shortDescEn}
                      </p>
                    </div>

                    {/* Progress Bar and Accounting */}
                    <div className="pt-4 border-t border-stone-100 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-stone-500">{t('সংগৃহীত অনুদান:', 'Collected:')}</span>
                        <span className="font-mono font-bold text-emerald-800">
                          {formatCurrency(collected, isBn)}
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-stone-400">
                        <span>{t(`বাজেট: ${formatCurrency(project.estimatedBudget, isBn)}`, `Budget: ${formatCurrency(project.estimatedBudget, false)}`)}</span>
                        <span>{toBengaliNumber(percent)}% {t('সংগৃহীত', 'Funded')}</span>
                      </div>

                      <div className="pt-3 flex items-center justify-between">
                        <button
                          onClick={() => handleProjectClick(project.slug)}
                          className="text-xs font-semibold text-stone-800 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{t('বিস্তারিত ও হিসাব', 'Details & Accounts')}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                         {!project.isDemo && <button
                           onClick={() => setCurrentPage('donation')}
                           className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                          {t('অনুদান দিন', 'Donate')}
                         </button>}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. THE 3 COMPLETED PROJECTS SPECIFIED IN PROMPT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t('বাস্তবায়িত কার্যক্রম', 'Completed Welfare Milestones')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            {t('আমাদের সম্পন্ন কার্যক্রমসমূহ', 'Our Completed Projects')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {t(
              'সংগঠনের সূচনা থেকে সফলভাবে সম্পন্ন হওয়া প্রকল্প ও সামাজিক সেবার তথ্য। প্রতিটি খরচের হিসাব অনুমোদিত ও সংরক্ষিত।',
              'Projects successfully accomplished since the inception of the organization with full audit records.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {completedProjects.slice(0, 3).map(project => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col group hover:border-emerald-300 transition-colors"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={project.featuredImage}
                  alt={project.titleBn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-emerald-900/90 text-white text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-sm">
                  {project.isDemo && <span className="ml-2 rounded bg-amber-400 px-2 py-1 text-[10px] text-amber-950">Demo data</span>}
                  {t('সম্পন্ন', 'Completed')}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] text-stone-500 mb-1">
                    <span>{project.category}</span>
                  </div>
                  <h3 className="text-base font-bold font-serif text-stone-900 group-hover:text-emerald-800 transition-colors">
                    {isBn ? project.titleBn : project.titleEn}
                  </h3>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {isBn ? project.shortDescBn : project.shortDescEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500">
                    {t('ব্যয়: ', 'Cost: ')}
                    <strong className="font-mono text-stone-800">
                      {formatCurrency(project.expenseAmount || project.estimatedBudget, isBn)}
                    </strong>
                  </span>
                  <button
                    onClick={() => handleProjectClick(project.slug)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('প্রতিবেদন', 'Outcome')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DONATION & HADIYA CTA BOX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-stone-100 border border-stone-200 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            {t('আপনার অনুদান ও সহযোগিতায় বদলে যেতে পারে একটি গ্রামীণ পরিবার', 'Your Generous Contribution Can Transform a Village Family')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto">
            {t(
              'সদকায়ে জারিয়া হিসেবে ফলের গাছ রোপণ, রাতে নিরাপদ চলাচলের জন্য সড়কবাতি স্থাপন কিংবা অসুস্থ রোগীর চিকিৎসায় অংশ নিন।',
              'Contribute as Sadaqah Jariyah for fruit tree planting, solar illumination for night safety, or emergency medical aid.'
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setCurrentPage('donation')}
              className="px-6 py-3 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              {t('সহযোগিতা / অনুদান পাঠানোর মাধ্যম', 'View Donation Accounts & bKash')}
            </button>
            <button
              onClick={() => setCurrentPage('projects')}
              className="px-5 py-3 text-sm font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-colors cursor-pointer"
            >
              {t('সকল প্রকল্প দেখুন', 'View All Projects')}
            </button>
          </div>
        </div>
      </section>

      {/* 6. EMERGENCY SERVICES SECTION (জরুরি সেবা - Placed Right Above the Footer) */}
      {verifiedEmergencyContacts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <span className="text-xs font-semibold text-rose-700">{t('যাচাইকৃত জরুরি যোগাযোগ', 'Verified emergency contacts')}</span>
                <h2 className="mt-1 text-2xl font-serif font-bold text-stone-900">{t('তাৎক্ষণিক যোগাযোগ', 'Immediate contacts')}</h2>
              </div>
              <button onClick={() => setCurrentPage('emergency')} className="text-xs font-semibold text-rose-700 hover:text-rose-900 cursor-pointer">{t('পূর্ণাঙ্গ ডিরেক্টরি', 'Full directory')}</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {verifiedEmergencyContacts.slice(0, 6).map(contact => (
                <div key={contact.id} className="rounded-2xl border border-stone-200 bg-stone-50 p-4 flex items-center gap-3">
                  {contact.photoUrl ? <img src={contact.photoUrl} alt={contact.nameBn} className="w-14 h-14 rounded-xl object-cover" /> : <div className="w-14 h-14 rounded-xl bg-rose-100 flex items-center justify-center"><PhoneCall className="w-5 h-5 text-rose-700" /></div>}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-stone-900 truncate">{isBn ? contact.nameBn : contact.nameEn}</h3>
                    <p className="text-xs text-stone-500 truncate">{isBn ? contact.categoryNameBn : (contact.categoryNameEn || contact.categoryNameBn)}</p>
                    <a href={`tel:${contact.phone}`} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-rose-700"><PhoneCall className="w-3 h-3" />{contact.phone}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Legacy prototype directory retained for reference; it is never rendered. */}
      {false && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-10 rounded-3xl bg-white text-stone-900 border border-stone-200 shadow-xl space-y-10">
          
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-stone-100">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-800 text-xs font-semibold rounded-full border border-rose-200">
                <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>{t('জরুরি সেবা ডিরেক্টরি', 'Emergency Services Directory')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                {t('জরুরি সেবা — তাৎক্ষণিক যোগাযোগ ও জরুরি নম্বর', 'Emergency Services — Immediate Contacts & Helplines')}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
                {t(
                  'উপজেলা ও থানা প্রশাসন, হাসপাতাল ও বিশেষজ্ঞ ডাক্তার, স্থানীয় ২৪/৭ ফার্মেসি, জরুরি যানবাহন ও অ্যাম্বুলেন্স এবং জাতীয় হটলাইনের ছবি ও যাচাইকৃত সরাসরি মোবাইল নম্বর।',
                  'Verified emergency directory with photos for administration, doctors, 24/7 pharmacies, vehicle drivers & ambulance, and national helplines.'
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentPage('emergency')}
                className="px-5 py-3 text-xs sm:text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-white" />
                <span>{t('পূর্ণাঙ্গ ডিরেক্টরি পেইজ', 'Full Emergency Page')}</span>
              </button>
              <button
                onClick={() => setCurrentPage('blood-donors')}
                className="px-4 py-3 text-xs sm:text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                {t('রক্তদাতা সন্ধান (Blood)', 'Find Blood Donors')}
              </button>
            </div>
          </div>

          {/* Structured Cards by 5 Categories */}
          <div className="space-y-10">
            
            {/* Category 1: উপজেলা ও থানা প্রশাসন */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm sm:text-base">
                  <ShieldAlert className="w-4 h-4 text-emerald-700" />
                  <span>{t('১. উপজেলা ও থানা প্রশাসন (বদরপাশা ইউপি, রাজৈর থানা, ইউএনও, ফায়ার সার্ভিস)', '1. Upazila & Thana Administration')}</span>
                </div>
                <span className="text-xs text-stone-500 font-medium">৪টি যাচাইকৃত সেবা</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { 
                    name: '১০নং বদরপাশা ইউপি কার্যালয়', 
                    role: 'ইউপি সচিব / প্রধান অফিস', 
                    phone: '01712-998877', 
                    photo: '/images/upazila_admin_1790359614084.jpg',
                    tag: 'ইউপি কমপ্লেক্স'
                  },
                  { 
                    name: 'রাজৈর থানা পুলিশ', 
                    role: 'ডিউটি অফিসার (২৪ ঘণ্টা)', 
                    phone: '01713-373650', 
                    photo: '/images/police_officer_1790160785095.jpg',
                    tag: '২৪ ঘণ্টা পাহারা'
                  },
                  { 
                    name: 'উপজেলা নির্বাহী অফিসার (ইউএনও)', 
                    role: 'উপজেলা প্রশাসন, রাজৈর', 
                    phone: '01708-410050', 
                    photo: '/images/upazila_admin_1790359614084.jpg',
                    tag: 'উপজেলা প্রশাসন'
                  },
                  { 
                    name: 'রাজৈর ফায়ার সার্ভিস ও সিভিল ডিফেন্স', 
                    role: 'জরুরি অগ্নিনির্বাপণ ও উদ্ধার', 
                    phone: '01711-224466', 
                    photo: '/images/fire_station_1790359631350.jpg',
                    tag: 'জরুরি রেসকিউ'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all flex flex-col justify-between overflow-hidden group">
                    <div>
                      {/* Photo Header */}
                      <div className="relative w-full h-36 bg-stone-100 overflow-hidden border-b border-stone-100">
                        <img 
                          src={item.photo} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-900/80 text-white backdrop-blur-sm">
                          {item.tag}
                        </span>
                      </div>
                      
                      <div className="p-4 space-y-1">
                        <span className="text-[11px] text-emerald-700 font-bold block">{item.role}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">{item.name}</h4>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="font-mono text-xs text-stone-800 font-bold">{item.phone}</span>
                        <a 
                          href={`tel:${item.phone}`} 
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                          title={t('কল করুন', 'Call')}
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{t('কল', 'Call')}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 2: ডাক্তার ও স্বাস্থ্য সেবা */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm sm:text-base">
                  <Stethoscope className="w-4 h-4 text-rose-700" />
                  <span>{t('২. ডাক্তার ও স্বাস্থ্য সেবা (হাসপাতাল, বিশেষজ্ঞ ডাক্তার ও স্বাস্থ্য কেন্দ্র)', '2. Doctors & Healthcare Services')}</span>
                </div>
                <span className="text-xs text-stone-500 font-medium">৩টি জরুরি সেবা</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    name: 'রাজৈর উপজেলা স্বাস্থ্য কমপ্লেক্স', 
                    role: 'জরুরি বিভাগ (২৪/৭ খোলা)', 
                    phone: '01710-445566', 
                    area: 'উপজেলা সদর, রাজৈর',
                    photo: '/images/hospital_building_1790359645084.jpg',
                    badge: '৫০ শয্যা সরকারি হাসপাতাল'
                  },
                  { 
                    name: 'ডাঃ মোহাম্মাদ শাহাদাত হোসেন', 
                    role: 'এমবিবিএস, বিসিএস (মেডিসিন অভিজ্ঞ)', 
                    phone: '01730-887766', 
                    area: 'প্রতিদিন বিকাল ৫টা - রাত ৮টা (চেম্বার)',
                    photo: '/images/doctor_chamber_1790359602138.jpg',
                    badge: 'বিশেষজ্ঞ চিকিৎসক'
                  },
                  { 
                    name: 'বদরপাশা ইউনিয়ন উপ-স্বাস্থ্য কেন্দ্র', 
                    role: 'মা ও শিশু স্বাস্থ্য, সাধারণ চিকিৎসা ও টিকাদান', 
                    phone: '01718-556677', 
                    area: 'বদরপাশা ইউনিয়ন পরিষদ সংলগ্ন',
                    photo: '/images/hospital_building_1790359645084.jpg',
                    badge: 'ইউনিয়ন স্বাস্থ্য কেন্দ্র'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-rose-400 transition-all flex flex-col justify-between overflow-hidden group">
                    <div>
                      {/* Photo Header */}
                      <div className="relative w-full h-40 bg-stone-100 overflow-hidden border-b border-stone-100">
                        <img 
                          src={item.photo} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-700 text-white shadow-xs">
                          {item.badge}
                        </span>
                      </div>

                      <div className="p-4 space-y-1">
                        <span className="text-[11px] text-rose-700 font-bold block">{item.role}</span>
                        <h4 className="text-sm font-bold text-stone-900 leading-snug">{item.name}</h4>
                        <p className="text-xs text-stone-500">{item.area}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="font-mono text-xs text-stone-800 font-bold">{item.phone}</span>
                        <a 
                          href={`tel:${item.phone}`} 
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{t('কল করুন', 'Call Now')}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 3: ফার্মেসি ও ঔষধ */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2 text-sky-800 font-bold text-sm sm:text-base">
                  <Pill className="w-4 h-4 text-sky-700" />
                  <span>{t('৩. ফার্মেসি ও ঔষধ (স্থানীয় ২৪/৭ ফার্মেসির নাম ও ফোন নম্বর)', '3. Pharmacies & Medicines')}</span>
                </div>
                <span className="text-xs text-stone-500 font-medium">২৪/৭ জরুরি ঔষধ সরবরাহ</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { 
                    name: 'বদরপাশা সেন্ট্রাল মডেল ফার্মেসি (২৪/৭)', 
                    detail: 'জরুরি জীবনরক্ষাকারী ঔষধ, স্যালাইন, অক্সিজেন ক্যান ও ইনসুলিন সার্বক্ষণিক মওজুদ', 
                    phone: '01711-223344', 
                    altPhone: '01811-556677',
                    location: 'বদরপাশা বাজার প্রধান সড়ক, রাজৈর',
                    photo: '/images/pharmacy_store_1790359589622.jpg',
                    badge: '২৪ ঘণ্টা খোলা'
                  },
                  { 
                    name: 'রাজৈর সেবা ফার্মেসি ও সার্জিক্যাল', 
                    detail: 'হাসপাতাল গেট সংলগ্ন সার্বক্ষণিক মেডিসিন, ইনজেকশন ও সার্জিক্যাল সামগ্রী', 
                    phone: '01725-667788', 
                    altPhone: '01925-112233',
                    location: 'উপজেলা স্বাস্থ্য কমপ্লেক্স প্রধান ফটক, রাজৈর',
                    photo: '/images/pharmacy_store_1790359589622.jpg',
                    badge: 'সার্বক্ষণিক সেবা'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-sky-400 transition-all flex flex-col justify-between overflow-hidden group">
                    <div>
                      {/* Photo Header */}
                      <div className="relative w-full h-44 bg-stone-100 overflow-hidden border-b border-stone-100">
                        <img 
                          src={item.photo} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-800 text-white shadow-xs">
                            {item.badge}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                            {t('হোম ডেলিভারি', 'Delivery')}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-stone-900">{item.name}</h4>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">{item.detail}</p>
                        <p className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                          <span>📍</span> {item.location}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-sky-900 font-bold">{item.phone}</span>
                          {item.altPhone && <span className="font-mono text-[11px] text-stone-400 hidden sm:inline">| {item.altPhone}</span>}
                        </div>
                        <a 
                          href={`tel:${item.phone}`} 
                          className="px-4 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{t('কল করুন', 'Call Now')}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 4: জরুরি যানবাহন ও এ্যাম্বুলেন্স */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base">
                  <Ambulance className="w-4 h-4 text-amber-700" />
                  <span>{t('৪. জরুরি যানবাহন ও এ্যাম্বুলেন্স (এ্যাম্বুলেন্স, মাইক্রোবাস, অটো/ভ্যান চালকের ছবিসহ)', '4. Emergency Vehicles & Ambulance')}</span>
                </div>
                <span className="text-xs text-stone-500 font-medium">চালক ও গাড়ি যাচাইকৃত</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { 
                    type: 'এ্যাম্বুলেন্স (Ambulance)', 
                    name: 'বদরপাশা-রাজৈর কমিউনিটি অ্যাম্বুলেন্স', 
                    driver: 'চালক: মোঃ শামীম হোসেন',
                    phone: '01700-112233', 
                    badge: 'অক্সিজেন সুবিধা',
                    photo: '/images/ambulance_van_1790160818423.jpg',
                    driverPhoto: '/images/driver_portrait_1790160864705.jpg',
                    carModel: 'Toyota HiAce Ambulance'
                  },
                  { 
                    type: 'মাইক্রোবাস (Microbus)', 
                    name: 'জরুরি দূরপাল্লার এসি মাইক্রোবাস', 
                    driver: 'চালক: মোঃ জামাল হোসেন',
                    phone: '01715-998877', 
                    badge: '১০ সিট এসি নোয়া',
                    photo: '/images/microbus_vehicle_1790160849220.jpg',
                    driverPhoto: '/images/driver_portrait_1790160864705.jpg',
                    carModel: 'Toyota Noah (ঢাকা ট্রিপ)'
                  },
                  { 
                    type: 'অটো / ভ্যান (Auto/Van)', 
                    name: 'বদরপাশা লোকাল অটো ও ইজিবাইক', 
                    driver: 'চালক: মোঃ বিল্লাল মিয়া',
                    phone: '01920-334455', 
                    badge: 'লোকাল স্ট্যান্ড',
                    photo: '/images/cng_auto_rickshaw_1790160835942.jpg',
                    driverPhoto: '/images/driver_portrait_1790160864705.jpg',
                    carModel: 'ইজিবাইক ও অটোরিকশা'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between overflow-hidden group">
                    <div>
                      {/* Vehicle Photo with Driver Inset Photo */}
                      <div className="relative w-full h-44 bg-stone-100 overflow-hidden border-b border-stone-100">
                        <img 
                          src={item.photo} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-800 text-white shadow-xs">
                            {item.badge}
                          </span>
                        </div>

                        {/* Driver Profile Photo Inset */}
                        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2 bg-stone-900/85 backdrop-blur-sm pl-1 pr-2.5 py-1 rounded-full border border-white/20 shadow-md">
                          <img 
                            src={item.driverPhoto} 
                            alt={item.driver} 
                            className="w-7 h-7 rounded-full object-cover border border-amber-400 shrink-0"
                          />
                          <span className="text-[10px] text-white font-medium truncate max-w-[120px]">
                            {item.driver.replace('চালক: ', '')}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-1">
                        <span className="text-[11px] font-bold text-amber-800 block">{item.type}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-stone-600 font-medium">{item.driver} ({item.carModel})</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="font-mono text-xs text-amber-900 font-bold">{item.phone}</span>
                        <a 
                          href={`tel:${item.phone}`} 
                          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1 shadow-xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{t('কল', 'Call')}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 5: জাতীয় হেল্পলাইন */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm sm:text-base">
                  <Radio className="w-4 h-4 text-indigo-700" />
                  <span>{t('৫. জাতীয় হেল্পলাইন (৯৯৯, ৩৩৩, ১০৯)', '5. National Helplines')}</span>
                </div>
                <span className="text-xs text-stone-500 font-medium">২৪ ঘণ্টা বিনামূল্যে টোল-ফ্রি</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { 
                    number: '৯৯৯', 
                    title: 'জাতীয় জরুরি সেবা', 
                    desc: 'পুলিশ, ফায়ার সার্ভিস ও সরকারি অ্যাম্বুলেন্স (২৪/৭ ফ্রি কল)', 
                    phone: '999',
                    photo: '/images/national_helpline_1790359656970.jpg',
                    tag: 'পুলিশ • ফায়ার • এ্যাম্বুলেন্স'
                  },
                  { 
                    number: '৩৩৩', 
                    title: 'সরকারি সেবা ও তথ্য বাতায়ন', 
                    desc: 'ইউনিয়ন তথ্য, ত্রাণ সহায়তা ও নাগরিক সেবা (টোল ফ্রি)', 
                    phone: '333',
                    photo: '/images/national_helpline_1790359656970.jpg',
                    tag: 'নাগরিক সেবা বাতায়ন'
                  },
                  { 
                    number: '১০৯', 
                    title: 'নারী ও শিশু নির্যাতন প্রতিরোধ সেল', 
                    desc: 'আইনি সহায়তা, নিরাপত্তা ও জরুরি পরামর্শ (টোল ফ্রি)', 
                    phone: '109',
                    photo: '/images/national_helpline_1790359656970.jpg',
                    tag: 'আইনি সহায়তা ও সুরক্ষা'
                  },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all flex flex-col justify-between overflow-hidden group">
                    <div>
                      {/* Photo Header */}
                      <div className="relative w-full h-32 bg-stone-100 overflow-hidden border-b border-stone-100">
                        <img 
                          src={item.photo} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-800 text-white shadow-xs">
                          {item.tag}
                        </span>
                        <span className="absolute bottom-2 left-3 text-2xl font-mono font-black text-white drop-shadow">
                          {item.number}
                        </span>
                      </div>

                      <div className="p-4 space-y-1">
                        <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                        <p className="text-xs text-stone-500 leading-snug">{item.desc}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {t('টোল ফ্রি', 'Toll Free')}
                        </span>
                        <a
                          href={`tel:${item.phone}`}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{t('কল করুন', 'Call')}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>
      )}

    </div>
  );
};
