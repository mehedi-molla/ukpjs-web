import { Head, router, useForm } from "@inertiajs/react";
import { AdminLayout } from "../../Layouts/AdminLayout";
import { useState, type FormEvent } from "react";
import { useLanguage } from "../../context/LanguageContext";
import type { Project } from '../../types';

interface Props {
  projects: {
    data: Project[];
    current_page: number;
    last_page: number;
    links?: { url: string | null; label: string; active: boolean }[];
  };
  filters: { search?: string; status?: string; category?: string };
}

export default function ProjectManagement({ projects, filters }: Props) {
    const { lang, t } = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterState, setFilterState] = useState({
    search: filters.search ?? "",
    status: filters.status ?? "",
    category: filters.category ?? "",
  });
  const form = useForm({
    code: "",
    title_bn: "",
    title_en: "",
    category: "welfare",
    estimated_budget: "0",
    status: "upcoming",
    location: "",
    start_date: new Date().toISOString().slice(0, 10),
    featured_image_file: null as File | null,
    gallery_files: [] as File[],
    is_published: true,
    is_demo: false,
  });
  const navigate = (page: string) => {
    const routes: Record<string, string> = {
      dashboard: "/admin/dashboard",
      transactions: "/admin/transactions",
      projects: "/admin/projects",
      contacts: "/admin/contacts",
    };
    if (routes[page]) router.visit(routes[page]);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.transform((data) => ({
      ...data,
      ...(editingId ? { _method: "put" } : {}),
    }));
    form.post(editingId ? `/admin/projects/${editingId}` : "/admin/projects", {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setEditingId(null);
        form.reset(
          "code",
          "title_bn",
          "title_en",
          "estimated_budget",
          "location",
          "featured_image_file",
          "gallery_files",
        );
      },
    });
  };
  const edit = (project: Project) => {
    setEditingId(project.id);
    form.setData({
      code: project.code,
      title_bn: project.titleBn,
      title_en: project.titleEn,
      category: project.category,
      estimated_budget: String(project.estimatedBudget),
      status: project.status,
      location: project.location,
      start_date: project.startDate ?? new Date().toISOString().slice(0, 10),
      featured_image_file: null,
      gallery_files: [],
      is_published: project.isPublished,
      is_demo: project.isDemo,
    });
  };
  const applyFilters = (event: FormEvent) => {
    event.preventDefault();
    router.get("/admin/projects", filterState, {
      preserveState: true,
      preserveScroll: true,
    });
  };
  const clearFilters = () => {
    const cleared = { search: "", status: "", category: "" };
    setFilterState(cleared);
    router.get("/admin/projects", cleared, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AdminLayout currentPage="projects" setCurrentPage={navigate}>
      <Head title={t('প্রকল্প', 'Projects')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">
            {t('কল্যাণ কর্মসূচি', 'Welfare programs')}
          </p>
          <h1 className="text-3xl font-serif font-bold">{t('প্রকল্পসমূহ', 'Projects')}</h1>
        </div>
        <form
          onSubmit={applyFilters}
          className="grid grid-cols-1 sm:grid-cols-4 gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-4"
        >
          <input
            value={filterState.search}
            onChange={(e) =>
              setFilterState({ ...filterState, search: e.target.value })
            }
            placeholder={t('কোড, শিরোনাম, অবস্থান অনুসন্ধান...', 'Search code, title, location...')}
            className="sm:col-span-2 border rounded-xl px-3 py-2 text-sm"
          />
          <select
            value={filterState.status}
            onChange={(e) =>
              setFilterState({ ...filterState, status: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="">{t('সকল অবস্থা', 'All statuses')}</option>
            <option value="upcoming">{t('আসন্ন', 'Upcoming')}</option>
            <option value="running">{t('চলমান', 'Running')}</option>
            <option value="completed">{t('সম্পন্ন', 'Completed')}</option>
            <option value="paused">{t('বিরতি', 'Paused')}</option>
          </select>
          <input
            value={filterState.category}
            onChange={(e) =>
              setFilterState({ ...filterState, category: e.target.value })
            }
            placeholder={t('বিভাগ', 'Category')}
            className="border rounded-xl px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white">
              {t('ফিল্টার', 'Filter')}
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-stone-300 px-3 py-2 text-xs"
            >
              {t('মুছুন', 'Clear')}
            </button>
          </div>
        </form>
        <form
          onSubmit={submit}
          encType="multipart/form-data"
          className="bg-white rounded-2xl border border-stone-200 p-5 grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <input
            required
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder={t('কোড', 'Code')}
            value={form.data.code}
            onChange={(e) => form.setData("code", e.target.value)}
          />
          <input
            required
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder={t('বাংলা শিরোনাম', 'Bangla title')}
            value={form.data.title_bn}
            onChange={(e) => form.setData("title_bn", e.target.value)}
          />
          <input
            required
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder={t('ইংরেজি শিরোনাম', 'English title')}
            value={form.data.title_en}
            onChange={(e) => form.setData("title_en", e.target.value)}
          />
          <select
            className="border rounded-xl px-3 py-2 text-sm"
            value={form.data.status}
            onChange={(e) => form.setData("status", e.target.value)}
          >
            <option value="upcoming">{t('আসন্ন', 'Upcoming')}</option>
            <option value="running">{t('চলমান', 'Running')}</option>
            <option value="completed">{t('সম্পন্ন', 'Completed')}</option>
          </select>
          <input
            required
            type="number"
            step="0.01"
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder={t('বাজেট', 'Budget')}
            value={form.data.estimated_budget}
            onChange={(e) => form.setData("estimated_budget", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder={t('অবস্থান', 'Location')}
            value={form.data.location}
            onChange={(e) => form.setData("location", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder={t('বিভাগ', 'Category')}
            value={form.data.category}
            onChange={(e) => form.setData("category", e.target.value)}
          />
          <label className="text-xs text-stone-600">
            {t('প্রধান ছবি', 'Featured image')}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="block mt-1 text-xs"
              onChange={(e) =>
                form.setData("featured_image_file", e.target.files?.[0] ?? null)
              }
            />
          </label>
          <label className="text-xs text-stone-600">
            {t('গ্যালারি ছবি', 'Gallery images')}
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="block mt-1 text-xs"
              onChange={(e) =>
                form.setData("gallery_files", Array.from(e.target.files ?? []))
              }
            />
          </label>
          <button
            disabled={form.processing}
            className="rounded-xl bg-emerald-800 text-white px-4 py-2 text-sm font-semibold"
          >
            {editingId ? t('প্রকল্প আপডেট করুন', 'Update project') : t('প্রকল্প তৈরি করুন', 'Create project')}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                form.reset();
              }}
              className="rounded-xl border border-stone-300 px-4 py-2 text-sm"
            >
              {t('বাতিল', 'Cancel')}
            </button>
          )}
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.data.map((project) => (
            <article
              key={project.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden"
            >
              <div className="h-36 bg-stone-100">
                {project.featuredImage && (
                  <img
                    src={project.featuredImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-emerald-700 font-semibold">
                    {project.status === 'completed' ? t('সম্পন্ন', 'Completed') : project.status === 'running' ? t('চলমান', 'Running') : project.status === 'upcoming' ? t('আসন্ন', 'Upcoming') : project.status === 'paused' ? t('বিরতি', 'Paused') : project.status}
                  </span>
                  {project.isDemo && (
                    <span className="text-[10px] text-amber-700">
                      {t('ডেমো ডাটা', 'Demo data')}
                    </span>
                  )}
                </div>
                <h2 className="font-serif font-bold text-lg">
                  {lang === 'bn' ? project.titleBn : project.titleEn}
                </h2>
                <p className="text-xs text-stone-500">
                  {project.category} · {project.location}
                </p>
                <div className="flex justify-between items-center">
                  <span>
                    {t('বাজেট:', 'Budget:')} BDT{" "}
                    {Number(project.estimatedBudget).toLocaleString()}
                  </span>
                  <span>
                    {t('সংগৃহীত:', 'Collected:')} BDT{" "}
                    {Number(project.collectedAmount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => edit(project)}
                    className="text-xs text-emerald-700"
                  >
                    {t('সম্পাদনা করুন', 'Edit project')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                    if (
                      confirm(
                        t('এই প্রকল্পটি স্থায়ীভাবে মুছে ফেলতে চান? এটি সম্পর্কিত রেকর্ডকে প্রভাবিত করতে পারে।', 'Delete this project permanently? This may affect related records.'),
                      )
                    ) {
                        router.delete(`/admin/projects/${project.id}`, {
                          preserveScroll: true,
                        });
                      }
                    }}
                    className="text-xs text-red-800"
                  >
                    {t('মুছে ফেলুন', 'Delete')}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {projects.data.length === 0 && (
          <p className="p-8 text-center text-stone-500 bg-white rounded-2xl border">
            {t('কোনো প্রকল্প পাওয়া যায়নি।', 'No projects found.')}
          </p>
        )}
        {projects.last_page > 1 && (
          <div className="flex flex-wrap gap-2">
            {(projects.links ?? []).map(
              (link) =>
                link.url && (
                  <button
                    key={link.label}
                    disabled={link.active}
                    onClick={() =>
                      router.visit(link.url as string, {
                        preserveState: true,
                        preserveScroll: true,
                      })
                    }
                    className={`rounded-lg px-3 py-1.5 text-xs ${link.active ? "bg-emerald-700 text-white" : "border border-stone-300 text-stone-700"}`}
                  >
                    {link.label
                      .replace(/<[^>]*>/g, "")
                      .replace(/&laquo;/g, "«")
                      .replace(/&raquo;/g, "»")}
                  </button>
                ),
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
