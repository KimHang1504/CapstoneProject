import ManagementLayout from '@/components/layouts/ManagementLayout';
import { adminSidebarConfig } from '@/config/sidebar/admin.sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ManagementLayout sidebarConfig={adminSidebarConfig} title="Admin Panel">
      {children}
    </ManagementLayout>
  );
}
