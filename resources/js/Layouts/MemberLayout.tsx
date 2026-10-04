import { router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

export function MemberLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen bg-stone-100 text-stone-900"><header className="bg-emerald-950 text-white border-b border-emerald-900"><div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-wider text-emerald-300">UKPJS Portal</p><h1 className="font-serif font-bold">Member Dashboard</h1></div><button className="inline-flex items-center gap-1.5 text-xs text-emerald-100" onClick={() => router.post('/logout')}><LogOut className="w-4 h-4" /> Sign out</button></div></header>{children}</div>;
}
