import ManagementLayout from '@/components/layouts/ManagementLayout';
import { venueSidebarConfig } from '@/config/sidebar/venue.sidebar';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/utils/jwt';

export default async function VenueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  let role = null;
  try {
    role = token ? getUserFromToken(token).role : null;
  } catch { }

  const hideSidebar = role === 'STAFF';
  const hideHeader = role === 'STAFF';

  return (
    <ManagementLayout sidebarConfig={venueSidebarConfig} title="Bảng điều khiển của chủ địa điểm" hideSidebar={hideSidebar} hideHeader={hideHeader}>
      {children}
    </ManagementLayout>
  );
}