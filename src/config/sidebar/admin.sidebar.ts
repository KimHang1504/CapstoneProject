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
      href: '/admin/venue-management',
    },
    {
      label: 'Quản lí quảng cáo',
      href: '/admin/advertisement-management',
    },
    {
      label: 'Quản lí sự kiện đặc biệt',
      href: '/admin/special-event-management',
    },
    {
      label: 'Thử thách',
      href: '/admin/challenge',
    },
    {
      label: 'Quản lí voucher',
      href: '/admin/voucher-management',
    },
    {
      label: 'Quản lí report',
      href: '/admin/report-management',
    },
    {
      label: 'Cấu hình hệ thống',
      href: '/admin/config-management',
    }
  ],
};
