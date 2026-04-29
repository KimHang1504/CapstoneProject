/**
 * Sidebar config cho Admin
 * Ai code ở role Admin có thể tự thêm tab vào đây
 */

import { SidebarConfig } from '@/types/sidebar';

export const adminSidebarConfig: SidebarConfig = {
  tabs: [
    // Dashboard
    {
      label: 'Dashboard',
      href: '/admin/dashboard-management',
      icon: 'LayoutDashboard',
    },

    // Quản lý người dùng & nội dung
    {
      label: 'Quản lý Người dùng',
      href: '/admin/user-management',
      icon: 'Users',
    },
    {
      label: 'Duyệt Địa điểm',
      href: '/admin/venue-management',
      icon: 'Building2',
    },
    // {
    //   label: 'Quản lý danh mục',
    //   href: '/admin/category-management',
    //   icon: 'FolderTree',
    // },

    // Nội dung & hoạt động
    // {
    //   label: 'Quản lý sự kiện đặc biệt',
    //   href: '/admin/special-event-management',
    //   icon: 'Sparkles',
    // },
    // {
    //   label: 'Quản lý thử thách',
    //   href: '/admin/challenge',
    //   icon: 'Trophy',
    // },
    // {
    //   label: 'Quản lý bài kiểm tra tính cách',
    //   href: '/admin/testtype-management',
    //   icon: 'ClipboardList',
    // },

    // Marketing & khuyến mãi
    {
      label: 'Duyệt quảng cáo',
      href: '/admin/advertisement-management/all',
      icon: 'Megaphone',
    },
    {
      label: 'Duyệt voucher',
      href: '/admin/voucher-management/voucher/all',
      icon: 'Tag',
    },

    // Tài chính
    {
      label: 'Quản lý subscription',
      href: '/admin/subscription-management',
      icon: 'Package',
    },
    // {
    //   label: 'Quản lý giao dịch',
    //   href: '/admin/transaction-management',
    //   icon: 'CreditCard',
    // },
    {
      label: 'Quản lý rút tiền',
      href: '/admin/withdraw-request',
      icon: 'Wallet',
    },

    // Quản trị & hệ thống
    {
      label: 'Quản lý report',
      href: '/admin/report-management',
      icon: 'Flag',
    },
    {
      label: 'Kiểm duyệt AI',
      href: '/admin/moderation-management',
      icon: 'Bot',
    },
    // {
    //   label: 'Cấu hình hệ thống',
    //   href: '/admin/config-management',
    //   icon: 'Settings',
    // },
  ],
};
