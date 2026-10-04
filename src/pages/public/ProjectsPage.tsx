import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Project, ProjectStatus } from '../../types';
import { formatCurrency, toBengaliNumber, formatDate } from '../../utils/formatters';
import { Search, ChevronRight, Layers, CheckCircle2, Clock, Calendar } from 'lucide-react';

interface ProjectsPageProps {
  setCurrentPage: (page: string) => void;
  setSelectedProjectSlug: (slug: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  setCurrentPage,
  setSelectedProjectSlug,
}) => {
  const { lang, t } = useLanguage();
  const isBn = lang === 'bn';

  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | ProjectStatus>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProjects = projects.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.titleBn.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleProjectClick = (slug: string) => {
    setSelectedProjectSlug(slug);
    setCurrentPage('project-detail');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-stone-200">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          {t('জনকল্যাণ ও উন্নয়ন', 'Community Welfare & Development')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-1">
          {t('সংগঠনের প্রকল্পসমূহ', 'Our Organization Projects')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
          {t(
            'সৌর সড়কবাতি, মসজিদে খেদমত, বৃক্ষরোপণ, অসহায় চিকিৎসা ও ঈদ সহায়তা প্রকল্পগুলোর বিস্তারিত তথ্য ও অর্থনৈতিক হিসাব।',
            'Explore completed, active, and upcoming social welfare projects with transparent financial accountability.'
          )}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Interactive segmented filter control */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t('সকল প্রকল্প', 'All Projects')}
          </button>
          <button
            onClick={() => setFilter('running')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'running'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t('চলমান (Running)', 'Running')}
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'completed'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t('সম্পন্ন (Completed)', 'Completed')}
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filter === 'upcoming'
                ? 'bg-white text-stone-900 shadow-sm font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t('আসন্ন (Upcoming)', 'Upcoming')}
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('প্রকল্প খুঁজুন...', 'Search projects...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs text-stone-900 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-400">
          {t('প্রকল্প লোড হচ্ছে...', 'Loading projects...')}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 text-center bg-stone-50 rounded-2xl border border-stone-200">
          <p className="text-sm text-stone-500">{t('কোনো প্রকল্প পাওয়া যায়নি।', 'No projects found.')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => {
            const collected = project.collectedAmount || 0;
            const spent = project.expenseAmount || 0;
            const budget = project.estimatedBudget || 1;
            const percent = Math.min(100, Math.round((collected / budget) * 100));

            return (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.slug)}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col overflow-hidden cursor-pointer group"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-stone-100">
                  <img
                    src={project.featuredImage}
                    alt={project.titleBn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-md text-white ${
                      project.status === 'completed'
                        ? 'bg-emerald-900/90'
                        : project.status === 'running'
                        ? 'bg-amber-800/90'
                        : 'bg-stone-800/90'
                    }`}>
                      {project.status === 'completed' && t('সম্পন্ন', 'Completed')}
                      {project.status === 'running' && t('চলমান', 'Running')}
                      {project.status === 'upcoming' && t('আসন্ন', 'Upcoming')}
                    </span>
                    <span className="text-[10px] font-mono bg-black/60 text-stone-200 px-1.5 py-0.5 rounded backdrop-blur-md">
                      {project.code}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[11px] text-stone-500 mb-1">
                      <span>{project.category}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{project.location}</span>
                    </div>
                    <h3 className="text-base font-bold font-serif text-stone-900 group-hover:text-emerald-800 transition-colors">
                      {isBn ? project.titleBn : project.titleEn}
                    </h3>
                    <p className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {isBn ? project.shortDescBn : project.shortDescEn}
                    </p>
                  </div>

                  {/* Financial Stats */}
                  <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                    {project.status === 'running' ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-stone-500">{t('সংগৃহীত অনুদান:', 'Collected:')}</span>
                          <span className="font-mono font-bold text-emerald-800">{formatCurrency(collected, isBn)}</span>
                        </div>
                        <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                        <div className="flex justify-between text-[11px] text-stone-400">
                          <span>{t(`বাজেট: ${formatCurrency(budget, isBn)}`, `Budget: ${formatCurrency(budget, false)}`)}</span>
                          <span>{toBengaliNumber(percent)}% {t('সংগৃহীত', 'Funded')}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center text-stone-600">
                        <span>{t('মোট ব্যয়িত অর্থ:', 'Total Cost:')}</span>
                        <span className="font-mono font-bold text-stone-900">
                          {formatCurrency(spent || project.estimatedBudget, isBn)}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                      <span>{t('হিসাব ও বিবরণ দেখুন', 'View Ledger & Details')}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
