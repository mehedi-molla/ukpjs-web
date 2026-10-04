import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, Lock, ShieldCheck, User } from 'lucide-react';
import { FormEvent } from 'react';

export default function Login() {
    const form = useForm({ email_or_member_id: '', password: '', remember: false });
    const { props } = usePage<{ flash?: { status?: string } }>();

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/login');
    };

    return (
        <>
            <Head title="Portal Sign In" />
            <div className="max-w-md mx-auto px-4 py-16 space-y-8">
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3"><ShieldCheck className="w-7 h-7" /></div>
                    <h1 className="text-2xl font-serif font-bold text-stone-900">Portal Sign In</h1>
                    <p className="text-xs text-stone-500">UKPJS Management &amp; Member Portal</p>
                </div>
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                    {props.flash?.status && <p className="mb-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{props.flash.status}</p>}
                    <form onSubmit={submit} className="space-y-4 text-xs">
                        <label className="block font-semibold text-stone-700">Email or Member ID
                            <span className="relative block mt-1"><User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" /><input className="w-full pl-9 pr-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={form.data.email_or_member_id} onChange={(event) => form.setData('email_or_member_id', event.target.value)} autoComplete="username" /></span>
                        </label>
                        {form.errors.email_or_member_id && <p className="text-rose-600">{form.errors.email_or_member_id}</p>}
                        <label className="block font-semibold text-stone-700">Password
                            <span className="relative block mt-1"><Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="password" className="w-full pl-9 pr-3.5 py-2 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" value={form.data.password} onChange={(event) => form.setData('password', event.target.value)} autoComplete="current-password" /></span>
                        </label>
                        {form.errors.password && <p className="text-rose-600">{form.errors.password}</p>}
                        <label className="flex items-center gap-2 text-stone-600"><input type="checkbox" checked={form.data.remember} onChange={(event) => form.setData('remember', event.target.checked)} /> Remember me</label>
                        <button disabled={form.processing} className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60">{form.processing ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" /></button>
                    </form>
                    <Link href="/forgot-password" className="mt-4 block text-center text-xs font-semibold text-emerald-700 hover:text-emerald-900">Forgot password?</Link>
                </div>
            </div>
        </>
    );
}
