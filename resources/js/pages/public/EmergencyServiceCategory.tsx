import { PublicLayout } from '../../Layouts/PublicLayout';
import { EmergencyServiceCategoryPage } from '../../pages/public/EmergencyServiceCategoryPage';
import type { EmergencyEntry, EmergencyService } from '../../types';
import { navigateToPage as navigate } from '../../utils/navigation';

export default function EmergencyServiceCategory({ service, entries }: { service: EmergencyService; entries: EmergencyEntry[] }) {
    return <PublicLayout currentPage="emergency-services" setCurrentPage={navigate}><EmergencyServiceCategoryPage service={service} entries={entries} /></PublicLayout>;
}
