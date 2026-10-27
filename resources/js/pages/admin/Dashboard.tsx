import { router } from '@inertiajs/react';
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { AdminLayout } from '../../Layouts/AdminLayout';
import type { AuditLog, FinancialSummary, Project, WelfareRequest } from '../../types';

interface Props { financials: FinancialSummary; projects: Project[]; welfareRequests: WelfareRequest[]; logs: AuditLog[]; }

export default function Dashboard(props: Props) {
    const navigate = (page: string) => {
        const routes: Record<string, string> = {
            dashboard: '/admin/dashboard',
            transactions: '/admin/transactions',
            'admin-transactions': '/admin/transactions',
            projects: '/admin/projects',
            'admin-projects': '/admin/projects',
            contacts: '/admin/contacts',
            'admin-contacts': '/admin/contacts',
            members: '/admin/members',
            'admin-members': '/admin/members',
            welfare: '/admin/welfare',
            'admin-welfare': '/admin/welfare',
            'monthly-donations': '/admin/monthly-donations',
            'admin-monthly': '/admin/monthly-donations',
            reports: '/admin/reports',
            'admin-reports': '/admin/reports',
            settings: '/admin/settings',
            'admin-settings': '/admin/settings',
            'donation-submissions': '/admin/donation-submissions',
            notices: '/admin/notices',
            'contact-messages': '/admin/contact-messages',
        };
        if (routes[page]) router.visit(routes[page]);
        else router.visit(page.startsWith('/admin') ? page : `/admin/${page}`);
    };

    return <AdminLayout currentPage="dashboard" setCurrentPage={navigate}><AdminDashboard setCurrentPage={navigate} onOpenQuickTransaction={() => navigate('transactions')} initialData={props} /></AdminLayout>;
}
