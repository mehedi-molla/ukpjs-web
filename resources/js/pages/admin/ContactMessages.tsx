import { Head, router } from "@inertiajs/react";
import { AdminLayout } from "../../Layouts/AdminLayout";
import { useState, type FormEvent } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface Message {
  id: number;
  name: string;
  phone: string;
  message: string;
  status: string;
  createdAt?: string | null;
}
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
interface Props {
  messages: { data: Message[]; last_page?: number; links?: PaginationLink[] };
  filters: { search?: string; status?: string };
}

export default function ContactMessages({ messages, filters }: Props) {
  const { t } = useLanguage();
  const [filterState, setFilterState] = useState({
    search: filters.search ?? "",
    status: filters.status ?? "",
  });
  const navigate = (page: string) =>
    router.visit(page === "dashboard" ? "/admin/dashboard" : `/admin/${page}`);
  const review = (id: number, status: string) =>
    router.patch(
      `/admin/contact-messages/${id}`,
      { status },
      { preserveScroll: true },
    );
  const applyFilters = (event: FormEvent) => {
    event.preventDefault();
    router.get("/admin/contact-messages", filterState, {
      preserveState: true,
      preserveScroll: true,
    });
  };
  const clearFilters = () => {
    setFilterState({ search: "", status: "" });
    router.get(
      "/admin/contact-messages",
      {},
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <AdminLayout currentPage="contact-messages" setCurrentPage={navigate}>
      <Head title={t('যোগাযোগ বার্তা', 'Contact messages')} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">
            {t('ব্যক্তিগত ইনবক্স', 'Private inbox')}
          </p>
          <h1 className="text-3xl font-serif font-bold">{t('যোগাযোগ বার্তা', 'Contact messages')}</h1>
          <p className="text-sm text-stone-500 mt-1">
            {t('বার্তাগুলি ব্যক্তিগতভাবে সংরক্ষিত এবং অ্যাডমিন অনুসরণ জন্য রাখা হয়।', 'Messages remain private and are retained for administrator follow-up.')}
          </p>
        </div>
        <form
          onSubmit={applyFilters}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-4"
        >
          <input
            value={filterState.search}
            onChange={(e) =>
              setFilterState({ ...filterState, search: e.target.value })
            }
            placeholder={t('নাম, ফোন, বার্তা অনুসন্ধান', 'Search name, phone, message')}
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
            <option value="pending">{t('অপেক্ষমাণ', 'Pending')}</option>
            <option value="read">{t('পঠিত', 'Read')}</option>
            <option value="replied">{t('উত্তর দেওয়া হয়েছে', 'Replied')}</option>
            <option value="archived">{t('আর্কাইভ', 'Archived')}</option>
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
        <section className="space-y-4">
          {messages.data.map((message) => (
            <article
              key={message.id}
              className="rounded-2xl border border-stone-200 bg-white p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{message.name}</h2>
                  <p className="text-xs text-stone-500">
                    {message.phone} · {message.createdAt ?? "Unknown date"}
                  </p>
                </div>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-[10px] uppercase tracking-wide">
                  {message.status === 'pending' ? t('অপেক্ষমাণ', 'Pending') : message.status === 'read' ? t('পঠিত', 'Read') : message.status === 'replied' ? t('উত্তর দেওয়া হয়েছে', 'Replied') : message.status === 'archived' ? t('আর্কাইভ', 'Archived') : message.status}
                </span>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm text-stone-700">
                {message.message}
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                {message.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => review(message.id, "read")}
                    className="text-emerald-700"
                  >
                    {t('পঠিত হিসেবে চিহ্নিত করুন', 'Mark read')}
                  </button>
                )}
                {message.status !== "replied" &&
                  message.status !== "archived" && (
                    <button
                      type="button"
                      onClick={() => review(message.id, "replied")}
                      className="text-blue-700"
                    >
                      {t('উত্তর দেওয়া হয়েছে হিসেবে চিহ্নিত করুন', 'Mark replied')}
                    </button>
                  )}
                {message.status !== "archived" && (
                  <button
                    type="button"
                    onClick={() => review(message.id, "archived")}
                    className="text-rose-700"
                  >
                    {t('আর্কাইভ', 'Archive')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(t('এই বার্তাটি স্থায়ীভাবে মুছে ফেলতে চান?', 'Delete this message permanently?'))) {
                      router.delete(`/admin/contact-messages/${message.id}`, {
                        preserveScroll: true,
                      });
                    }
                  }}
                  className="text-red-800"
                >
                  {t('মুছে ফেলুন', 'Delete')}
                </button>
              </div>
            </article>
          ))}
          {messages.data.length === 0 && (
            <p className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-500">
              {t('কোনো যোগাযোগ বার্তা পাওয়া যায়নি।', 'No contact messages found.')}
            </p>
          )}
        </section>
        {messages.links && (messages.last_page ?? 1) > 1 && (
          <nav className="flex flex-wrap gap-2">
            {messages.links.map(
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
      </main>
    </AdminLayout>
  );
}
