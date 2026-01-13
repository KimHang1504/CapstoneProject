import ManagementLayout from '@/components/layouts/ManagementLayout';
import { venueSidebarConfig } from '@/config/sidebar/venue.sidebar';

export default function VenueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ManagementLayout sidebarConfig={venueSidebarConfig} title="Venue Panel">
      {children}
    </ManagementLayout>
  );
}
