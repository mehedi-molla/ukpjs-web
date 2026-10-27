import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '../../Layouts/AdminLayout';
import { useState, type FormEvent } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface Submission { id: number; donorName?: string | null; amount: number; fundType: string; paymentMethod: string; referenceNo?: string; projectName?: string; status: string; createdAt: string; }
interface PaginationLink { url: string | null; label: string; active: boolean; }
interface Props { submissions: { data: Submission[]; last_page?: number; links?: PaginationLink[] }; filters: { search?: string; status?: string; fund_type?: string }; }

export default function DonationSubmissions({ submissions, filters }: Props) {
    const { t, lang } = useLanguage();
    const isBn = lang === 'bn';
    const [filterState, setFilterState] = useState({ search: filters.search ?? '', status: filters.status ?? '', fund_type: filters.fund_type ?? '' });
    const navigate = (page: string) => router.visit(page === 'dashboard' ? '/admin/dashboard' : `/admin/${page}`);
    const review = (id: number, status: string) => router.patch(`/admin/donation-submissions/${id}`, { status }, { preserveScroll: true });
    const applyFilters = (event: FormEvent) => { event.preventDefault(); router.get('/admin/donation-submissions', filterState, { preserveState: true, preserveScroll: true }); };
    const clearFilters = () => { setFilterState({ search: '', status: '', fund_type: '' }); router.get('/admin/donation-submissions', {}, { preserveState: true, preserveScroll: true }); };

    const fundTypeLabel = (value: string) => {
        const map: Record<string, { bn: string; en: string }> = {
            general_hadiya: { bn: 'সাধারণ হাদিয়া', en: 'General Hadiya' },
            monthly_donation: { bn: 'মাসিক চাঁদা', en: 'Monthly Donation' },
            project_donation: { bn: 'প্রকল্প অনুদান', en: 'Project Donation' },
            zakat: { bn: 'যাকাত', en: 'Zakat' },
            sadaqah: { bn: 'সদকা', en: 'Sadaqah' },
            special_campaign: { bn: 'বিশেষ ক্যাম্পেইন', en: 'Special Campaign' },
            emergency_fund: { bn: 'জরুরি তহবিল', en: 'Emergency Fund' },
        };
        return isBn ? map[value]?.bn || value : map[value]?.en || value;
    };

    const statusLabel = (value: string) => {
        if (value === 'pending') return t('পেন্ডিং', 'Pending');
        if (value === 'approved') return t('অনুমোদিত', 'Approved');
        if (value === 'rejected') return t('প্রত্যাখ্যাত', 'Rejected');
        return value;
    };

    return <AdminLayout currentPage="donation-submissions" setCurrentPage={navigate}><Head title={t('অনুদান নিশ্চিতকরণ', 'Donation Confirmations')} /><main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5"><h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">{t('অনুদান নিশ্চিতকরণ', 'Donation Confirmations')}</h1><form onSubmit={applyFilters} className="grid grid-cols-1 sm:grid-cols-4 gap-2 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"><input value={filterState.search} onChange={e => setFilterState({ ...filterState, search: e.target.value })} placeholder={t('দাতা, ফোন, রেফারেন্স নম্বর খুঁজুন', 'Search donor, phone, reference')} className="sm:col-span-2 border border-stone-200 rounded-xl px-3 py-2 text-sm" /><select value={filterState.status} onChange={e => setFilterState({ ...filterState, status: e.target.value })} className="border border-stone-200 rounded-xl px-3 py-2 text-sm"><option value="">{t('সকল অবস্থা', 'All statuses')}</option><option value="pending">{t('পেন্ডিং', 'Pending')}</option><option value="approved">{t('অনুমোদিত', 'Approved')}</option><option value="rejected">{t('প্রত্যাখ্যাত', 'Rejected')}</option></select><select value={filterState.fund_type} onChange={e => setFilterState({ ...filterState, fund_type: e.target.value })} className="border border-stone-200 rounded-xl px-3 py-2 text-sm"><option value="">{t('সকল তহবিল', 'All funds')}</option><option value="general_hadiya">{t('সাধারণ হাদিয়া', 'General Hadiya')}</option><option value="monthly_donation">{t('মাসিক চাঁদা', 'Monthly donation')}</option><option value="project_donation">{t('প্রকল্প অনুদান', 'Project donation')}</option><option value="zakat">{t('যাকাত', 'Zakat')}</option><option value="sadaqah">{t('সদকা', 'Sadaqah')}</option><option value="special_campaign">{t('বিশেষ ক্যাম্পেইন', 'Special campaign')}</option><option value="emergency_fund">{t('জরুরি তহবিল', 'Emergency fund')}</option></select><div className="flex gap-2"><button className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white">{t('ফিল্টার', 'Filter')}</button><button type="button" onClick={clearFilters} className="rounded-xl border border-stone-300 px-3 py-2 text-xs text-stone-700">{t('মুছে ফেলুন', 'Clear')}</button></div></form><div className="rounded-2xl border border-stone-200 bg-white divide-y shadow-sm overflow-hidden">{submissions.data.map(item => <article key={item.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"><div><p className="font-semibold text-stone-900">{item.donorName || t('অজ্ঞাত', 'Anonymous')} · ৳ {item.amount.toLocaleString(isBn ? 'bn-BD' : 'en-US')}</p><p className="text-xs text-stone-500 mt-0.5">{fundTypeLabel(item.fundType)} · {item.paymentMethod} · {item.referenceNo || t('রেফারেন্স নাই', 'No reference')} · {statusLabel(item.status)}</p></div>{item.status === 'pending' && <div className="flex flex-wrap gap-2"><button type="button" onClick={() => review(item.id, 'approved')} className="rounded-lg bg-emerald-700 hover:bg-emerald-600 px-3 py-2 text-xs text-white">{t('লেজারে অনুমোদন করুন', 'Approve to ledger')}</button><button type="button" onClick={() => review(item.id, 'rejected')} className="rounded-lg bg-rose-700 hover:bg-rose-600 px-3 py-2 text-xs text-white">{t('প্রত্যাখ্যান করুন', 'Reject')}</button></div>}</article>)}{submissions.data.length === 0 && <p className="p-8 text-center text-stone-500">{t('কোনো অনুদান নিশ্চিতকরণ পাওয়া যায়নি।', 'No donation confirmations found.')}</p>}</div>{submissions.links && (submissions.last_page ?? 1) > 1 && <nav className="flex flex-wrap gap-2">{submissions.links.map((link, index) => link.url && <button key={`${link.label}-${index}`} type="button" onClick={() => router.get(link.url as string, {}, { preserveState: true, preserveScroll: true })} className={`rounded-lg border px-3 py-1 text-xs ${link.active ? 'bg-emerald-700 text-white border-emerald-700' : 'border-stone-300 text-stone-700'}`} dangerouslySetInnerHTML={{ __html: link.label.replace(/&laquo;/g, '«').replace(/&raquo;/g, '»') }} />)}</nav>}</main></AdminLayout>;
}
