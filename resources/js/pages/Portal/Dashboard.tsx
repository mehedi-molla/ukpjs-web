import { Head, Link } from '@inertiajs/react';
import { Calendar, CheckCircle2, Heart, Layers, Wallet } from 'lucide-react';
import { MemberLayout } from '../../Layouts/MemberLayout';

interface Contribution {
    id: number;
    voucherNo: string;
    amount: number;
    date: string;
    fundType: string;
    projectName?: string | null;
}

interface MemberProfile {
    memberNo: string;
    nameBn: string;
    nameEn?: string | null;
    country?: string | null;
    village?: string | null;
    monthlyPledgeAmount: number;
}

interface Props {
    role: 'member';
    member: MemberProfile | null;
    summary: { myTotal: number; myProjectTotal: number; organizationBalance: number; hasPaidThisMonth: boolean };
    contributions: {
        data: Contribution[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const money = (value: number) => `৳ ${value.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Dashboard({ member, summary, contributions }: Props) {
    return (
        <>
            <Head title="Member Dashboard" />
            <MemberLayout>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7">
                    <section className="p-6 sm:p-8 rounded-3xl bg-emerald-950 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                        <div>
                            <p className="text-xs text-emerald-300 font-mono">{member?.memberNo ?? 'Member'}</p>
                            <h2 className="mt-1 text-2xl font-serif font-bold">{member?.nameEn || member?.nameBn || 'Member'}</h2>
                            <p className="mt-2 text-xs text-stone-300">{member?.country || 'Community member'}{member?.village ? ` · ${member.village}` : ''}</p>
                        </div>
                        <a href="/donate" className="inline-flex justify-center rounded-xl bg-emerald-300 px-5 py-3 text-xs font-semibold text-emerald-950 hover:bg-emerald-200">Make a contribution</a>
                    </section>

                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Stat label="My verified contributions" value={money(summary.myTotal)} icon={<Heart className="w-4 h-4 text-emerald-600" />} />
                        <Stat label="Project contributions" value={money(summary.myProjectTotal)} icon={<Layers className="w-4 h-4 text-blue-600" />} />
                        <Stat label="This month" value={summary.hasPaidThisMonth ? 'Paid' : 'Pending'} icon={summary.hasPaidThisMonth ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Calendar className="w-4 h-4 text-amber-600" />} />
                        <Stat label="Organization balance" value={money(summary.organizationBalance)} icon={<Wallet className="w-4 h-4 text-emerald-600" />} />
                    </section>

                    <section className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm">
                        <div className="p-5 border-b border-stone-200"><h2 className="font-serif font-bold text-lg">My verified contribution history</h2><p className="mt-1 text-xs text-stone-500">Only your completed, non-demo ledger entries are shown.</p></div>
                        {contributions.data.length === 0 ? <p className="p-8 text-sm text-stone-500">No verified contributions found.</p> : <><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-stone-50 text-stone-500"><tr><th className="px-5 py-3">Voucher</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Fund</th><th className="px-5 py-3">Project</th><th className="px-5 py-3 text-right">Amount</th></tr></thead><tbody className="divide-y divide-stone-100">{contributions.data.map((contribution) => <tr key={contribution.id}><td className="px-5 py-3 font-mono font-semibold">{contribution.voucherNo}</td><td className="px-5 py-3 text-stone-500">{contribution.date}</td><td className="px-5 py-3">{contribution.fundType}</td><td className="px-5 py-3 text-stone-500">{contribution.projectName || 'General fund'}</td><td className="px-5 py-3 text-right font-mono font-semibold text-emerald-800">{money(contribution.amount)}</td></tr>)}</tbody></table></div><nav aria-label="Contribution history pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 px-5 py-4"><p className="text-xs text-stone-500">Showing {contributions.from}–{contributions.to} of {contributions.total}</p><div className="flex flex-wrap gap-1">{contributions.links.map((link, index) => <Link key={`${link.label}-${index}`} href={link.url ?? '#'} preserveScroll preserveState aria-current={link.active ? 'page' : undefined} aria-disabled={!link.url} className={`rounded-lg border px-2.5 py-1.5 text-xs ${link.active ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-stone-200 text-stone-600'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />)}</div></nav></>}
                    </section>
                </main>
            </MemberLayout>
        </>
    );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm"><div className="flex items-center justify-between text-xs text-stone-500"><span>{label}</span>{icon}</div><div className="mt-3 text-xl font-bold font-mono text-stone-900">{value}</div></div>;
}
