/**
 * Sidebar config cho Admin
 * Ai code ở role Admin có thể tự thêm tab vào đây
 */

import { SidebarConfig } from '@/types/sidebar';

export const adminSidebarConfig: SidebarConfig = {
  tabs: [
    {
      label: 'Dashboard',
      href: '/admin',
    },
    {
      label: 'Quản lý Venue',
      href: '/admin/venues',
    },
    {
      label: 'Quản lý User',
      href: '/admin/users',
    },
    {
      label: 'Báo cáo',
      href: '/admin/reports',
    },
    {
      label: 'Cài đặt',
      href: '/admin/settings',
    },
  ],
};
