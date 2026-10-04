import { PublicLayout } from '../../Layouts/PublicLayout';
import { EmergencyServicesPage } from '../../pages/public/EmergencyServicesPage';
import type { EmergencyService } from '../../types';
import { navigateToPage as navigate } from '../../utils/navigation';

export default function EmergencyServices({ services }: { services: EmergencyService[] }) {
    return <PublicLayout currentPage="emergency-services" setCurrentPage={navigate}><EmergencyServicesPage services={services} /></PublicLayout>;
}
