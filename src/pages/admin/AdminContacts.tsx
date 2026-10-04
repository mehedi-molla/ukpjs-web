import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { ImportantContact, ContactCategoryItem } from '../../types';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  PhoneCall, 
  X, 
  Car, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Search, 
  FolderPlus, 
  Award, 
  Users, 
  HeartPulse, 
  Truck, 
  CheckCircle2, 
  AlertTriangle,
  Image as ImageIcon,
  ExternalLink,
  Layers,
  Settings
} from 'lucide-react';

export const AdminContacts: React.FC = () => {
  const { lang, t } = useLanguage();
  const { showToast } = useNotification();
  const isBn = lang === 'bn';

  const [contacts, setContacts] = useState<ImportantContact[]>([]);
  const [categories, setCategories] = useState<ContactCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'contacts' | 'categories'>('contacts');

  // Contact filtering
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Modal: Create / Edit Contact
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ImportantContact | null>(null);

  // Contact Form State
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('chairman');
  const [categoryId, setCategoryId] = useState('');
  const [categoryNameBn, setCategoryNameBn] = useState('');
  const [designationBn, setDesignationBn] = useState('');
  const [designationEn, setDesignationEn] = useState('');
  const [ward, setWard] = useState('');
  const [unionName, setUnionName] = useState('চাঁদগ্রাম ইউনিয়ন পরিষদ');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [area, setArea] = useState('উমারখালী, কিস্তুপুর');
  const [addressBn, setAddressBn] = useState('');
  const [serviceAreaBn, setServiceAreaBn] = useState('');
  const [availabilityBn, setAvailabilityBn] = useState('২৪ ঘণ্টা সার্বক্ষণিক');
  const [photoUrl, setPhotoUrl] = useState('');
  const [vehiclePhotoUrl, setVehiclePhotoUrl] = useState('');
  const [driverName, setDriverName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('');
  const [isAc, setIsAc] = useState(false);
  const [institutionName, setInstitutionName] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [isPublished, setIsPublished] = useState(true);
  const [isDemoPlaceholder, setIsDemoPlaceholder] = useState(false);
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ContactCategoryItem | null>(null);
  const [catNameBn, setCatNameBn] = useState('');
  const [catNameEn, setCatNameEn] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescBn, setCatDescBn] = useState('');
  const [catSortOrder, setCatSortOrder] = useState(1);
  const [catIsActive, setCatIsActive] = useState(true);

  // Presets for quick photo selection
  const PHOTO_PRESETS = [
    { label: 'চেয়ারম্যান ছবি', url: '/src/assets/images/chairman_portrait_1790160770116.jpg' },
    { label: 'ওয়ার্ড মেম্বার ছবি', url: '/src/assets/images/ward_member_1790160878758.jpg' },
    { label: 'মহিলা মেম্বার ছবি', url: '/src/assets/images/female_member_1790160802115.jpg' },
    { label: 'পুলিশ অফিসার ছবি', url: '/src/assets/images/police_officer_1790160785095.jpg' },
    { label: 'চালক / ড্রাইভার ছবি', url: '/src/assets/images/driver_portrait_1790160864705.jpg' },
  ];

  const VEHICLE_PRESETS = [
    { label: 'অ্যাম্বুলেন্স গাড়ি', url: '/src/assets/images/ambulance_van_1790160818423.jpg' },
    { label: 'সিএনজি / অটো', url: '/src/assets/images/cng_auto_rickshaw_1790160835942.jpg' },
    { label: 'মাইক্রোবাস (নোয়া)', url: '/src/assets/images/microbus_vehicle_1790160849220.jpg' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cRes, catRes] = await Promise.all([
        fetch('/api/contacts'),
        fetch('/api/contact-categories'),
      ]);
      const cData = await cRes.json();
      const catData = await catRes.json();
      if (Array.isArray(cData)) setContacts(cData);
      if (Array.isArray(catData)) setCategories(catData);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const handleOpenCreateContact = () => {
    setEditingContact(null);
    setNameBn('');
    setNameEn('');
    setCategory('ambulance');
    setCategoryId('');
    setCategoryNameBn('জরুরি অ্যাম্বুলেন্স');
    setDesignationBn('');
    setDesignationEn('');
    setWard('');
    setUnionName('চাঁদগ্রাম ইউনিয়ন পরিষদ');
    setPhone('');
    setAltPhone('');
    setWhatsapp('');
    setArea('উমারখালী, কিস্তুপুর');
    setAddressBn('');
    setServiceAreaBn('উমারখালী, কিস্তুপুর ও পার্শ্ববর্তী এলাকা');
    setAvailabilityBn('২৪ ঘণ্টা দিন-রাত সার্বক্ষণিক');
    setPhotoUrl('');
    setVehiclePhotoUrl('');
    setDriverName('');
    setVehicleType('');
    setVehicleModel('');
    setVehicleNumber('');
    setSeatingCapacity('');
    setIsAc(false);
    setInstitutionName('');
    setMapUrl('');
    setDescriptionBn('');
    setIsEmergency(true);
    setIsVerified(true);
    setIsPublished(true);
    setIsDemoPlaceholder(false);
    setSortOrder(contacts.length + 1);
    setNotes('');
    setIsContactModalOpen(true);
  };

  const handleOpenEditContact = (c: ImportantContact) => {
    setEditingContact(c);
    setNameBn(c.nameBn || '');
    setNameEn(c.nameEn || '');
    setCategory(c.category || 'other');
    setCategoryId(c.categoryId || '');
    setCategoryNameBn(c.categoryNameBn || '');
    setDesignationBn(c.designationBn || '');
    setDesignationEn(c.designationEn || '');
    setWard(c.ward || '');
    setUnionName(c.unionName || 'চাঁদগ্রাম ইউনিয়ন পরিষদ');
    setPhone(c.phone || '');
    setAltPhone(c.altPhone || '');
    setWhatsapp(c.whatsapp || '');
    setArea(c.area || c.serviceAreaBn || '');
    setAddressBn(c.addressBn || '');
    setServiceAreaBn(c.serviceAreaBn || '');
    setAvailabilityBn(c.availabilityBn || '২৪ ঘণ্টা');
    setPhotoUrl(c.photoUrl || '');
    setVehiclePhotoUrl(c.vehiclePhotoUrl || '');
    setDriverName(c.driverName || '');
    setVehicleType(c.vehicleType || '');
    setVehicleModel(c.vehicleModel || '');
    setVehicleNumber(c.vehicleNumber || '');
    setSeatingCapacity(c.seatingCapacity || '');
    setIsAc(Boolean(c.isAc));
    setInstitutionName(c.institutionName || '');
    setMapUrl(c.mapUrl || '');
    setDescriptionBn(c.descriptionBn || c.notes || '');
    setIsEmergency(Boolean(c.isEmergency));
    setIsVerified(c.isVerified !== undefined ? Boolean(c.isVerified) : true);
    setIsPublished(c.isPublished !== undefined ? Boolean(c.isPublished) : true);
    setIsDemoPlaceholder(Boolean(c.isDemoPlaceholder));
    setSortOrder(c.sortOrder || 1);
    setNotes(c.notes || '');
    setIsContactModalOpen(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn || !phone) {
      showToast(t('নাম ও ফোন নম্বর দেওয়া বাধ্যতামূলক', 'Name and Phone are required'), 'error');
      return;
    }

    const matchedCat = categories.find(cat => cat.slug === category);
    const finalCategoryNameBn = matchedCat ? matchedCat.nameBn : categoryNameBn || 'অন্যান্য সেবা';

    setIsSubmitting(true);
    try {
      const payload: Partial<ImportantContact> = {
        nameBn,
        nameEn: nameEn || nameBn,
        category,
        categoryId: matchedCat ? matchedCat.id : categoryId,
        categoryNameBn: finalCategoryNameBn,
        categoryNameEn: matchedCat ? matchedCat.nameEn : category,
        designationBn,
        designationEn,
        ward,
        unionName,
        phone,
        altPhone,
        whatsapp,
        area,
        addressBn,
        serviceAreaBn,
        availabilityBn,
        photoUrl,
        vehiclePhotoUrl,
        driverName,
        vehicleType,
        vehicleModel,
        vehicleNumber,
        seatingCapacity,
        isAc,
        institutionName,
        mapUrl,
        descriptionBn,
        isEmergency,
        isVerified,
        isPublished,
        isDemoPlaceholder,
        sortOrder: Number(sortOrder),
        notes,
      };

      const url = editingContact ? `/api/contacts/${editingContact.id}` : '/api/contacts';
      const method = editingContact ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(t('যোগাযোগ নম্বর ও তথ্য সফলভাবে সংরক্ষিত হয়েছে', 'Contact saved successfully'), 'success');
        setIsContactModalOpen(false);
        fetchData();
      } else {
        showToast(t('সংরক্ষণ ব্যর্থ হয়েছে', 'Failed to save'), 'error');
      }
    } catch {
      showToast(t('সার্ভার এরর হয়েছে', 'Server error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}/toggle-publish`, { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        showToast(data.isPublished ? t('প্রকাশিত করা হয়েছে', 'Published') : t('অপ্রকাশিত করা হয়েছে', 'Unpublished'), 'info');
        setContacts(prev => prev.map(c => c.id === id ? { ...c, isPublished: data.isPublished } : c));
      }
    } catch {}
  };

  const handleToggleVerify = async (id: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}/toggle-verify`, { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        showToast(data.isVerified ? t('যাচাইকৃত স্ট্যাটাস সম্পন্ন', 'Verified') : t('যাচাই বাতিল করা হয়েছে', 'Unverified'), 'info');
        setContacts(prev => prev.map(c => c.id === id ? { ...c, isVerified: data.isVerified, lastVerifiedAt: data.lastVerifiedAt } : c));
      }
    } catch {}
  };

  const handleDeleteContact = async (id: string, name: string) => {
    if (!confirm(t(`আপনি কি "${name}" নম্বরটি মুছে ফেলতে চান?`, `Delete contact "${name}"?`))) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(t('নম্বর মুছে ফেলা হয়েছে', 'Deleted'), 'info');
        setContacts(prev => prev.filter(c => c.id !== id));
      }
    } catch {}
  };

  // Category CRUD Handlers
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setCatNameBn('');
    setCatNameEn('');
    setCatSlug('');
    setCatDescBn('');
    setCatSortOrder(categories.length + 1);
    setCatIsActive(true);
    setIsCatModalOpen(true);
  };

  const handleOpenEditCategory = (cat: ContactCategoryItem) => {
    setEditingCategory(cat);
    setCatNameBn(cat.nameBn);
    setCatNameEn(cat.nameEn);
    setCatSlug(cat.slug);
    setCatDescBn(cat.descriptionBn || '');
    setCatSortOrder(cat.sortOrder);
    setCatIsActive(cat.isActive);
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameBn) {
      showToast(t('ক্যাটাগরির বাংলা নাম প্রয়োজন', 'Category name required'), 'error');
      return;
    }

    try {
      const payload = {
        nameBn: catNameBn,
        nameEn: catNameEn || catNameBn,
        slug: catSlug || catNameEn.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        descriptionBn: catDescBn,
        sortOrder: Number(catSortOrder),
        isActive: catIsActive,
      };

      const url = editingCategory ? `/api/contact-categories/${editingCategory.id}` : '/api/contact-categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(t('ক্যাটাগরি সংরক্ষিত হয়েছে', 'Category saved'), 'success');
        setIsCatModalOpen(false);
        fetchData();
      }
    } catch {}
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(t(`ক্যাটাগরি "${name}" মুছে ফেলতে চান?`, `Delete category "${name}"?`))) return;
    try {
      const res = await fetch(`/api/contact-categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(t('ক্যাটাগরি মুছে ফেলা হয়েছে', 'Category deleted'), 'info');
        setCategories(prev => prev.filter(c => c.id !== id));
      }
    } catch {}
  };

  // Filtered contacts
  const filteredContacts = contacts.filter(c => {
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        (c.nameBn && c.nameBn.toLowerCase().includes(q)) ||
        (c.nameEn && c.nameEn.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q)) ||
        (c.area && c.area.toLowerCase().includes(q)) ||
        (c.designationBn && c.designationBn.toLowerCase().includes(q)) ||
        (c.vehicleNumber && c.vehicleNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('সুপার এডমিন কন্ট্রোল প্যানেল', 'Super Admin Control Panel')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            {t('জরুরি যোগাযোগ ও সেবা ডিরেক্টরি ব্যবস্থাপনা', 'Emergency & Community Contacts Manager')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
            {t(
              'চেয়ারম্যান, মেম্বারগণ, পুলিশ, অ্যাম্বুলেন্স ও যানবাহনের তথ্য, ছবি এবং ফোন নম্বর ডায়নামিক ভাবে পরিচালনা করুন।',
              'Manage photos, verified hotlines, vehicles, and categories dynamically for the community.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab(activeTab === 'contacts' ? 'categories' : 'contacts')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{t('ক্যাটাগরি ম্যানেজমেন্ট', 'Manage Categories')} ({categories.length})</span>
          </button>

          <button
            onClick={handleOpenCreateContact}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('+ নতুন যোগাযোগ যোগ করুন', '+ Add New Contact')}</span>
          </button>
        </div>
      </div>

      {/* Main Tab 1: Contacts Directory */}
      {activeTab === 'contacts' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-stone-500 font-semibold shrink-0">{t('ক্যাটাগরি:', 'Category:')}</span>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">{t('সকল ক্যাটাগরি', 'All Categories')} ({contacts.length})</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>
                    {isBn ? cat.nameBn : cat.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('নাম, ফোন বা এলাকা দিয়ে খুঁজুন...', 'Search name or phone...')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Contacts Table / Grid */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 font-semibold">
                  <tr>
                    <th className="px-4 py-3.5">{t('ছবি ও তথ্য', 'Photo & Profile')}</th>
                    <th className="px-4 py-3.5">{t('ক্যাটাগরি ও পদবী', 'Category & Role')}</th>
                    <th className="px-4 py-3.5">{t('ফোন ও যোগাযোগ', 'Phone / WhatsApp')}</th>
                    <th className="px-4 py-3.5">{t('গাড়ি / এলাকা', 'Vehicle / Area')}</th>
                    <th className="px-4 py-3.5 text-center">{t('স্ট্যাটাস', 'Status')}</th>
                    <th className="px-4 py-3.5 text-center">{t('অ্যাকশন', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {filteredContacts.map(c => (
                    <tr key={c.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Photo & Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                            <img 
                              src={c.photoUrl || c.vehiclePhotoUrl || '/src/assets/images/chairman_portrait_1790160770116.jpg'} 
                              alt={c.nameBn}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-stone-900 text-sm">{isBn ? c.nameBn : c.nameEn}</span>
                              {c.isDemoPlaceholder && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                                  ডেমো
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-stone-500 block truncate max-w-[200px]">
                              {c.ward || c.unionName || c.area}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Role */}
                      <td className="px-4 py-3">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-0.5">
                          {c.categoryNameBn}
                        </span>
                        <span className="text-[11px] text-stone-600 block">
                          {c.designationBn || '—'}
                        </span>
                      </td>

                      {/* Phone / WhatsApp */}
                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-stone-900 text-xs">
                          {c.phone}
                        </div>
                        {c.whatsapp && (
                          <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                            <span>WA: {c.whatsapp}</span>
                          </span>
                        )}
                        {c.altPhone && (
                          <span className="text-[10px] text-stone-400 block font-mono">
                            Alt: {c.altPhone}
                          </span>
                        )}
                      </td>

                      {/* Vehicle & Area */}
                      <td className="px-4 py-3 text-stone-600">
                        {c.vehicleType ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-stone-800 text-[11px] block">{c.vehicleType}</span>
                            <span className="text-[10px] text-stone-400 font-mono block">{c.vehicleNumber}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-stone-600">{c.area || c.serviceAreaBn || '—'}</span>
                        )}
                      </td>

                      {/* Verification & Public status */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => handleTogglePublish(c.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors ${
                              c.isPublished
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                            title="Toggle public visibility"
                          >
                            {c.isPublished ? t('প্রকাশিত', 'Published') : t('অপ্রকাশিত', 'Draft')}
                          </button>

                          <button
                            onClick={() => handleToggleVerify(c.id)}
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold cursor-pointer ${
                              c.isVerified ? 'text-emerald-700' : 'text-stone-400'
                            }`}
                            title="Toggle verification"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{c.isVerified ? t('যাচাইকৃত', 'Verified') : t('অযাচাইকৃত', 'Unverified')}</span>
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEditContact(c)}
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteContact(c.id, c.nameBn)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Dynamic Category Manager */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-stone-100 p-4 rounded-2xl border border-stone-200">
            <div>
              <h2 className="text-base font-bold text-stone-900">{t('ডিরেক্টরি ক্যাটাগরি তালিকা', 'Contact Categories')}</h2>
              <p className="text-xs text-stone-500">{t('প্রয়োজনে নতুন সেবা ক্যাটাগরি তৈরি বা বিদ্যমান ক্যাটাগরি পরিবর্তন করুন।', 'Create and modify contact categories.')}</p>
            </div>
            <button
              onClick={handleOpenCreateCategory}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FolderPlus className="w-4 h-4" />
              <span>{t('+ নতুন ক্যাটাগরি', '+ Add Category')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">{isBn ? cat.nameBn : cat.nameEn}</span>
                    <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                      slug: {cat.slug}
                    </span>
                  </div>
                  <span className="text-xs text-stone-500 block">{cat.nameEn}</span>
                  {cat.descriptionBn && (
                    <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-xl border border-stone-100 mt-2">
                      {cat.descriptionBn}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[10px]">অর্ডার: {cat.sortOrder}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditCategory(cat)}
                      className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-stone-100 rounded-lg cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {!cat.isCore && (
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.nameBn)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- CREATE / EDIT CONTACT MODAL ---------------- */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h2 className="text-xl font-serif font-bold text-stone-900">
                {editingContact ? t('যোগাযোগ নম্বর ও তথ্য সম্পাদনা', 'Edit Contact') : t('নতুন যোগাযোগ ও সেবা কার্ড যুক্ত করুন', 'Add New Contact')}
              </h2>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-6">
              
              {/* Category & Identification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('ক্যাটাগরি নির্বাচন *', 'Category *')}
                  </label>
                  <select
                    value={category}
                    onChange={e => {
                      setCategory(e.target.value);
                      const found = categories.find(c => c.slug === e.target.value);
                      if (found) setCategoryNameBn(found.nameBn);
                    }}
                    className="w-full px-3 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>
                        {isBn ? cat.nameBn : cat.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('ইউনিয়ন / এলাকা', 'Union / Area')}
                  </label>
                  <input
                    type="text"
                    value={unionName}
                    onChange={e => setUnionName(e.target.value)}
                    placeholder="চাঁদগ্রাম ইউনিয়ন পরিষদ"
                    className="w-full px-3 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Names & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('নাম (বাংলা) *', 'Full Name (Bangla) *')}
                  </label>
                  <input
                    type="text"
                    value={nameBn}
                    onChange={e => setNameBn(e.target.value)}
                    placeholder="যেমন: মোঃ আফতাব উদ্দিন শেখ"
                    required
                    className="w-full px-3 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('পদবী / দায়িত্ব', 'Designation')}
                  </label>
                  <input
                    type="text"
                    value={designationBn}
                    onChange={e => setDesignationBn(e.target.value)}
                    placeholder="যেমন: ইউপি চেয়ারম্যান / ৫ নং ওয়ার্ড মেম্বার"
                    className="w-full px-3 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Ward & Sub-area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('ওয়ার্ড নম্বর (প্রযোজ্য ক্ষেত্রে)', 'Ward Number')}
                  </label>
                  <input
                    type="text"
                    value={ward}
                    onChange={e => setWard(e.target.value)}
                    placeholder="যেমন: ৫ নং ওয়ার্ড অথবা সংরক্ষিত ৪, ৫ ও ৬ নং ওয়ার্ড"
                    className="w-full px-3 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('এলাকা / গ্রাম', 'Area / Village')}
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    placeholder="উমারখালী, কিস্তুপুর"
                    className="w-full px-3 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Phone Numbers & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    {t('প্রধান মোবাইল নম্বর *', 'Primary Phone *')}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="01711-XXXXXX"
                    required
                    className="w-full px-3 py-2 text-xs font-mono font-bold text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('বিকল্প নম্বর', 'Alternative Phone')}
                  </label>
                  <input
                    type="text"
                    value={altPhone}
                    onChange={e => setAltPhone(e.target.value)}
                    placeholder="01811-XXXXXX"
                    className="w-full px-3 py-2 text-xs font-mono text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('হোয়াটসঅ্যাপ নম্বর', 'WhatsApp')}
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="+8801711XXXXXX"
                    className="w-full px-3 py-2 text-xs font-mono text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Photo URLs & Presets */}
              <div className="space-y-4 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                  <span>{t('ব্যক্তি ও যানবাহনের ফটো ব্যবস্থাপনা (Photo & Vehicle Media)', 'Photo & Vehicle Media')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      {t('ব্যক্তি / প্রতিনিধির ফটো URL', 'Person Profile Photo URL')}
                    </label>
                    <input
                      type="text"
                      value={photoUrl}
                      onChange={e => setPhotoUrl(e.target.value)}
                      placeholder="/src/assets/images/... অথবা https://..."
                      className="w-full px-3 py-2 text-xs text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {PHOTO_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPhotoUrl(p.url)}
                          className="px-2 py-0.5 rounded text-[10px] bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      {t('গাড়ি / বাহন / অ্যাম্বুলেন্স ফটো URL', 'Vehicle Photo URL')}
                    </label>
                    <input
                      type="text"
                      value={vehiclePhotoUrl}
                      onChange={e => setVehiclePhotoUrl(e.target.value)}
                      placeholder="/src/assets/images/... অথবা https://..."
                      className="w-full px-3 py-2 text-xs text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {VEHICLE_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setVehiclePhotoUrl(p.url)}
                          className="px-2 py-0.5 rounded text-[10px] bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Previews if URLs present */}
                {(photoUrl || vehiclePhotoUrl) && (
                  <div className="flex items-center gap-4 pt-2">
                    {photoUrl && (
                      <div className="flex items-center gap-2">
                        <img src={photoUrl} alt="Person" className="w-10 h-10 rounded-lg object-cover border" />
                        <span className="text-[10px] text-stone-500">প্রোফাইল প্রিভিউ</span>
                      </div>
                    )}
                    {vehiclePhotoUrl && (
                      <div className="flex items-center gap-2">
                        <img src={vehiclePhotoUrl} alt="Vehicle" className="w-14 h-10 rounded-lg object-cover border" />
                        <span className="text-[10px] text-stone-500">যানবাহন প্রিভিউ</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Vehicle & Transport Specific Details (Optional for Drivers/Ambulances) */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    {t('গাড়ির ধরন', 'Vehicle Type')}
                  </label>
                  <input
                    type="text"
                    value={vehicleType}
                    onChange={e => setVehicleType(e.target.value)}
                    placeholder="হাইয়েস এসি / ৪-স্ট্রোক সিএনজি"
                    className="w-full px-3 py-1.5 text-xs text-stone-900 bg-white border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    {t('গাড়ির নম্বর', 'Vehicle No.')}
                  </label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={e => setVehicleNumber(e.target.value)}
                    placeholder="ঢাকা মেট্রো-ছ ৭১-XXXX"
                    className="w-full px-3 py-1.5 text-xs text-stone-900 bg-white border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    {t('চালক নাম (যদি ভিন্ন হয়)', 'Driver Name')}
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={e => setDriverName(e.target.value)}
                    placeholder="চালকের নাম"
                    className="w-full px-3 py-1.5 text-xs text-stone-900 bg-white border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAc}
                      onChange={e => setIsAc(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>{t('শীতাতপ নিয়ন্ত্রিত (AC)', 'AC Vehicle')}</span>
                  </label>
                </div>
              </div>

              {/* Service Route, Address & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('সার্ভিস রুট / প্রস্তুত থাকার সময়', 'Service Route / Hours')}
                  </label>
                  <input
                    type="text"
                    value={availabilityBn}
                    onChange={e => setAvailabilityBn(e.target.value)}
                    placeholder="২৪ ঘণ্টা দিন-রাত সার্বক্ষণিক প্রস্তুত"
                    className="w-full px-3 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t('ঠিকানা', 'Address')}
                  </label>
                  <input
                    type="text"
                    value={addressBn}
                    onChange={e => setAddressBn(e.target.value)}
                    placeholder="গ্রাম বা কার্যালয়ের পুরো ঠিকানা"
                    className="w-full px-3 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Description / Public Note */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('নাগরিক তথ্য ও সংক্ষিপ্ত বিবরণী', 'Citizen Note / Description')}
                </label>
                <textarea
                  rows={2}
                  value={descriptionBn}
                  onChange={e => setDescriptionBn(e.target.value)}
                  placeholder="যেমন: যেকোনো জরুরি প্রয়োজনে সকাল ৯টা হতে রাত ১১টা পর্যন্ত সরাসরি যোগাযোগ করা যাবে..."
                  className="w-full px-3 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Status Flags */}
              <div className="flex flex-wrap items-center gap-6 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={e => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>{t('ওয়েবসাইটে প্রকাশ করুন (Public)', 'Publicly Published')}</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={e => setIsVerified(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>{t('যাচাইকৃত নম্বর (Verified)', 'Verified Status')}</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEmergency}
                    onChange={e => setIsEmergency(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span>{t('জরুরি হটলাইন (Emergency)', 'Emergency Hotline')}</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-amber-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDemoPlaceholder}
                    onChange={e => setIsDemoPlaceholder(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>{t('ডেমো টেমপ্লেট সতর্কতা প্রদর্শন', 'Show Demo Warning')}</span>
                </label>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-500 font-semibold">{t('প্রদর্শন ক্রম:', 'Sort Order:')}</span>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={e => setSortOrder(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs text-stone-900 bg-white border border-stone-300 rounded-lg text-center font-bold"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? t('সংরক্ষণ হচ্ছে...', 'Saving...') : t('সংরক্ষণ করুন', 'Save Contact')}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ---------------- CREATE / EDIT CATEGORY MODAL ---------------- */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900">
                {editingCategory ? t('ক্যাটাগরি সম্পাদনা', 'Edit Category') : t('নতুন সেবা ক্যাটাগরি তৈরি', 'Create Category')}
              </h3>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('ক্যাটাগরির নাম (বাংলা) *', 'Category Name (Bangla) *')}
                </label>
                <input
                  type="text"
                  value={catNameBn}
                  onChange={e => setCatNameBn(e.target.value)}
                  placeholder="যেমন: পল্লী বিদ্যুৎ ও ইলেকট্রিশিয়ান"
                  required
                  className="w-full px-3 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('ক্যাটাগরির নাম (English)', 'Category Name (English)')}
                </label>
                <input
                  type="text"
                  value={catNameEn}
                  onChange={e => setCatNameEn(e.target.value)}
                  placeholder="e.g. Electrician"
                  className="w-full px-3 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('স্লাগ / আইডেন্টিফায়ার (ঐচ্ছিক)', 'Slug / Identifier')}
                </label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={e => setCatSlug(e.target.value)}
                  placeholder="e.g. electrician"
                  className="w-full px-3 py-2 text-xs font-mono text-stone-900 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('সংক্ষিপ্ত বিবরণী (ঐচ্ছিক)', 'Description')}
                </label>
                <textarea
                  rows={2}
                  value={catDescBn}
                  onChange={e => setCatDescBn(e.target.value)}
                  placeholder="এই ক্যাটাগরিতে কী কী সেবা অন্তর্ভুক্ত থাকবে..."
                  className="w-full px-3 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={catIsActive}
                    onChange={e => setCatIsActive(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>{t('সক্রিয় ক্যাটাগরি', 'Active')}</span>
                </label>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-500 font-semibold">{t('ক্রম:', 'Sort:')}</span>
                  <input
                    type="number"
                    value={catSortOrder}
                    onChange={e => setCatSortOrder(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-lg text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl cursor-pointer"
                >
                  {t('বাতিল', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl cursor-pointer shadow-sm"
                >
                  {t('সংরক্ষণ করুন', 'Save Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
