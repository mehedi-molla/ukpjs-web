import { Head, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { AdminLayout } from '../../Layouts/AdminLayout';

interface Notice { id: number; titleBn: string; titleEn?: string; contentBn: string; publishDate?: string; isActive: boolean; }
interface Props { notices: { data: Notice[] }; }

export default function Notices({ notices }: Props) {
    const [titleBn, setTitleBn] = useState(''); const [titleEn, setTitleEn] = useState(''); const [contentBn, setContentBn] = useState('');
    const submit = (event: FormEvent) => { event.preventDefault(); router.post('/admin/notices', { title_bn: titleBn, title_en: titleEn, content_bn: contentBn, is_active: true, publish_date: new Date().toISOString().slice(0, 10) }, { preserveScroll: true, onSuccess: () => { setTitleBn(''); setTitleEn(''); setContentBn(''); } }); };
    const navigate = (page: string) => router.visit(page === 'dashboard' ? '/admin/dashboard' : `/admin/${page}`);
    return <AdminLayout currentPage="notices" setCurrentPage={navigate}><Head title="Notices" /><main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6"><h1 className="text-2xl font-serif font-bold">Notices</h1><form onSubmit={submit} className="grid gap-3 rounded-2xl bg-white border border-stone-200 p-5"><input required value={titleBn} onChange={e => setTitleBn(e.target.value)} placeholder="Bangla title" className="border rounded-xl p-3 text-sm" /><input value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="English title" className="border rounded-xl p-3 text-sm" /><textarea required value={contentBn} onChange={e => setContentBn(e.target.value)} placeholder="Notice content" className="border rounded-xl p-3 text-sm" /><button className="justify-self-start rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white">Publish notice</button></form><section className="rounded-2xl bg-white border border-stone-200 divide-y">{notices.data.map(notice => <article key={notice.id} className="p-5"><h2 className="font-semibold">{notice.titleBn}</h2><p className="mt-2 text-sm text-stone-600 whitespace-pre-wrap">{notice.contentBn}</p><p className="mt-2 text-xs text-stone-400">{notice.publishDate || 'Unscheduled'} · {notice.isActive ? 'Active' : 'Inactive'}</p></article>)}</section></main></AdminLayout>;
}
