import { router } from '@inertiajs/react';
import { PublicLayout } from '../../Layouts/PublicLayout';
import { ProjectsPage } from '../../pages/public/ProjectsPage';
import type { Project } from '../../types';

export default function Projects({ projects }: { projects: Project[] }) {
    const navigate = (page: string) => {
        if (page === 'home') router.visit('/');
        if (page === 'projects') router.visit('/projects');
    };

    return <PublicLayout currentPage="projects" setCurrentPage={navigate}><ProjectsPage initialData={projects} setCurrentPage={navigate} setSelectedProjectSlug={(slug) => router.visit(`/projects/${slug}`)} /></PublicLayout>;
}
