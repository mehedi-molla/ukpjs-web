import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';

interface Props {
    children: React.ReactNode;
    currentPage: string;
    setCurrentPage: (page: string) => void;
}

export function PublicLayout({ children, currentPage, setCurrentPage }: Props) {
    return (
        <NotificationProvider>
            <AuthProvider>
                <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
                    <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    <main className="flex-1">{children}</main>
                    <Footer setCurrentPage={setCurrentPage} />
                    <MobileBottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </div>
            </AuthProvider>
        </NotificationProvider>
    );
}
