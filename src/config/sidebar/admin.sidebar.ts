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
      label: 'Duyệt Địa điểm',
      href: '/admin/venue-management',
    },
      {
      label: 'Quản lý Người dùng',
      href: '/admin/user-management',
    },
    {
      label: 'Duyệt quảng cáo',
      href: '/admin/advertisement-management',
    },
    {
      label: 'Quản lý sự kiện đặc biệt',
      href: '/admin/special-event-management',
    },
    {
      label: 'Quản lý thử thách',
      href: '/admin/challenge',
    },
    {
      label: 'Duyệt voucher',
      href: '/admin/voucher-management',
    },
    {
      label: 'Quản lý report',
      href: '/admin/report-management',
    },
    {
      label: 'Cấu hình hệ thống',
      href: '/admin/config-management',
    },
    {
      label: 'Quản lý danh mục',
      href: '/admin/category-management',
    },
    {
      label: 'Quản lý bài kiểm tra tính cách',
      href: '/admin/testtype-management',
    },
  ],
};
