import ManagementLayout from '@/components/layouts/ManagementLayout';
import { venueSidebarConfig } from '@/config/sidebar/venue.sidebar';

export default function VenueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ManagementLayout sidebarConfig={venueSidebarConfig} title="Bảng điều khiển địa điểm">
      {children}
    </ManagementLayout>
  );
}
