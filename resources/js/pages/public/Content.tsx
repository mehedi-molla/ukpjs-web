import { PublicLayout } from '../../Layouts/PublicLayout';
import { AboutPage } from '../../pages/public/AboutPage';
import { BloodDonorsPage } from '../../pages/public/BloodDonorsPage';
import { CommitteePage } from '../../pages/public/CommitteePage';
import { ContactPage } from '../../pages/public/ContactPage';
import { DonationPage } from '../../pages/public/DonationPage';
import { EmergencyContactsPage } from '../../pages/public/EmergencyContactsPage';
import { NoticesPage } from '../../pages/public/NoticesPage';
import { TransparencyPage } from '../../pages/public/TransparencyPage';
import { WelfareApplyPage } from '../../pages/public/WelfareApplyPage';
import type { BloodDonor, FinancialSummary, ImportantContact, Member, Notice, Project, Transaction, WebsiteSettings } from '../../types';
import { navigateToPage as navigate } from '../../utils/navigation';

interface Props {
    page: string;
    settings: WebsiteSettings | null;
    contacts: ImportantContact[];
    notices: Notice[];
    projects: Project[];
    financials: FinancialSummary;
    transactions: Transaction[];
    members: Member[];
    bloodDonors: BloodDonor[];
}

export default function Content({ page, settings, contacts, notices, projects, financials, transactions, members, bloodDonors }: Props) {
    let content: React.ReactNode;
    switch (page) {
        case 'about': content = <AboutPage setCurrentPage={navigate} initialSettings={settings} />; break;
        case 'emergency': content = <EmergencyContactsPage initialContacts={contacts} />; break;
        case 'contact': content = <ContactPage initialSettings={settings} />; break;
        case 'blood-donors': content = <BloodDonorsPage initialDonors={bloodDonors} />; break;
        case 'donation': content = <DonationPage setCurrentPage={navigate} initialSettings={settings} initialProjects={projects} />; break;
        case 'notices': content = <NoticesPage initialNotices={notices} />; break;
        case 'transparency': content = <TransparencyPage onOpenReceipt={() => undefined} initialFinancials={financials} initialTransactions={transactions} initialProjects={projects} />; break;
        case 'welfare': content = <WelfareApplyPage setCurrentPage={navigate} />; break;
        case 'committee': content = <CommitteePage initialMembers={members} />; break;
        default: content = null;
    }

    return <PublicLayout currentPage={page} setCurrentPage={navigate}>{content}</PublicLayout>;
}
