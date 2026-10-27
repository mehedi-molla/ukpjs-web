import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { Project, ProjectStatus } from '../../types';
import { formatCurrency, formatDate, toBengaliNumber } from '../../utils/formatters';
import { PlusCircle, Edit, Trash2, X, Check, Layers } from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const { lang, t } = useLanguage();
  const { showToast } = useNotification();
  const isBn = lang === 'bn';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit / Create modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [code, setCode] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState('অবকাঠামো উন্নয়ন');
  const [location, setLocation] = useState('উমারখালী, কিস্তুপুর');
  const [status, setStatus] = useState<ProjectStatus>('running');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [shortDescBn, setShortDescBn] = useState('');
  const [fullDescBn, setFullDescBn] = useState('');
  const [featuredImage, setFeaturedImage] = useState('/images/project_street_light_1790159010055.jpg');
  const [beneficiariesCount, setBeneficiariesCount] = useState('500');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setCode(`PRJ-${Date.now().toString().slice(-4)}`);
    setTitleBn('');
    setTitleEn('');
    setCategory('অবকাঠামো উন্নয়ন');
    setLocation('উমারখালী, কিস্তুপুর');
    setStatus('running');
    setEstimatedBudget('25000');
    setShortDescBn('');
    setFullDescBn('');
    setBeneficiariesCount('500');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingProject(p);
    setCode(p.code);
    setTitleBn(p.titleBn);
    setTitleEn(p.titleEn);
    setCategory(p.category);
    setLocation(p.location);
    setStatus(p.status);
    setEstimatedBudget(String(p.estimatedBudget));
    setStartDate(p.startDate);
    setShortDescBn(p.shortDescBn);
    setFullDescBn(p.fullDescBn);
    setFeaturedImage(p.featuredImage);
    setBeneficiariesCount(String(p.beneficiariesCount || 0));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn || !estimatedBudget) {
      showToast(t('প্রয়োজনীয় তথ্য পূরণ করুন', 'Fill required fields'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        code,
        titleBn,
        titleEn: titleEn || titleBn,
        category,
        location,
        status,
        estimatedBudget: Number(estimatedBudget),
        startDate,
        shortDescBn,
        shortDescEn: shortDescBn,
        fullDescBn: fullDescBn || shortDescBn,
        fullDescEn: fullDescBn || shortDescBn,
        featuredImage,
        beneficiariesCount: Number(beneficiariesCount),
        beneficiaryInfoBn: `${beneficiariesCount} জন গ্রামবাসী`,
        beneficiaryInfoEn: `${beneficiariesCount} residents`,
      };

      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(t('প্রকল্প সফলভাবে সংরক্ষিত হয়েছে', 'Project saved successfully'), 'success');
        setIsModalOpen(false);
        fetchProjects();
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
            {t('প্রকল্প ব্যবস্থাপনা প্যানেল', 'Project Management Suite')}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {t('নতুন প্রকল্প তৈরি, বাজেট নির্ধারণ, স্থিতি পরিবর্তন ও অগ্রগতি তদারকি।', 'Create and manage community welfare projects, budgets and outcomes.')}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('+ নতুন প্রকল্প যুক্ত করুন', '+ Add New Project')}</span>
        </button>
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 font-semibold">
            <tr>
              <th className="px-4 py-3">{t('কোড', 'Code')}</th>
              <th className="px-4 py-3">{t('প্রকল্পের নাম', 'Project Title')}</th>
              <th className="px-4 py-3">{t('ক্যাটাগরি', 'Category')}</th>
              <th className="px-4 py-3">{t('অবস্থা', 'Status')}</th>
              <th className="px-4 py-3 text-right">{t('বাজেট', 'Budget')}</th>
              <th className="px-4 py-3 text-right">{t('সংগৃহীত', 'Collected')}</th>
              <th className="px-4 py-3 text-right">{t('ব্যয়িত', 'Spent')}</th>
              <th className="px-4 py-3 text-center">{t('অ্যাকশন', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            {projects.map(p => (
              <tr key={p.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-mono font-bold text-emerald-800">{p.code}</td>
                <td className="px-4 py-3 max-w-xs">
                  <div className="font-bold text-stone-900">{isBn ? p.titleBn : p.titleEn}</div>
                  <div className="text-[11px] text-stone-400">{p.location}</div>
                </td>
                <td className="px-4 py-3 text-stone-600">{p.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold text-white ${
                    p.status === 'completed' ? 'bg-emerald-800' : p.status === 'running' ? 'bg-amber-800' : 'bg-stone-700'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-stone-900">
                  {formatCurrency(p.estimatedBudget, isBn)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">
                  {formatCurrency(p.collectedAmount || 0, isBn)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-rose-700">
                  {formatCurrency(p.expenseAmount || 0, isBn)}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleOpenEdit(p)}
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

      {/* Modal: Create / Edit Project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold font-serif text-stone-900 text-base">
                {editingProject ? t('প্রকল্প তথ্য সম্পাদনা', 'Edit Project') : t('নতুন প্রকল্প তৈরি', 'Create New Project')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('প্রকল্প কোড *', 'Project Code *')}</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono font-bold text-stone-900 border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('অবস্থা (Status) *', 'Status *')}</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as ProjectStatus)}
                    className="w-full px-3 py-1.5 text-xs text-stone-900 border border-stone-300 rounded-lg focus:outline-none"
                  >
                    <option value="running">{t('চলমান (Running)', 'Running')}</option>
                    <option value="completed">{t('সম্পন্ন (Completed)', 'Completed')}</option>
                    <option value="upcoming">{t('আসন্ন (Upcoming)', 'Upcoming')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">{t('প্রকল্পের শিরোনাম (বাংলা) *', 'Title (Bangla) *')}</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: গ্রামে সোলার স্ট্রিট লাইট স্থাপন"
                  value={titleBn}
                  onChange={e => setTitleBn(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-stone-900 border border-stone-300 rounded-lg focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('ক্যাটাগরি', 'Category')}</label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs text-stone-900 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('বাজেট (টাকা) *', 'Budget (BDT) *')}</label>
                  <input
                    type="number"
                    required
                    value={estimatedBudget}
                    onChange={e => setEstimatedBudget(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono font-bold text-stone-900 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">{t('সংক্ষিপ্ত বিবরণ *', 'Short Description *')}</label>
                <textarea
                  rows={2}
                  required
                  value={shortDescBn}
                  onChange={e => setShortDescBn(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs text-stone-900 border border-stone-300 rounded-lg"
                />
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
                  {isSubmitting ? t('সংরক্ষণ হচ্ছে...', 'Saving...') : t('সংরক্ষণ করুন', 'Save Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
