import { router } from "@inertiajs/react";
import { useLanguage } from "../context/LanguageContext";
import { useState } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  HandCoins,
  Users,
  CalendarClock,
  FileBarChart,
  Layers,
  Contact,
  Mail,
  Bell,
  HeartHandshake,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  ChevronRight,
  Globe,
  ChevronDown,
} from "lucide-react";

interface Props {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const getPageLabel = (page: string, t: (bn: string, en: string) => string) => {
  const map: Record<string, string> = {
    dashboard: t("ড্যাশবোর্ড", "Dashboard"),
    transactions: t("লেনদেনসমূহ", "Transactions"),
    "donation-submissions": t("অনুদান", "Donations"),
    members: t("সদস্যবৃন্দ", "Members"),
    "monthly-donations": t("মাসিক", "Monthly"),
    reports: t("প্রতিবেদনসমূহ", "Reports"),
    projects: t("প্রকল্পসমূহ", "Projects"),
    contacts: t("যোগাযোগ", "Contacts"),
    "contact-messages": t("বার্তা", "Messages"),
    notices: t("বিজ্ঞপ্তি", "Notices"),
    welfare: t("কল্যাণ", "Welfare"),
    settings: t("সেটিংস", "Settings"),
  };
  return map[page] || page;
};

export function AdminLayout({ children, currentPage, setCurrentPage }: Props) {
  const { lang, toggleLang, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const navigate = (page: string) => {
    const routes: Record<string, string> = {
      dashboard: "/admin/dashboard",
      transactions: "/admin/transactions",
      "donation-submissions": "/admin/donation-submissions",
      members: "/admin/members",
      "monthly-donations": "/admin/monthly-donations",
      reports: "/admin/reports",
      projects: "/admin/projects",
      contacts: "/admin/contacts",
      "contact-messages": "/admin/contact-messages",
      notices: "/admin/notices",
      welfare: "/admin/welfare",
      settings: "/admin/settings",
    };
    setIsMobileMenuOpen(false);
    if (routes[page]) router.visit(routes[page]);
    else setCurrentPage(page);
  };

  const navItems = [
    { id: "dashboard", label: t("ড্যাশবোর্ড", "Dashboard"), icon: LayoutDashboard },
    { id: "transactions", label: t("লেনদেনসমূহ", "Transactions"), icon: ArrowLeftRight },
    { id: "donation-submissions", label: t("অনুদান", "Donations"), icon: HandCoins },
    { id: "members", label: t("সদস্যবৃন্দ", "Members"), icon: Users },
    { id: "monthly-donations", label: t("মাসিক", "Monthly"), icon: CalendarClock },
    { id: "reports", label: t("প্রতিবেদনসমূহ", "Reports"), icon: FileBarChart },
    { id: "projects", label: t("প্রকল্পসমূহ", "Projects"), icon: Layers },
    { id: "contacts", label: t("যোগাযোগ", "Contacts"), icon: Contact },
    { id: "contact-messages", label: t("বার্তা", "Messages"), icon: Mail },
    { id: "notices", label: t("বিজ্ঞপ্তি", "Notices"), icon: Bell },
    { id: "welfare", label: t("কল্যাণ", "Welfare"), icon: HeartHandshake },
    { id: "settings", label: t("সেটিংস", "Settings"), icon: Settings },
  ];

  const currentLabel = getPageLabel(currentPage, t);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-64 flex-col bg-emerald-950 text-white border-r border-emerald-900 sticky top-0 h-screen">
          <div className="px-5 py-6 border-b border-emerald-900">
            <button
              onClick={() => navigate("dashboard")}
              className="text-left cursor-pointer w-full"
            >
              <span className="text-xs text-emerald-300 uppercase tracking-wider">
                UKPJS
              </span>
              <h1 className="font-serif font-bold text-lg mt-0.5">Super Admin</h1>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    isActive
                      ? "bg-emerald-800 text-white font-semibold"
                      : "text-emerald-100 hover:bg-emerald-900 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t border-emerald-900 space-y-1">
            <button
              onClick={() => router.visit("/")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-emerald-100 hover:bg-emerald-900 hover:text-white transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>{t("প্রধান সাইট", "Back to Site")}</span>
            </button>
            <button
              onClick={() => router.post("/logout")}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-200 hover:bg-rose-950/50 hover:text-rose-100 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>{t("সাইন আউট", "Sign out")}</span>
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200">
            <div className="px-3 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-500">
                  <button
                    onClick={() => navigate("dashboard")}
                    className="hover:text-emerald-700 transition-colors hidden sm:inline"
                  >
                    {t("অ্যাডমিন", "Admin")}
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 hidden sm:inline" />
                  <span className="text-stone-900 font-medium">{currentLabel}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 rounded-lg border border-stone-200 transition-colors whitespace-nowrap cursor-pointer"
                    title="Change Language"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{lang === "bn" ? "বাংলা" : "English"}</span>
                    <ChevronDown className="w-3 h-3 text-stone-400" />
                  </button>

                  {isLangMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-32 bg-white border border-stone-200 rounded-xl shadow-xl py-1 z-50 text-xs text-stone-700"
                      onMouseLeave={() => setIsLangMenuOpen(false)}
                    >
                      <button
                        onClick={() => {
                          if (lang !== "bn") toggleLang();
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-stone-50 transition-colors cursor-pointer ${
                          lang === "bn" ? "text-emerald-700 font-semibold" : "text-stone-700"
                        }`}
                      >
                        বাংলা
                      </button>
                      <button
                        onClick={() => {
                          if (lang !== "en") toggleLang();
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-stone-50 transition-colors cursor-pointer ${
                          lang === "en" ? "text-emerald-700 font-semibold" : "text-stone-700"
                        }`}
                      >
                        English
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-emerald-950 text-white flex flex-col shadow-2xl">
            <div className="px-4 py-4 flex items-center justify-between border-b border-emerald-900">
              <button
                onClick={() => navigate("dashboard")}
                className="text-left cursor-pointer"
              >
                <span className="text-xs text-emerald-300 uppercase tracking-wider">
                  UKPJS
                </span>
                <h1 className="font-serif font-bold">Super Admin</h1>
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-emerald-900 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      isActive
                        ? "bg-emerald-800 text-white font-semibold"
                        : "text-emerald-100 hover:bg-emerald-900 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="px-3 py-4 border-t border-emerald-900 space-y-1">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.visit("/");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-emerald-100 hover:bg-emerald-900 hover:text-white transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>{t("প্রধান সাইট", "Back to Site")}</span>
              </button>
              <button
                onClick={() => router.post("/logout")}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-200 hover:bg-rose-950/50 hover:text-rose-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>{t("সাইন আউট", "Sign out")}</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
