import { router } from '@inertiajs/react';
import { HomePage } from '../../pages/public/HomePage';
import { PublicLayout } from '../../Layouts/PublicLayout';
import type { EmergencyService, FinancialSummary, ImportantContact, Notice, Project } from '../../types';
import { navigateToPage as navigate } from '../../utils/navigation';

interface HomeProps {
    financials: FinancialSummary;
    projects: Project[];
    contacts: ImportantContact[];
    notices: Notice[];
    emergencyServices: EmergencyService[];
}

export default function Home(props: HomeProps) {
    return (
        <PublicLayout currentPage="home" setCurrentPage={navigate}>
            <HomePage initialData={props} setCurrentPage={navigate} setSelectedProjectSlug={(slug) => router.visit(`/projects/${slug}`)} />
        </PublicLayout>
    );
}
