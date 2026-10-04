import { router } from '@inertiajs/react';
import { HomePage } from '../../pages/public/HomePage';
import { PublicLayout } from '../../Layouts/PublicLayout';
import type { FinancialSummary, ImportantContact, Notice, Project } from '../../types';

interface HomeProps {
    financials: FinancialSummary;
    projects: Project[];
    contacts: ImportantContact[];
    notices: Notice[];
}

export default function Home(props: HomeProps) {
    const navigate = (page: string) => {
        const routes: Record<string, string> = {
            home: '/', about: '/about', projects: '/projects', emergency: '/emergency-contacts',
            'blood-donors': '/blood-donors', contact: '/contact', donation: '/donate', login: '/login',
            'admin-dashboard': '/admin/dashboard', 'member-dashboard': '/member/dashboard',
        };

        if (routes[page]) router.visit(routes[page]);
    };

    return (
        <PublicLayout currentPage="home" setCurrentPage={navigate}>
            <HomePage initialData={props} setCurrentPage={navigate} setSelectedProjectSlug={(slug) => router.visit(`/projects/${slug}`)} />
        </PublicLayout>
    );
}
