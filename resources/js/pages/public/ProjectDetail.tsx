import { PublicLayout } from '../../Layouts/PublicLayout';
import { ProjectDetailPage } from '../../pages/public/ProjectDetailPage';
import type { Project, Transaction } from '../../types';
import { navigateToPage as navigate } from '../../utils/navigation';

export default function ProjectDetail({ project }: { project: Project & { transactions?: Transaction[] } }) {
    return <PublicLayout currentPage="projects" setCurrentPage={navigate}><ProjectDetailPage initialData={project} projectSlug={project.slug} setCurrentPage={navigate} /></PublicLayout>;
}
