import { Head, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { AdminLayout } from '../../Layouts/AdminLayout';
import { useLanguage } from '../../context/LanguageContext';

interface Notice { id: number; titleBn: string; titleEn?: string; contentBn: string; publishDate?: string; isActive: boolean; }
interface Props { notices: { data: Notice[] }; }

export default function Notices({ notices }: Props) {
    const { t } = useLanguage();
    const [titleBn, setTitleBn] = useState(''); const [titleEn, setTitleEn] = useState(''); const [contentBn, setContentBn] = useState('');
    const submit = (event: FormEvent) => { event.preventDefault(); router.post('/admin/notices', { title_bn: titleBn, title_en: titleEn, content_bn: contentBn, is_active: true, publish_date: new Date().toISOString().slice(0, 10) }, { preserveScroll: true, onSuccess: () => { setTitleBn(''); setTitleEn(''); setContentBn(''); } }); };
    const navigate = (page: string) => router.visit(page === 'dashboard' ? '/admin/dashboard' : `/admin/${page}`);
    return <AdminLayout currentPage="notices" setCurrentPage={navigate}><Head title={t('বিজ্ঞপ্তি', 'Notices')} /><main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6"><h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">{t('বিজ্ঞপ্তি', 'Notices')}</h1><form onSubmit={submit} className="grid gap-3 rounded-2xl bg-white border border-stone-200 p-4 sm:p-5 shadow-sm"><input required value={titleBn} onChange={e => setTitleBn(e.target.value)} placeholder={t('শিরোনাম (বাংলা)', 'Title (Bangla)')} className="border border-stone-200 rounded-xl p-3 text-sm" /><input value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder={t('শিরোনাম (ইংরেজি)', 'Title (English)')} className="border border-stone-200 rounded-xl p-3 text-sm" /><textarea required value={contentBn} onChange={e => setContentBn(e.target.value)} placeholder={t('বিজ্ঞপ্তির বিবরণ লিখুন (বাংলা)', 'Notice content (Bangla)')} className="border border-stone-200 rounded-xl p-3 text-sm min-h-32" /><button className="justify-self-start rounded-xl bg-emerald-700 hover:bg-emerald-600 px-4 py-2 text-xs font-semibold text-white">{t('বিজ্ঞপ্তি প্রকাশ করুন', 'Publish notice')}</button></form><section className="rounded-2xl bg-white border border-stone-200 divide-y shadow-sm overflow-hidden">{notices.data.map(notice => <article key={notice.id} className="p-4 sm:p-5"><h2 className="font-semibold text-stone-900">{notice.titleBn}</h2>{notice.titleEn && <p className="text-sm text-stone-600 mt-1">{notice.titleEn}</p>}<p className="mt-2 text-sm text-stone-700 whitespace-pre-wrap">{notice.contentBn}</p><p className="mt-2 text-xs text-stone-400">{notice.publishDate || t('তারিখ নির্ধারিত নয়', 'Unscheduled')} · {notice.isActive ? t('সক্রিয়', 'Active') : t('নিষ্ক্রিয়', 'Inactive')}</p></article>)}</section></main></AdminLayout>;
}
