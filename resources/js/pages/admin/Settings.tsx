import { Head, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { AdminLayout } from '../../Layouts/AdminLayout';
import { useLanguage } from '../../context/LanguageContext';

interface Settings { org_name_bn: string; org_name_en: string; slogan_bn?: string; slogan_en?: string; contact_phone?: string; contact_email?: string; bkash_number?: string; nagad_number?: string; rocket_number?: string; donation_instructions_bn?: string; donation_instructions_en?: string; address_bn?: string; address_en?: string; currency_symbol?: string; is_public_transparency_enabled?: boolean; }
interface AuditEntry { id: number; action: string; details?: string | null; actor: string; createdAt?: string | null; }

export default function Settings({ settings, logs }: { settings: Settings | null; logs: AuditEntry[] }) {
    const { t } = useLanguage();
    const [form, setForm] = useState<Settings>(settings ?? { org_name_bn: '', org_name_en: '', currency_symbol: '৳' });
    const update = (key: keyof Settings, value: string | boolean) => setForm(current => ({ ...current, [key]: value }));
    const submit = (event: FormEvent) => { event.preventDefault(); router.put('/admin/settings', { ...form }, { preserveScroll: true }); };
    const navigate = (page: string) => router.visit(page === 'dashboard' ? '/admin/dashboard' : `/admin/${page}`);

    const fields = [
        ['org_name_bn', t('প্রতিষ্ঠানের নাম (বাংলা)', 'Organization name (Bangla)')],
        ['org_name_en', t('প্রতিষ্ঠানের নাম (ইংরেজি)', 'Organization name (English)')],
        ['slogan_bn', t('স্লোগান (বাংলা)', 'Slogan (Bangla)')],
        ['slogan_en', t('স্লোগান (ইংরেজি)', 'Slogan (English)')],
        ['contact_phone', t('যোগাযোগ নম্বর', 'Contact phone')],
        ['contact_email', t('যোগাযোগ ইমেইল', 'Contact email')],
        ['bkash_number', t('বিকাশ নম্বর', 'bKash number')],
        ['nagad_number', t('নগদ নম্বর', 'Nagad number')],
        ['rocket_number', t('রকেট নম্বর', 'Rocket number')],
        ['currency_symbol', t('মুদ্রা প্রতীক', 'Currency symbol')],
    ] as const;

    return <AdminLayout currentPage="settings" setCurrentPage={navigate}><Head title={t('সেটিংস', 'Settings')} /><main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6"><div><p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">{t('নিয়ন্ত্রিত কনফিগারেশন', 'Controlled configuration')}</p><h1 className="text-2xl font-serif font-bold">{t('ওয়েবসাইট সেটিংস', 'Website settings')}</h1><p className="text-sm text-stone-500 mt-1">{t('পরিবর্তন যাচাই করা হয়, লেনদেন অনুযায়ী সংরক্ষিত হয় এবং অ্যাডমিন অডিট ইতিহাসে রাখা হয়।', 'Changes are validated, transactional, and retained in the administrator audit history.')}</p></div><form onSubmit={submit} className="grid sm:grid-cols-2 gap-4 rounded-2xl bg-white border border-stone-200 p-6">{fields.map(([key, label]) => <label key={key} className="grid gap-1 text-xs font-semibold text-stone-700">{label}<input value={String(form[key] ?? '')} placeholder={label} onChange={e => update(key, e.target.value)} className="border rounded-xl p-3 text-sm font-normal" /></label>)}<label className="sm:col-span-2 grid gap-1 text-xs font-semibold text-stone-700">{t('দান সংক্রান্ত নির্দেশনা', 'Donation instructions')}<textarea value={form.donation_instructions_bn ?? ''} placeholder={t('দান সংক্রান্ত নির্দেশনা লিখুন', 'Enter donation instructions')} onChange={e => update('donation_instructions_bn', e.target.value)} className="border rounded-xl p-3 text-sm font-normal" rows={4} /></label><label className="sm:col-span-2 inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(form.is_public_transparency_enabled)} onChange={e => update('is_public_transparency_enabled', e.target.checked)} /> {t('আর্থিক স্বচ্ছতা প্রকাশ করুন', 'Publish financial transparency')}</label><button className="sm:col-span-2 justify-self-start rounded-xl bg-emerald-700 px-5 py-3 text-xs font-semibold text-white">{t('সেটিংস সংরক্ষণ করুন', 'Save settings')}</button></form><section className="rounded-2xl border border-stone-200 bg-white"><div className="border-b border-stone-100 p-5"><h2 className="font-semibold">{t('সাম্প্রতিক সেটিংস পরিবর্তন', 'Recent settings changes')}</h2><p className="mt-1 text-xs text-stone-500">{t('এই ইতিহাস পর্যালোচনার জন্য সহায়ক এবং ডাটাবেস ব্যাকআপের বিকল্প নয়।', 'This history supports review and does not replace database backups.')}</p></div>{logs.length === 0 ? <p className="p-5 text-sm text-stone-500">{t('এখন পর্যন্ত কোনো সেটিংস পরিবর্তন রেকর্ড করা হয়নি।', 'No settings changes recorded yet.')}</p> : <div className="divide-y divide-stone-100">{logs.map(log => <div key={log.id} className="flex flex-wrap justify-between gap-3 p-5 text-sm"><div><p className="font-semibold">{log.details || log.action}</p><p className="text-xs text-stone-500">{t('দ্বারা', 'By')} {log.actor}</p></div><time className="text-xs text-stone-400">{log.createdAt || t('অজানা তারিখ', 'Unknown date')}</time></div>)}</div>}</section></main></AdminLayout>;
}
