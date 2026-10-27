import { Head, router, useForm } from "@inertiajs/react";
import { AdminLayout } from "../../Layouts/AdminLayout";
import { useState, type FormEvent } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface ContactRow {
  id: number;
  categoryId?: number | null;
  nameBn: string;
  nameEn: string;
  designationBn?: string | null;
  designationEn?: string | null;
  category?: string;
  phone?: string | null;
  whatsapp?: string | null;
  area?: string | null;
  ward?: string | null;
  serviceArea?: string | null;
  isEmergency: boolean;
  isVerified: boolean;
  isPublished: boolean;
  isDemoPlaceholder: boolean;
  photoUrl?: string | null;
  vehiclePhotoUrl?: string | null;
}
interface Category {
  id: number;
  slug: string;
  nameBn: string;
  nameEn: string;
}
interface Props {
  contacts: {
    data: ContactRow[];
    current_page: number;
    last_page: number;
    links?: { url: string | null; label: string; active: boolean }[];
  };
  categories: Category[];
  filters: {
    search?: string;
    category_id?: number;
    is_verified?: boolean;
    is_published?: boolean;
    is_demo?: boolean;
    is_emergency?: boolean;
  };
}

export default function ContactManagement({
  contacts,
  categories,
  filters,
}: Props) {
  const { t, lang } = useLanguage();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterState, setFilterState] = useState({
    search: filters.search ?? "",
    category_id: filters.category_id ? String(filters.category_id) : "",
    is_verified:
      filters.is_verified === undefined
        ? ""
        : String(Number(filters.is_verified)),
    is_published:
      filters.is_published === undefined
        ? ""
        : String(Number(filters.is_published)),
    is_demo:
      filters.is_demo === undefined ? "" : String(Number(filters.is_demo)),
    is_emergency:
      filters.is_emergency === undefined
        ? ""
        : String(Number(filters.is_emergency)),
  });
  const form = useForm({
    category_id: categories[0]?.id ?? "",
    name_bn: "",
    name_en: "",
    designation_bn: "",
    designation_en: "",
    phone: "",
    whatsapp: "",
    area: "",
    ward: "",
    service_area: "",
    photo_path: "",
    photo_file: null as File | null,
    vehicle_photo_file: null as File | null,
    is_emergency: false,
    is_verified: false,
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
  const applyFilters = (event: FormEvent) => {
    event.preventDefault();
    router.get("/admin/contacts", filterState, {
      preserveState: true,
      preserveScroll: true,
    });
  };
  const clearFilters = () => {
    const cleared = {
      search: "",
      category_id: "",
      is_verified: "",
      is_published: "",
      is_demo: "",
      is_emergency: "",
    };
    setFilterState(cleared);
    router.get(
      "/admin/contacts",
      {},
      { preserveState: true, preserveScroll: true },
    );
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.transform((data) => ({
      ...data,
      ...(editingId ? { _method: "put" } : {}),
    }));
    form.post(editingId ? `/admin/contacts/${editingId}` : "/admin/contacts", {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setEditingId(null);
        form.reset();
      },
    });
  };
  const edit = (contact: ContactRow) => {
    setEditingId(contact.id);
    form.setData({
      category_id: contact.categoryId ?? categories[0]?.id ?? "",
      name_bn: contact.nameBn,
      name_en: contact.nameEn,
      designation_bn: contact.designationBn ?? "",
      designation_en: contact.designationEn ?? "",
      phone: contact.phone ?? "",
      whatsapp: contact.whatsapp ?? "",
      area: contact.area ?? "",
      ward: contact.ward ?? "",
      service_area: contact.serviceArea ?? "",
      photo_path: "",
      photo_file: null,
      vehicle_photo_file: null,
      is_emergency: contact.isEmergency,
      is_verified: contact.isVerified,
      is_published: contact.isPublished,
      is_demo: contact.isDemoPlaceholder,
    });
  };

  return (
    <AdminLayout currentPage="contacts" setCurrentPage={navigate}>
      <Head title={t('যোগাযোগ', 'Contacts')} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">
            {t('যাচাইকৃত ডিরেক্টরি', 'Verified directory')}
          </p>
          <h1 className="text-3xl font-serif font-bold">{t('যোগাযোগ', 'Contacts')}</h1>
          <p className="text-sm text-stone-500 mt-1">
            {t('রেকর্ড মুছে না ফেলে আর্কাইভ করুন। শুধুমাত্র অ্যাডমিন কর্তৃক যাচাইকৃত ফোন নম্বরই পাবলিকভাবে দেখানো হয়।', 'Archive records instead of deleting them. Only verified administrator-supplied phone numbers are public.')}
          </p>
        </div>
        <form
          onSubmit={applyFilters}
          className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-4"
        >
          <input
            value={filterState.search}
            onChange={(e) =>
              setFilterState({ ...filterState, search: e.target.value })
            }
            placeholder={t('নাম, ফোন, এলাকা অনুসন্ধান...', 'Search name, phone, area...')}
            className="sm:col-span-2 border rounded-xl px-3 py-2 text-sm"
          />
          <select
            value={filterState.category_id}
            onChange={(e) =>
              setFilterState({ ...filterState, category_id: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="">{t('সকল ক্যাটেগরি', 'All categories')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nameEn}
              </option>
            ))}
          </select>
          <select
            value={filterState.is_verified}
            onChange={(e) =>
              setFilterState({ ...filterState, is_verified: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="">Verification</option>
            <option value="1">Verified</option>
            <option value="0">Unverified</option>
          </select>
          <select
            value={filterState.is_published}
            onChange={(e) =>
              setFilterState({ ...filterState, is_published: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="">Visibility</option>
            <option value="1">Published</option>
            <option value="0">Archived</option>
          </select>
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
          <select
            required
            className="border rounded-xl px-3 py-2 text-sm"
            value={form.data.category_id}
            onChange={(e) =>
              form.setData("category_id", Number(e.target.value))
            }
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nameEn}
              </option>
            ))}
          </select>
          <input
            required
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder={t('নাম (বাংলা)', 'Bangla name')}
            value={form.data.name_bn}
            onChange={(e) => form.setData("name_bn", e.target.value)}
          />
          <input
            required
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder={t('নাম (ইংরেজি)', 'English name')}
            value={form.data.name_en}
            onChange={(e) => form.setData("name_en", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder={t('ফোন', 'Phone')}
            value={form.data.phone}
            onChange={(e) => form.setData("phone", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder={t('পদবী', 'Designation')}
            value={form.data.designation_en}
            onChange={(e) => form.setData("designation_en", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder={t('ওয়ার্ড', 'Ward')}
            value={form.data.ward}
            onChange={(e) => form.setData("ward", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder={t('এলাকা / সেবা এলাকা', 'Area / service area')}
            value={form.data.service_area}
            onChange={(e) => form.setData("service_area", e.target.value)}
          />
          <label className="text-xs text-stone-600">
            {t('ছবি', 'Portrait')}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="block mt-1 text-xs"
              onChange={(e) =>
                form.setData("photo_file", e.target.files?.[0] ?? null)
              }
            />
          </label>
          <label className="text-xs text-stone-600">
            {t('যানবাহনের ছবি', 'Vehicle photo')}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="block mt-1 text-xs"
              onChange={(e) =>
                form.setData("vehicle_photo_file", e.target.files?.[0] ?? null)
              }
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.data.is_verified}
              onChange={(e) => form.setData("is_verified", e.target.checked)}
            />{" "}
            {t('যাচাইকৃত', 'Verified')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.data.is_emergency}
              onChange={(e) => form.setData("is_emergency", e.target.checked)}
            />{" "}
            {t('জরুরি', 'Emergency')}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.data.is_published}
              onChange={(e) => form.setData("is_published", e.target.checked)}
            />{" "}
            {t('প্রকাশিত', 'Published')}
          </label>
          <button
            disabled={form.processing}
            className="rounded-xl bg-emerald-800 text-white px-4 py-2 text-sm font-semibold"
          >
            {editingId ? t('যোগাযোগ আপডেট করুন', 'Update contact') : t('যোগাযোগ সংরক্ষণ করুন', 'Save contact')}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.data.map((contact) => (
            <article
              key={contact.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 flex gap-3"
            >
              {contact.photoUrl ? (
                <img
                  src={contact.photoUrl}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-stone-100" />
              )}
              <div className="min-w-0 flex-1">
                <h2 className="font-bold truncate">{contact.nameEn}</h2>
                <p className="text-xs text-stone-500">{contact.category}</p>
                <p className="text-xs text-stone-600">
                  {contact.phone || "No phone published"}
                </p>
                <div className="mt-2 flex gap-3 text-[10px]">
                  <span
                    className={
                      contact.isVerified ? "text-emerald-700" : "text-stone-400"
                    }
                  >
                    {contact.isVerified ? t('যাচাইকৃত', 'Verified') : t('অযাচাইকৃত', 'Unverified')}
                  </span>
                  {contact.isDemoPlaceholder && (
                    <span className="text-amber-700">{t('ডেমো', 'Demo')}</span>
                  )}
                </div>
                <div className="mt-3 flex gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => edit(contact)}
                    className="text-emerald-700"
                  >
                    {t('সম্পাদনা', 'Edit')}
                  </button>
                  {contact.isPublished ? (
                    <button
                      type="button"
                      onClick={() =>
                        router.patch(
                          `/admin/contacts/${contact.id}/archive`,
                          {},
                          { preserveScroll: true },
                        )
                      }
                      className="text-rose-700"
                    >
                      {t('আর্কাইভ', 'Archive')}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        router.patch(
                          `/admin/contacts/${contact.id}/unarchive`,
                          {},
                          { preserveScroll: true },
                        )
                      }
                      className="text-emerald-700"
                    >
                      {t('আনআর্কাইভ', 'Unarchive')}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(t('এই যোগাযোগটি স্থায়ীভাবে মুছে ফেলতে চান?', 'Delete this contact permanently?'))) {
                        router.delete(`/admin/contacts/${contact.id}`, {
                          preserveScroll: true,
                        });
                      }
                    }}
                    className="text-red-800"
                  >
                    {t('মুছে ফেলুন', 'Delete')}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {contacts.links && contacts.last_page > 1 && (
          <nav className="flex flex-wrap gap-2">
            {contacts.links.map(
              (link, index) =>
                link.url && (
                  <button
                    key={`${link.label}-${index}`}
                    type="button"
                    onClick={() =>
                      router.get(
                        link.url as string,
                        {},
                        { preserveState: true, preserveScroll: true },
                      )
                    }
                    className={`rounded-lg border px-3 py-1 text-xs ${link.active ? "bg-emerald-700 text-white" : "border-stone-300"}`}
                    dangerouslySetInnerHTML={{
                      __html: link.label.replace(/&laquo;|&raquo;/g, ""),
                    }}
                  />
                ),
            )}
          </nav>
        )}
      </div>
    </AdminLayout>
  );
}
