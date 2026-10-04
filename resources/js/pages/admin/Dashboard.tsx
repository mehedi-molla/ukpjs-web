import { router } from '@inertiajs/react';
import { AdminDashboard } from '../../pages/admin/AdminDashboard';
import { AdminLayout } from '../../Layouts/AdminLayout';
import type { AuditLog, FinancialSummary, Project, WelfareRequest } from '../../types';

interface Props { financials: FinancialSummary; projects: Project[]; welfareRequests: WelfareRequest[]; logs: AuditLog[]; }

export default function Dashboard(props: Props) {
    const navigate = (page: string) => {
        const routes: Record<string, string> = { dashboard: '/admin/dashboard', transactions: '/admin/transactions', projects: '/admin/projects', contacts: '/admin/contacts' };
        if (routes[page]) router.visit(routes[page]);
    };

    return <AdminLayout currentPage="dashboard" setCurrentPage={navigate}><AdminDashboard setCurrentPage={navigate} onOpenQuickTransaction={() => navigate('transactions')} initialData={props} /></AdminLayout>;
}
