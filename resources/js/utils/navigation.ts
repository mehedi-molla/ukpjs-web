import { router } from '@inertiajs/react';

// Single source of truth for the page ids used by Navbar, Footer, MobileBottomNav and page buttons.
export const publicRoutes: Record<string, string> = {
  home: '/', about: '/about', projects: '/projects', emergency: '/emergency-contacts', 'emergency-services': '/emergency',
  'blood-donors': '/blood-donors', contact: '/contact', donation: '/donate', notices: '/notices',
  transparency: '/transparency', welfare: '/welfare/apply', committee: '/committee', login: '/login',
  'admin-dashboard': '/admin/dashboard', 'member-dashboard': '/member/dashboard',
};

export const navigateToPage = (page: string) => {
  if (publicRoutes[page]) router.visit(publicRoutes[page]);
};
