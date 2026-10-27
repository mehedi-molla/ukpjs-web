import { Head, router, useForm } from "@inertiajs/react";
import { AdminLayout } from "../../Layouts/AdminLayout";
import { useState, type FormEvent } from "react";
import { useLanguage } from "../../context/LanguageContext";

interface Member {
  id: number;
  memberNo: string;
  nameBn: string;
  nameEn?: string | null;
  phone?: string | null;
  email?: string | null;
  country?: string | null;
  memberType: string;
  monthlyPledgeAmount: number;
  isActive: boolean;
  isPublicProfile: boolean;
}
interface Props {
  members: {
    data: Member[];
    current_page?: number;
    last_page?: number;
    links?: { url: string | null; label: string; active: boolean }[];
  };
  filters: {
    search?: string;
    member_type?: string;
    country?: string;
    is_active?: boolean;
  };
}

export default function MemberManagement({ members, filters }: Props) {
    const { lang, t } = useLanguage();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterState, setFilterState] = useState({
    search: filters.search ?? "",
    member_type: filters.member_type ?? "",
    country: filters.country ?? "",
    is_active:
      filters.is_active === undefined ? "" : String(Number(filters.is_active)),
  });
  const form = useForm({
    member_no: "",
    name_bn: "",
    name_en: "",
    phone: "",
    email: "",
    country: "",
    member_type: "general",
    monthly_pledge_amount: "0",
    is_active: true,
    is_public_profile: false,
  });
  const navigate = (page: string) =>
    router.visit(page === "dashboard" ? "/admin/dashboard" : `/admin/${page}`);
  const applyFilters = (event: FormEvent) => {
    event.preventDefault();
    router.get("/admin/members", filterState, {
      preserveState: true,
      preserveScroll: true,
    });
  };
  const clearFilters = () => {
    const cleared = { search: "", member_type: "", country: "", is_active: "" };
    setFilterState(cleared);
    router.get(
      "/admin/members",
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
    form.post(editingId ? `/admin/members/${editingId}` : "/admin/members", {
      preserveScroll: true,
      onSuccess: () => {
        setEditingId(null);
        form.reset();
      },
    });
  };
  const edit = (member: Member) => {
    setEditingId(member.id);
    form.setData({
      member_no: member.memberNo,
      name_bn: member.nameBn,
      name_en: member.nameEn ?? "",
      phone: member.phone ?? "",
      email: member.email ?? "",
      country: member.country ?? "",
      member_type: member.memberType,
      monthly_pledge_amount: String(member.monthlyPledgeAmount),
      is_active: member.isActive,
      is_public_profile: member.isPublicProfile,
    });
  };

  return (
    <AdminLayout currentPage="members" setCurrentPage={navigate}>
      <Head title="Members" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">
            {t("সদস্য তালিকা","Member directory")}
          </p>
          <h1 className="text-2xl font-serif font-bold">{t("সদস্যবৃন্দ","Members")}</h1>
          <p className="text-sm text-stone-500 mt-1">
            {t("রেকর্ডগুলো মুছে ফেলার পরিবর্তে নিষ্ক্রিয় (deactivate) করে রাখুন, যাতে অবদানের ইতিহাস নিরীক্ষাযোগ্য (auditable) থাকে।","Deactivate records instead of deleting them so contribution history remains auditable.")}
          </p>
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
            placeholder={t('সদস্য নম্বর, নাম, ফোন নম্বর খুঁজুন...','Search member no, name, phone...')}
            className="sm:col-span-2 border rounded-xl px-3 py-2 text-sm"
          />
          <select
            value={filterState.member_type}
            onChange={(e) =>
              setFilterState({ ...filterState, member_type: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="">{t('সব ধরনের সদস্য','All member types')}</option>
            <option value="general">{t('সাধারণ','General')}</option>
            <option value="executive">{t('নির্বাহী','Executive')}</option>
            <option value="probashi">{t('প্রবাসী','Probashi')}</option>
            <option value="volunteer">{t('স্বেচ্ছাসেবী','Volunteer')}</option>
          </select>
          <input
            value={filterState.country}
            onChange={(e) =>
              setFilterState({ ...filterState, country: e.target.value })
            }
            placeholder={t('দেশ','Country')}
            className="border rounded-xl px-3 py-2 text-sm"
          />
          <select
            value={filterState.is_active}
            onChange={(e) =>
              setFilterState({ ...filterState, is_active: e.target.value })
            }
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="">{t('সমস্ত স্ট্যাটাস','All statuses')}</option>
            <option value="1">{t('সক্রিয়','Active')}</option>
            <option value="0">{t('নিষ্ক্রিয়','Inactive')}</option>
          </select>
          <div className="flex gap-2">
            <button className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white">
              {t('ফিল্টার','Filter')}
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-stone-300 px-3 py-2 text-xs"
            >
              {t('পরিষ্কার','Clear')}
            </button>
          </div>
        </form>
        <form
          onSubmit={submit}
          className="grid sm:grid-cols-4 gap-3 rounded-2xl bg-white border border-stone-200 p-5"
        >
          <input
            required
            value={form.data.member_no}
            onChange={(e) => form.setData("member_no", e.target.value)}
            placeholder={t('সদস্য নং','Member no')}
            className="border rounded-xl p-3 text-sm"
          />
          <input
            required
            value={form.data.name_bn}
            onChange={(e) => form.setData("name_bn", e.target.value)}
            placeholder={t('বাংলা নাম','Bangla name')}
            className="border rounded-xl p-3 text-sm"
          />
          <input
            value={form.data.name_en}
            onChange={(e) => form.setData("name_en", e.target.value)}
            placeholder={t('ইংরেজি নাম','English name')}
            className="border rounded-xl p-3 text-sm"
          />
          <select
            value={form.data.member_type}
            onChange={(e) => form.setData("member_type", e.target.value)}
            className="border rounded-xl p-3 text-sm"
          >
            <option value="general">{t('সাধারণ','General')}</option>
            <option value="executive">{t('নির্বাহী','Executive')}</option>
            <option value="probashi">{t('প্রবাসী','Probashi')}</option>
            <option value="volunteer">{t('স্বেচ্ছাসেবী','Volunteer')}</option>
          </select>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.data.monthly_pledge_amount}
            onChange={(e) =>
              form.setData("monthly_pledge_amount", e.target.value)
            }
            placeholder={t('মাসিক প্রতিশ্রুতি','Monthly pledge')}
            className="border rounded-xl p-3 text-sm"
          />
          <input
            value={form.data.phone}
            onChange={(e) => form.setData("phone", e.target.value)}
            placeholder={t('ফোন','Phone')}
            className="border rounded-xl p-3 text-sm"
          />
          <input
            value={form.data.email}
            onChange={(e) => form.setData("email", e.target.value)}
            placeholder={t('ইমেইল','Email')}
            className="border rounded-xl p-3 text-sm"
          />
          <input
            value={form.data.country}
            onChange={(e) => form.setData("country", e.target.value)}
            placeholder={t('দেশ','Country')}
            className="border rounded-xl p-3 text-sm"
          />
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.data.is_active}
              onChange={(e) => form.setData("is_active", e.target.checked)}
            />{" "}
            Active
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.data.is_public_profile}
              onChange={(e) =>
                form.setData("is_public_profile", e.target.checked)
              }
            />{" "}
            Public profile
          </label>
          <button
            disabled={form.processing}
            className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white"
          >
            {editingId ? t('সদস্য আপডেট করুন','Update member') : t('সদস্য যোগ করুন','Add member')}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                form.reset();
              }}
              className="rounded-xl border border-stone-300 px-4 py-2 text-xs"
            >
              {t('বাতিল','Cancel')}
            </button>
          )}
        </form>
        <section className="rounded-2xl bg-white border border-stone-200 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="p-4">{t('সদস্য নং','Member no')}</th>
                <th className="p-4">{t('নাম','Name')}</th>
                <th className="p-4">{t('ধরন','Type')}</th>
                <th className="p-4">{t('প্রতিজ্ঞা','Pledge')}</th>
                <th className="p-4">{t('অবস্থা','Status')}</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {members.data.map((member) => (
                <tr key={member.id}>
                  <td className="p-4 font-mono">{member.memberNo}</td>
                  <td className="p-4 font-semibold">
                    {member.nameEn || member.nameBn}
                  </td>
                  <td className="p-4">{member.memberType}</td>
                  <td className="p-4">
                    BDT {member.monthlyPledgeAmount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    {member.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="p-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => edit(member)}
                      className="text-emerald-700"
                    >
                      {t('সম্পাদনা','Edit')}
                    </button>
                    {member.isActive && (
                      <button
                        type="button"
                        onClick={() =>
                          router.patch(
                            `/admin/members/${member.id}/archive`,
                            {},
                            { preserveScroll: true },
                          )
                        }
                        className="text-rose-700"
                      >
                        {t('নিষ্ক্রিয় করুন','Deactivate')}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            "Delete this member permanently? This cannot be undone.",
                          )
                        ) {
                          router.delete(`/admin/members/${member.id}`, {
                            preserveScroll: true,
                          });
                        }
                      }}
                      className="text-red-800"
                    >
                      {t('মুছে ফেলুন','Delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {members.data.length === 0 && (
            <p className="p-8 text-center text-stone-500">No members found.</p>
          )}
        </section>
        {members.links && (members.last_page ?? 1) > 1 && (
          <nav className="flex flex-wrap gap-2">
            {members.links.map(
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
