import { router } from '@inertiajs/react';
import { PublicLayout } from '../../Layouts/PublicLayout';
import { ProjectDetailPage } from '../../pages/public/ProjectDetailPage';
import type { Project, Transaction } from '../../types';

export default function ProjectDetail({ project }: { project: Project & { transactions?: Transaction[] } }) {
    const navigate = (page: string) => {
        if (page === 'home') router.visit('/');
        if (page === 'projects') router.visit('/projects');
    };

    return <PublicLayout currentPage="projects" setCurrentPage={navigate}><ProjectDetailPage initialData={project} projectSlug={project.slug} setCurrentPage={navigate} /></PublicLayout>;
}
