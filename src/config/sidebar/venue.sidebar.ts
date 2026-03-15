/**
 * Sidebar config cho Venue
 * Ai code ở role Venue có thể tự thêm tab vào đây
 */
'use client';
import { SidebarConfig } from '@/types/sidebar';
import {
  LayoutDashboard,
  User,
} from 'lucide-react';

export const venueSidebarConfig: SidebarConfig = {
    tabs: [
    {
      label: 'Dashboard',
      href: '/venue',
      icon: LayoutDashboard,
    },
    {
      label: 'Địa điểm',
      href: '/venue/location/mylocation',
      icon: LayoutDashboard,
    },
        {
      label: 'Quảng cáo',
      href: '/venue/advertisement',
      icon: LayoutDashboard,
    },
      {
      label: 'Voucher',
      href: '/venue/voucher',
      icon: LayoutDashboard,
    },
        {
      label: 'Insight',
      href: '/venue/insight',
      icon: User,
    },

  ],
  sections: [
    {
      title: 'Voucher',
      icon: LayoutDashboard,
      items: [
        {
          label: 'Voucher của tôi',
          href: '/venue/voucher',
        },
        {
          label: 'Đổi mã giảm giá',
          href: '/venue/voucher/redeem',
        },
      ],
    },
  ],
};