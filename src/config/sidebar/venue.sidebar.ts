/**
 * Sidebar config cho Venue
 * Ai code ở role Venue có thể tự thêm tab vào đây
 */

import { SidebarConfig } from '@/types/sidebar';

export const venueSidebarConfig: SidebarConfig = {
  sections: [
    {
      title: 'Địa điểm',
      items: [
        {
          label: 'Đăng ký địa điểm',
          href: '/venue/location/subscriptions',
        },
        {
          label: 'Quản lý địa điểm',
          href: '/venue/location/mylocation',
        },
      ],
    },
  ],


  tabs: [
    {
      label: 'Dashboard',
      href: '/venue',
    },
    {
      label: 'Hồ sơ',
      href: '/venue/profile',
    },
    {
      label: 'Voucher',
      href: '/venue/vouchers',
    },
    {
      label: 'Đơn hàng',
      href: '/venue/orders',
    },
    {
      label: 'Thống kê',
      href: '/venue/analytics',
    },
  ],
};
