'use client';
import { SidebarConfig } from '@/types/sidebar';

export const venueSidebarConfig: SidebarConfig = {
  tabs: [
    {
      label: 'Dashboard',
      href: '/venue/dashboard',
      icon: 'LayoutDashboard',
    },
    // {
    //   label: 'Địa điểm',
    //   href: '/venue/location/mylocation',
    //   icon: 'MapPin',
    // },
    // {
    //   label: 'Quảng cáo',
    //   href: '/venue/advertisement',
    //   icon: 'Megaphone',
    // },

    {
      label: 'Insight',
      href: '/venue/insight',
      icon: 'BarChart3',
    },
    {
      label: 'Ví của tôi',
      href: '/venue/wallet',
      icon: 'Wallet',
    },

  ],
  sections: [
    {
      title: 'Địa điểm',
      icon: 'MapPin',
      items: [
        {
          label: 'Quản lý địa điểm',
          href: '/venue/location/mylocation',
          icon: 'MapPin',
        },
        {
          label: 'Lịch sử đăng ký',
          href: '/venue/location/transaction',
          icon: 'FileText',
        },
      ],
    },
    {
      title: 'Voucher',
      icon: 'TicketPercent',
      items: [
        {
          label: 'Voucher của tôi',
          href: '/venue/voucher/myvoucher',
          icon: 'TicketPercent',
        },
        {
          label: 'Đổi mã giảm giá',
          href: '/venue/redeem',
          icon: 'Tag',
        },
        {
          label: 'Quyết toán voucher',
          href: '/venue/voucher/settlement',
          icon: 'CreditCard',
        },
      ],
    },
    {
      title: 'Quảng cáo',
      icon: 'Megaphone',
      items: [
        {
          label: 'Quản lý quảng cáo',
          href: '/venue/advertisement/myadvertisement',
          icon: 'Megaphone',
        },
        {
          label: 'Lịch sử mua quảng cáo',
          href: '/venue/advertisement/transaction',
          icon: 'FileText',
        },
      ],
    },
  ],
};