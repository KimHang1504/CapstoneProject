'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarConfig } from '@/types/sidebar';
import { UserProfile } from '@/api/auth/type';

type Props = {
  children: React.ReactNode;
  sidebarConfig: SidebarConfig;
  title?: string;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onEditProfile: () => void;
  getDashboardUrl: () => string;
};

export default function ManagementShell({
  children,
  sidebarConfig,
  title,
  userProfile,
  onLogout,
  onEditProfile,
  getDashboardUrl,
}: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="h-screen flex">
      <Sidebar
        sidebarConfig={sidebarConfig}
        isOpen={open}
        onToggle={() => setOpen(!open)}
        getDashboardUrl={getDashboardUrl}
      />

      <div className="flex-1 flex flex-col">
        <Header
          title={title}
          userProfile={userProfile}
          onLogout={onLogout}
          onEditProfile={onEditProfile}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}