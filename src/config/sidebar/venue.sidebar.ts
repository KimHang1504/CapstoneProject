/**
 * Sidebar config cho Venue
 * Ai code ở role Venue có thể tự thêm tab vào đây
 */
'use client';
import { SidebarConfig } from '@/types/sidebar';
import {
  MapPin,
  LayoutDashboard,
  User,
  TicketPercent,
  ShoppingBag,
  BarChart3,
} from 'lucide-react';

export const venueSidebarConfig: SidebarConfig = {
  sections: [
    {
      title: 'Địa điểm',
      icon: MapPin,
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
      icon: LayoutDashboard,
    },
    {
      label: 'Hồ sơ',
      href: '/venue/profile',
      icon: User,
    },
    {
      label: 'Voucher',
      href: '/venue/vouchers',
      icon: TicketPercent,
    },
    {
      label: 'Đơn hàng',
      href: '/venue/orders',
      icon: ShoppingBag,
    },
    {
      label: 'Thống kê',
      href: '/venue/analytics',
      icon: BarChart3,
    },
  ],
};