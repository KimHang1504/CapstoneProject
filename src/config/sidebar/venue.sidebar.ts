/**
 * Sidebar config cho Venue
 * Ai code ở role Venue có thể tự thêm tab vào đây
 */
'use client';
import { SidebarConfig } from '@/types/sidebar';
import {
  LayoutDashboard,
  User,
  MessageSquareMore ,
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
      label: 'Insight',
      href: '/venue/insight',
      icon: User,
    },
    {
      label: 'Hồ sơ',
      href: '/venue/profile',
      icon: User,
    },
    {
      label: 'Đánh giá',
      href: '/venue/review',
      icon: MessageSquareMore,
    },
  ],
  // sections: [
  //   {
  //     title: 'Địa điểm',
  //     icon: MapPin,
  //     items: [
  //       {
  //         label: 'Đăng ký địa điểm',
  //         href: '/venue/location/subscriptions',
  //       },
  //       {
  //         label: 'Quản lý địa điểm',
  //         href: '/venue/location/mylocation',
  //       },
  //     ],
  //   },
  // ],
};