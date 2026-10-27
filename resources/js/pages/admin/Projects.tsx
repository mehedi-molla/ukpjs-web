import { Head, router, useForm } from "@inertiajs/react";
import { AdminLayout } from "../../Layouts/AdminLayout";
import type { FormEvent } from "react";
import type { Project } from "../../types";
import { useLanguage } from "../../context/LanguageContext";

interface Props {
  projects: { data: Project[]; current_page: number; last_page: number };
}

export default function Projects({ projects }: Props) {
    const { lang, t } = useLanguage();
  const form = useForm({
    code: "",
    title_bn: "",
    title_en: "",
    category: "welfare",
    estimated_budget: "0",
    status: "upcoming",
    location: "",
    start_date: new Date().toISOString().slice(0, 10),
    short_desc_bn: "",
    short_desc_en: "",
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
    form.post("/admin/projects", {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () =>
        form.reset(
          "code",
          "title_bn",
          "title_en",
          "estimated_budget",
          "location",
          "short_desc_bn",
          "short_desc_en",
          "featured_image_file",
          "gallery_files",
        ),
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
          onSubmit={submit}
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
          <button
            disabled={form.processing}
            className="rounded-xl bg-emerald-800 text-white px-4 py-2 text-sm font-semibold"
          >
            {t('প্রকল্প তৈরি করুন', 'Create project')}
          </button>
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
                    {project.status === 'completed' ? t('সম্পন্ন', 'Completed') : project.status === 'running' ? t('চলমান', 'Running') : project.status === 'upcoming' ? t('আসন্ন', 'Upcoming') : project.status}
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
                <div className="flex justify-between text-sm">
                  <span>
                    {t('বাজেট:', 'Budget:')} BDT{" "}
                    {Number(project.estimatedBudget).toLocaleString()}
                  </span>
                  <span>
                    {t('সংগৃহীত:', 'Collected:')} BDT{" "}
                    {Number(project.collectedAmount || 0).toLocaleString()}
                  </span>
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
      </div>
    </AdminLayout>
  );
}
