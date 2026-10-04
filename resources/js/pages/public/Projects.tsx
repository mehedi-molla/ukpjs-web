import { router } from '@inertiajs/react';
import { PublicLayout } from '../../Layouts/PublicLayout';
import { ProjectsPage } from '../../pages/public/ProjectsPage';
import type { Project } from '../../types';
import { navigateToPage as navigate } from '../../utils/navigation';

export default function Projects({ projects }: { projects: Project[] }) {
    return <PublicLayout currentPage="projects" setCurrentPage={navigate}><ProjectsPage initialData={projects} setCurrentPage={navigate} setSelectedProjectSlug={(slug) => router.visit(`/projects/${slug}`)} /></PublicLayout>;
}
