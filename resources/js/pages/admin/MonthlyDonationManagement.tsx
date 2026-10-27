import { Head, router, useForm } from "@inertiajs/react";
import { AdminLayout } from "../../Layouts/AdminLayout";
import { useState, type FormEvent } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface Donation {
  id: number;
  memberNo?: string;
  memberName?: string;
  month: number;
  year: number;
  expectedAmount: number;
  paidAmount: number;
  paymentDate?: string;
  status: string;
  voucherNo?: string;
  transactionId?: number;
}
interface Member {
  id: number;
  memberNo: string;
  name: string;
  pledge: number;
}
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
interface Props {
  donations: { data: Donation[]; last_page?: number; links?: PaginationLink[] };
  members: Member[];
  filters: { year?: number | string; status?: string; search?: string };
}

export default function MonthlyDonationManagement({
  donations,
  members,
  filters,
}: Props) {
    const { lang, t } = useLanguage();
  const [filterState, setFilterState] = useState({
    year: filters.year ? String(filters.year) : "",
    status: filters.status ?? "",
    search: filters.search ?? "",
  });
  const commitmentForm = useForm({
    member_id: members[0]?.id ?? "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    expected_amount: members[0]?.pledge ? String(members[0].pledge) : "0",
    notes: "",
  });
  const paymentForm = useForm({
    amount: "",
    payment_date: new Date().toISOString().slice(0, 10),
    payment_method: "cash",
    reference_no: "",
    notes: "",
  });
  const navigate = (page: string) =>
    router.visit(page === "dashboard" ? "/admin/dashboard" : `/admin/${page}`);
  const applyFilters = (event: FormEvent) => {
    event.preventDefault();
    router.get("/admin/monthly-donations", filterState, {
      preserveState: true,
      preserveScroll: true,
    });
  };
  const clearFilters = () => {
    setFilterState({ year: "", status: "", search: "" });
    router.get(
      "/admin/monthly-donations",
      {},
      { preserveState: true, preserveScroll: true },
    );
  };
  const submitCommitment = (event: FormEvent) => {
    event.preventDefault();
    commitmentForm.post("/admin/monthly-donations", {
      preserveScroll: true,
      onSuccess: () => commitmentForm.reset("notes"),
    });
  };
  const memberChanged = (id: number) => {
    commitmentForm.setData("member_id", id);
    const member = members.find((item) => item.id === id);
    if (member && Number(commitmentForm.data.expected_amount) === 0)
      commitmentForm.setData("expected_amount", String(member.pledge));
  };
  const markPaid = (event: FormEvent, donation: Donation) => {
    event.preventDefault();
    paymentForm.post(`/admin/monthly-donations/${donation.id}/mark-paid`, {
      preserveScroll: true,
      onSuccess: () => paymentForm.reset("amount", "reference_no", "notes"),
    });
  };

  return (
    <AdminLayout currentPage="monthly-donations" setCurrentPage={navigate}>
      <Head title={t('মাসিক দান ব্যবস্থাপনা', 'Monthly donations')} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">
            {t('প্রতিশ্রুতিসমূহ','Commitments')}
          </p>
          <h1 className="text-2xl font-serif font-bold">
            {t('মাসিক দান প্রতিশ্রুতি', 'Monthly donation commitments')}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {t('প্রতিশ্রুতিসমূহ খাতাভুক্ত না হওয়া পর্যন্ত লেজারে অন্তর্ভুক্ত হয় না। পুনর্মিলন করলে স্বয়ংক্রিয়ভাবে কেন্দ্রীয় লেজারে একটি এন্ট্রি তৈরি হবে।', 'Commitments are separate from the ledger until a payment is reconciled. Reconciliation creates exactly one central ledger entry.')}
          </p>
        </div>
        <form
          onSubmit={applyFilters}
          className="grid grid-cols-1 sm:grid-cols-4 gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-4"
        >
          <input
            value={filterState.search}
            onChange={(event) =>
              setFilterState({ ...filterState, search: event.target.value })
            }
            placeholder={t('সদস্য অনুসন্ধান', 'Search member')}
            className="border rounded-xl px-3 py-2 text-sm"
          />
          <input
            type="number"
            min="2020"
            max="2100"
            value={filterState.year}
            onChange={(event) =>
              setFilterState({ ...filterState, year: event.target.value })
            }
            placeholder={t('বছর', 'Year')}
            className="border rounded-xl px-3 py-2 text-sm"
          />
          <select
            value={filterState.status}
            onChange={(event) =>
              setFilterState({ ...filterState, status: event.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="">{t('সকল অবস্থা', 'All statuses')}</option>
            <option value="pending">{t('অপেক্ষমাণ', 'Pending')}</option>
            <option value="partial">{t('আংশিক', 'Partial')}</option>
            <option value="paid">{t('পরিশোধিত', 'Paid')}</option>
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
          onSubmit={submitCommitment}
          className="grid grid-cols-1 sm:grid-cols-5 gap-3 rounded-2xl border border-stone-200 bg-white p-5"
        >
          <select
            required
            value={commitmentForm.data.member_id}
            onChange={(event) => memberChanged(Number(event.target.value))}
            className="border rounded-xl p-3 text-sm"
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.memberNo} · {member.name}
              </option>
            ))}
          </select>
          <input
            required
            type="number"
            min="1"
            max="12"
            value={commitmentForm.data.month}
            onChange={(event) =>
              commitmentForm.setData("month", Number(event.target.value))
            }
            className="border rounded-xl p-3 text-sm"
            placeholder={t('মাস', 'Month')}
          />
          <input
            required
            type="number"
            min="2020"
            max="2100"
            value={commitmentForm.data.year}
            onChange={(event) =>
              commitmentForm.setData("year", Number(event.target.value))
            }
            className="border rounded-xl p-3 text-sm"
            placeholder={t('বছর', 'Year')}
          />
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={commitmentForm.data.expected_amount}
            onChange={(event) =>
              commitmentForm.setData("expected_amount", event.target.value)
            }
            className="border rounded-xl p-3 text-sm"
            placeholder={t('প্রত্যাশিত পরিমাণ', 'Expected amount')}
          />
          <button
            disabled={commitmentForm.processing || members.length === 0}
            className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"
          >
            {t('প্রতিশ্রুতি যোগ করুন', 'Add commitment')}
          </button>
        </form>
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="p-4">{t('সদস্য', 'Member')}</th>
                <th className="p-4">{t('সময়কাল', 'Period')}</th>
                <th className="p-4">{t('প্রত্যাশিত', 'Expected')}</th>
                <th className="p-4">{t('পরিশোধিত', 'Paid')}</th>
                <th className="p-4">{t('অবস্থা', 'Status')}</th>
                <th className="p-4">{t('ভাউচার / পুনর্মিলন', 'Voucher / reconciliation')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {donations.data.map((item) => (
                <tr key={item.id}>
                  <td className="p-4">
                    {item.memberName || item.memberNo || "Unknown"}
                  </td>
                  <td className="p-4">
                    {item.month}/{item.year}
                  </td>
                  <td className="p-4">
                    BDT {item.expectedAmount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    BDT {item.paidAmount.toLocaleString()}
                  </td>
                  <td className="p-4">{item.status === 'paid' ? t('পরিশোধিত', 'Paid') : item.status === 'partial' ? t('আংশিক', 'Partial') : t('অপেক্ষমাণ', 'Pending')}</td>
                  <td className="p-4">
                    {item.voucherNo ? (
                      <span className="font-mono">{item.voucherNo}</span>
                    ) : (
                      <form
                        onSubmit={(event) => markPaid(event, item)}
                        className="flex flex-wrap gap-2 min-w-[23rem]"
                      >
                        <input
                          required
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={paymentForm.data.amount}
                          onChange={(event) =>
                            paymentForm.setData("amount", event.target.value)
                          }
                          placeholder={t('পরিমাণ', 'Amount')}
                          className="w-24 border rounded-lg px-2 py-1.5"
                        />
                        <select
                          value={paymentForm.data.payment_method}
                          onChange={(event) =>
                            paymentForm.setData(
                              "payment_method",
                              event.target.value,
                            )
                          }
                          className="border rounded-lg px-2 py-1.5"
                        >
                          <option value="cash">{t('নগদ', 'Cash')}</option>
                          <option value="bkash">bKash</option>
                          <option value="nagad">Nagad</option>
                          <option value="rocket">Rocket</option>
                          <option value="bank">{t('ব্যাংক', 'Bank')}</option>
                          <option value="other">{t('অন্যান্য', 'Other')}</option>
                        </select>
                        <input
                          required
                          type="date"
                          value={paymentForm.data.payment_date}
                          onChange={(event) =>
                            paymentForm.setData(
                              "payment_date",
                              event.target.value,
                            )
                          }
                          className="border rounded-lg px-2 py-1.5"
                        />
                        <button
                          disabled={paymentForm.processing}
                          className="rounded-lg bg-emerald-700 px-3 py-1.5 text-white"
                        >
                          {t('পেমেন্ট রেকর্ড করুন', 'Record payment')}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {donations.data.length === 0 && (
            <p className="p-8 text-center text-stone-500">
              {t('কোনো প্রতিশ্রুতি পাওয়া যায়নি।', 'No commitments found.')}
            </p>
          )}
        </div>
        {donations.links && (donations.last_page ?? 1) > 1 && (
          <nav className="flex flex-wrap gap-2">
            {donations.links.map(
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
