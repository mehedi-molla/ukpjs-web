import { router } from '@inertiajs/react';

interface Props { children: React.ReactNode; currentPage: string; setCurrentPage: (page: string) => void; }

export function AdminLayout({ children, currentPage, setCurrentPage }: Props) {
    const navigate = (page: string) => {
        const routes: Record<string, string> = {
            dashboard: '/admin/dashboard', transactions: '/admin/transactions', 'donation-submissions': '/admin/donation-submissions',
            members: '/admin/members', 'monthly-donations': '/admin/monthly-donations', reports: '/admin/reports', projects: '/admin/projects',
            contacts: '/admin/contacts', 'contact-messages': '/admin/contact-messages', notices: '/admin/notices', welfare: '/admin/welfare', settings: '/admin/settings',
        };
        if (routes[page]) router.visit(routes[page]); else setCurrentPage(page);
    };
    return (
        <div className="min-h-screen bg-stone-100 text-stone-900">
            <header className="bg-emerald-950 text-white border-b border-emerald-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
                    <button onClick={() => setCurrentPage('dashboard')} className="text-left cursor-pointer"><span className="text-xs text-emerald-300 uppercase tracking-wider">UKPJS</span><h1 className="font-serif font-bold">Super Admin</h1></button>
                    <nav className="hidden lg:flex items-center gap-3 text-xs text-emerald-100"><button className={currentPage === 'dashboard' ? 'text-white font-bold' : ''} onClick={() => navigate('dashboard')}>Dashboard</button><button className={currentPage === 'transactions' ? 'text-white font-bold' : ''} onClick={() => navigate('transactions')}>Transactions</button><button className={currentPage === 'donation-submissions' ? 'text-white font-bold' : ''} onClick={() => navigate('donation-submissions')}>Donations</button><button className={currentPage === 'members' ? 'text-white font-bold' : ''} onClick={() => navigate('members')}>Members</button><button className={currentPage === 'monthly-donations' ? 'text-white font-bold' : ''} onClick={() => navigate('monthly-donations')}>Monthly</button><button className={currentPage === 'reports' ? 'text-white font-bold' : ''} onClick={() => navigate('reports')}>Reports</button><button className={currentPage === 'projects' ? 'text-white font-bold' : ''} onClick={() => navigate('projects')}>Projects</button><button className={currentPage === 'contacts' ? 'text-white font-bold' : ''} onClick={() => navigate('contacts')}>Contacts</button><button className={currentPage === 'contact-messages' ? 'text-white font-bold' : ''} onClick={() => navigate('contact-messages')}>Messages</button><button className={currentPage === 'notices' ? 'text-white font-bold' : ''} onClick={() => navigate('notices')}>Notices</button><button className={currentPage === 'welfare' ? 'text-white font-bold' : ''} onClick={() => navigate('welfare')}>Welfare</button><button className={currentPage === 'settings' ? 'text-white font-bold' : ''} onClick={() => navigate('settings')}>Settings</button></nav>
                    <button className="text-xs underline text-emerald-200" onClick={() => router.post('/logout')}>Sign out</button>
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
}
