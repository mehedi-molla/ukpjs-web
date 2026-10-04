import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function ForgotPassword() {
    const form = useForm({ email: '' });
    const { props } = usePage<{ flash?: { status?: string } }>();
    const submit = (event: FormEvent) => { event.preventDefault(); form.post('/forgot-password'); };

    return <><Head title="Forgot password" /><main className="max-w-md mx-auto px-4 py-16"><div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm space-y-5"><div><h1 className="text-2xl font-serif font-bold text-stone-900">Reset your password</h1><p className="mt-1 text-xs text-stone-500">Enter your account email. If it exists, we will send a reset link.</p></div>{props.flash?.status && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{props.flash.status}</p>}<form onSubmit={submit} className="space-y-4"><label className="block text-xs font-semibold text-stone-700">Email<input required type="email" autoComplete="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm" /></label>{form.errors.email && <p className="text-xs text-rose-600">{form.errors.email}</p>}<button disabled={form.processing} className="w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-semibold text-white disabled:opacity-60">{form.processing ? 'Sending...' : 'Send reset link'}</button></form><Link href="/login" className="block text-center text-xs font-semibold text-emerald-700">Back to sign in</Link></div></main></>;
}
