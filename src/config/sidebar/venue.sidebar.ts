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
      href: '/venue',
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
  ],
};