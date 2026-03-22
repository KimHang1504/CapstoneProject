'use client';
import { SidebarConfig } from '@/types/sidebar';
import {
  LayoutDashboard,
  MapPin,
  Megaphone,
  Wallet,
  BarChart3,
  TicketPercent,
} from 'lucide-react';

export const venueSidebarConfig: SidebarConfig = {
  tabs: [
    {
      label: 'Dashboard',
      href: '/venue/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Địa điểm',
      href: '/venue/location/mylocation',
      icon: MapPin,
    },
    {
      label: 'Quảng cáo',
      href: '/venue/advertisement',
      icon: Megaphone,
    },
    {
      label: 'Wallet',
      href: '/venue/wallet',
      icon: Wallet,
    },
    {
      label: 'Insight',
      href: '/venue/insight',
      icon: BarChart3,
    },
  ],
  sections: [
    {
      title: 'Địa điểm',
      icon: TicketPercent,
      items: [
        {
          label: 'Quản lý địa điểm',
          href: '/venue/location/mylocation',
        },
        {
          label: 'Lịch sử giao dịch',
          href: '/venue/location/subscriptions/transaction',
        },
      ],
    },
    {
      title: 'Voucher',
      icon: TicketPercent,
      items: [
        {
          label: 'Voucher của tôi',
          href: '/venue/voucher',
        },
        {
          label: 'Đổi mã giảm giá',
          href: '/venue/redeem',
        },
      ],
    },
    {
      title: 'Quảng cáo',
      icon: TicketPercent,
      items: [
        {
          label: 'Quản lý quảng cáo',
          href: '/venue/advertisement',
        },
        {
          label: 'Lịch sử giao dịch',
          href: '/venue/advertisement/transaction',
        },
      ],
    },
  ],
};