import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Transaction } from './types';

// Components
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { ReceiptModal } from './components/ReceiptModal';
import { QuickTransactionModal } from './components/QuickTransactionModal';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { DonationPage } from './pages/public/DonationPage';
import { EmergencyContactsPage } from './pages/public/EmergencyContactsPage';
import { BloodDonorsPage } from './pages/public/BloodDonorsPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth & Portal Pages
import { LoginPage } from './pages/auth/LoginPage';
import { MemberDashboard } from './pages/member/MemberDashboard';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminTransactions } from './pages/admin/AdminTransactions';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminMembers } from './pages/admin/AdminMembers';
import { AdminMonthlyDonations } from './pages/admin/AdminMonthlyDonations';
import { AdminContacts } from './pages/admin/AdminContacts';
import { AdminWelfareRequests } from './pages/admin/AdminWelfareRequests';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string>('solar-street-lighting-ukpjs-2024');
  const [receiptTransaction, setReceiptTransaction] = useState<Transaction | null>(null);
  const [isQuickTrxOpen, setIsQuickTrxOpen] = useState(false);

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleOpenReceipt = (trx: Transaction) => {
    setReceiptTransaction(trx);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} setSelectedProjectSlug={setSelectedProjectSlug} />;
      case 'about':
        return <AboutPage setCurrentPage={setCurrentPage} />;
      case 'projects':
        return <ProjectsPage setCurrentPage={setCurrentPage} setSelectedProjectSlug={setSelectedProjectSlug} />;
      case 'project-detail':
        return (
          <ProjectDetailPage
            projectSlug={selectedProjectSlug}
            setCurrentPage={setCurrentPage}
            onOpenReceipt={handleOpenReceipt}
          />
        );
      case 'donation':
        return <DonationPage setCurrentPage={setCurrentPage} />;
      case 'emergency':
        return <EmergencyContactsPage />;
      case 'blood-donors':
        return <BloodDonorsPage />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;

      // Member Portal
      case 'member-dashboard':
        return <MemberDashboard setCurrentPage={setCurrentPage} onOpenReceipt={handleOpenReceipt} />;

      // Admin Dashboard Suite
      case 'admin-dashboard':
        return (
          <AdminDashboard
            setCurrentPage={setCurrentPage}
            onOpenQuickTransaction={() => setIsQuickTrxOpen(true)}
          />
        );
      case 'admin-transactions':
        return (
          <AdminTransactions
            onOpenQuickTransaction={() => setIsQuickTrxOpen(true)}
            onOpenReceipt={handleOpenReceipt}
          />
        );
      case 'admin-projects':
        return <AdminProjects />;
      case 'admin-members':
        return <AdminMembers />;
      case 'admin-monthly':
        return <AdminMonthlyDonations onOpenReceipt={handleOpenReceipt} />;
      case 'admin-contacts':
        return <AdminContacts />;
      case 'admin-welfare':
        return <AdminWelfareRequests />;
      case 'admin-reports':
        return <AdminReports />;
      case 'admin-settings':
        return <AdminSettings />;

      default:
        return <HomePage setCurrentPage={setCurrentPage} setSelectedProjectSlug={setSelectedProjectSlug} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Top Bar Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenQuickTransaction={() => setIsQuickTrxOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer setCurrentPage={setCurrentPage} />

      {/* Mobile-first bottom thumb nav bar */}
      <MobileBottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Official Printable Receipt Modal */}
      {receiptTransaction && (
        <ReceiptModal
          transaction={receiptTransaction}
          onClose={() => setReceiptTransaction(null)}
        />
      )}

      {/* Quick Transaction Entry Modal for Admin */}
      <QuickTransactionModal
        isOpen={isQuickTrxOpen}
        onClose={() => setIsQuickTrxOpen(false)}
        onSuccess={() => {
          // If on admin transactions, will trigger reload or user sees toast
        }}
      />

    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
}

export default App;
