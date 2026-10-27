import { Head, router, useForm } from "@inertiajs/react";
import { AdminLayout } from "../../Layouts/AdminLayout";
import { useState, type FormEvent } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface LedgerRow {
  id: number;
  voucherNo: string;
  type: string;
  fundType: string;
  amount: number;
  occurredAt: string | null;
  status: string;
  isDemo: boolean;
  attachmentUrl?: string | null;
}
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
interface Props {
  transactions: {
    data: LedgerRow[];
    current_page: number;
    last_page: number;
    links?: PaginationLink[];
  };
  filters: {
    search?: string;
    type?: string;
    fund_type?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
  };
}

export default function Ledger({ transactions, filters }: Props) {
  const { lang, t } = useLanguage();
  const form = useForm({
    type: "income",
    fund_type: "general_hadiya",
    amount: "",
    occurred_at: new Date().toISOString().slice(0, 10),
    donor_name: "",
    payment_method: "cash",
    attachment_file: null as File | null,
  });
  const [filterState, setFilterState] = useState({
    search: filters.search ?? "",
    type: filters.type ?? "",
    fund_type: filters.fund_type ?? "",
    status: filters.status ?? "",
    date_from: filters.date_from ?? "",
    date_to: filters.date_to ?? "",
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
    form.post("/admin/transactions", {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => form.reset("amount", "donor_name", "attachment_file"),
    });
  };
  const applyFilters = (event: FormEvent) => {
    event.preventDefault();
    router.get("/admin/transactions", filterState, {
      preserveState: true,
      preserveScroll: true,
    });
  };
  const clearFilters = () => {
    const cleared = {
      search: "",
      type: "",
      fund_type: "",
      status: "",
      date_from: "",
      date_to: "",
    };
    setFilterState(cleared);
    router.get("/admin/transactions", cleared, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AdminLayout currentPage="transactions" setCurrentPage={navigate}>
      <Head title="Transactions" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">
            {t('আর্থিক খতিয়ান', 'Financial ledger')}
          </p>
          <h1 className="text-3xl font-serif font-bold">{t('লেনদেনসমূহ', 'Transactions')}</h1>
        </div>
        <form
          onSubmit={submit}
          encType="multipart/form-data"
          className="bg-white rounded-2xl border border-stone-200 p-5 grid grid-cols-1 md:grid-cols-7 gap-3"
        >
          <select
            className="border rounded-xl px-3 py-2 text-sm"
            value={form.data.type}
            onChange={(e) => form.setData("type", e.target.value)}
          >
            <option value="income">{t('আয়', 'Income')}</option>
            <option value="expense">{t('ব্যয়', 'Expense')}</option>
          </select>
          <select
            className="border rounded-xl px-3 py-2 text-sm"
            value={form.data.fund_type}
            onChange={(e) => form.setData("fund_type", e.target.value)}
          >
            <option value="general_hadiya">{t('সাধারণ হাদিয়া','General Hadiya')}</option>
            <option value="monthly_donation">{t('মাসিক অনুদান','Monthly donation')}</option>
            <option value="project_donation">{t('প্রকল্প অনুদান','Project donation')}</option>
            <option value="sadaqah">{t('সাদাকাহ','Sadaqah')}</option>
            <option value="zakat">{t('যাকাত','Zakat')}</option>
          </select>
          <input
            required
            type="number"
            step="0.01"
            min="0.01"
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder={t('পরিমাণ','Amount')}
            value={form.data.amount}
            onChange={(e) => form.setData("amount", e.target.value)}
          />
          <input
            required
            type="date"
            className="border rounded-xl px-3 py-2 text-sm"
            value={form.data.occurred_at}
            onChange={(e) => form.setData("occurred_at", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 text-sm"
            placeholder={t('দাতা / প্রাপক','Donor / payee')}
            value={form.data.donor_name}
            onChange={(e) => form.setData("donor_name", e.target.value)}
          />
          <select
            className="border rounded-xl px-3 py-2 text-sm"
            value={form.data.payment_method}
            onChange={(e) => form.setData("payment_method", e.target.value)}
          >
            <option value="cash">{t('নগদ অর্থ','Cash')}</option>
            <option value="bkash">{t('bKash','bKash')}</option>
            <option value="nagad">{t('Nagad','Nagad')}</option>
            <option value="rocket">{t('Rocket','Rocket')}</option>
            <option value="bank">{t('ব্যাংক','Bank')}</option>
            <option value="other">{t('অন্যান্য','Other')}</option>
          </select>
          <label className="text-xs text-stone-600">
            {t('প্রমাণ / রসিদ','Proof / receipt')}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="block mt-1 text-xs"
              onChange={(e) =>
                form.setData("attachment_file", e.target.files?.[0] ?? null)
              }
            />
          </label>
          <button
            disabled={form.processing}
            className="rounded-xl bg-emerald-800 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            {t('রেকর্ড','Record')}
          </button>
        </form>
        <form
          onSubmit={applyFilters}
          className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-4"
        >
          <input
            value={filterState.search}
            onChange={(e) =>
              setFilterState({ ...filterState, search: e.target.value })
            }
            placeholder="Search voucher, donor, member..."
            className="sm:col-span-2 border rounded-xl px-3 py-2 text-sm"
          />
          <select
            value={filterState.type}
            onChange={(e) =>
              setFilterState({ ...filterState, type: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="">{t('সব ধরনের','All types')}</option>
            <option value="income">{t('আয়','Income')}</option>
            <option value="expense">{t('ব্যয়','Expense')}</option>
          </select>
          <select
            value={filterState.fund_type}
            onChange={(e) =>
              setFilterState({ ...filterState, fund_type: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="">{t('সমস্ত তহবিল','All funds')}</option>
            <option value="general_hadiya">{t('হাদিয়া','Hadiya')}</option>
            <option value="monthly_donation">{t('মাসিক','Monthly')}</option>
            <option value="project_donation">{t('প্রকল্প','Project')}</option>
            <option value="zakat">{t('যাকাত','Zakat')}</option>
            <option value="sadaqah">{t('সাদাকাহ','Sadaqah')}</option>
          </select>
          <select
            value={filterState.status}
            onChange={(e) =>
              setFilterState({ ...filterState, status: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="">{t('সব স্ট্যাটাস','All status')}</option>
            <option value="completed">{t('সম্পন্ন','Completed')}</option>
            <option value="cancelled">{t('বাতিল করা হয়েছে','Cancelled')}</option>
          </select>
          <input
            type="date"
            value={filterState.date_from}
            onChange={(e) =>
              setFilterState({ ...filterState, date_from: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={filterState.date_to}
            onChange={(e) =>
              setFilterState({ ...filterState, date_to: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white">
              Filter
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-stone-300 px-3 py-2 text-xs"
            >
              Clear
            </button>
          </div>
        </form>
        <div className="overflow-x-auto bg-white rounded-2xl border border-stone-200">
          <table className="min-w-full text-sm">
            <thead className="bg-stone-50 text-left">
              <tr>
                <th className="p-3">{t('ভাউচার','Voucher')}</th>
                <th className="p-3">{t('ধরন','Type')}</th>
                <th className="p-3">{t('তহবিল','Fund')}</th>
                <th className="p-3">{t('পরিমাণ','Amount')}</th>
                <th className="p-3">{t('তারিখ','Date')}</th>
                <th className="p-3">{t('অবস্থা','Status')}</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {transactions.data.map((row) => (
                <tr key={row.id} className="border-t border-stone-100">
                  <td className="p-3 font-mono text-xs">
                    {row.voucherNo}
                    {row.isDemo && (
                      <span className="ml-2 text-[10px] text-amber-700">
                        {t('ডেমো','Demo')}
                      </span>
                    )}
                  </td>
                  <td className="p-3">{row.type}</td>
                  <td className="p-3">{row.fundType}</td>
                  <td className="p-3 font-semibold">
                    BDT {row.amount.toLocaleString()}
                  </td>
                  <td className="p-3">{row.occurredAt}</td>
                  <td className="p-3">{row.status}</td>
                  <td className="p-3 flex gap-3">
                    {row.attachmentUrl && (
                      <a
                        href={row.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-700"
                      >
                        {t('প্রমাণ','Proof')}
                      </a>
                    )}
                    {row.status === "completed" && (
                      <a
                        href={`/transactions/${row.id}/receipt`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-700"
                      >
                        {t('রসিদ','Receipt')}
                      </a>
                    )}
                    {row.status === "completed" && (
                      <button
                        onClick={() => {
                          const reason = window.prompt("Cancellation reason");
                          if (reason)
                            router.patch(
                              `/admin/transactions/${row.id}/cancel`,
                              { reason },
                              { preserveScroll: true },
                            );
                        }}
                        className="text-xs text-rose-700"
                      >
                        {t('বাতিল','Cancel')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.data.length === 0 && (
            <p className="p-8 text-center text-stone-500">
              {t('কোনো লেনদেন পাওয়া যায়নি।','No transactions found.')}
            </p>
          )}
        </div>
        {transactions.last_page > 1 && (
          <div className="flex flex-wrap gap-2">
            {(transactions.links ?? []).map(
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
