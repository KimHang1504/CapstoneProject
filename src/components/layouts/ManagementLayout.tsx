'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarConfig, IconName } from '@/types/sidebar';
import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
  Building2,
  Users,
  Megaphone,
  Sparkles,
  Trophy,
  Tag,
  Flag,
  Settings,
  FolderTree,
  Wallet,
  CreditCard,
  Package,
  ClipboardList,
  Calendar,
  MessageSquare,
  BarChart,
  BarChart3,
  FileText,
  MapPin,
  TicketPercent,
  Bot,
} from 'lucide-react';
import { getMe } from '@/api/auth/api';
import { UserProfile } from '@/api/auth/type';
import EditProfileModal from '@/components/EditProfileModal';
import { apiClient } from '@/lib/api-client';
import Image from 'next/image';

type ManagementLayoutProps = {
  children: React.ReactNode;
  sidebarConfig: SidebarConfig;
  title?: string;
   hideSidebar?: boolean;
};

// Icon mapper
const iconMap: Record<IconName, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Building2,
  Users,
  Megaphone,
  Sparkles,
  Trophy,
  Tag,
  Flag,
  Settings,
  FolderTree,
  Wallet,
  CreditCard,
  Package,
  ClipboardList,
  Calendar,
  MessageSquare,
  BarChart,
  BarChart3,
  FileText,
  MapPin,
  TicketPercent,
  Bot,
};

const getIcon = (iconName?: IconName) => {
  if (!iconName) return null;
  return iconMap[iconName];
};

export default function ManagementLayout({
  children,
  sidebarConfig,
  title,
  hideSidebar = false,
}: ManagementLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userToggledSections, setUserToggledSections] = useState<Set<string>>(new Set());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Helper function to check if a route is active (exact match or parent route)
  const isRouteActive = (currentPath: string, routePath: string) => {
    return currentPath === routePath || currentPath.startsWith(routePath + '/');
  };

  // Compute active sections based on current route
  const activeSections = sidebarConfig.sections?.reduce<string[]>((acc, section) => {
    const hasActiveItem = section.items.some(item => isRouteActive(pathname, item.href));
    if (hasActiveItem) {
      acc.push(section.title);
    }
    return acc;
  }, []) ?? [];

  // Determine which sections should be expanded
  const expandedSections = [
    ...new Set([...activeSections, ...userToggledSections])
  ];

  const toggleSection = (section: string) => {
    setUserToggledSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getMe();
        setUserProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    // Xóa token từ localStorage và api client
    apiClient.clearAuthToken();

    // Xóa cookie
    document.cookie = 'accessToken=; path=/; max-age=0';

    // Đóng menu
    setShowProfileMenu(false);

    // Redirect về trang auth
    window.location.replace('/auth');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      'VENUEOWNER': 'Chủ địa điểm',
      'ADMIN': 'Quản trị viên',
      'STAFF': 'Nhân viên',
    };
    return roleMap[role] || role;
  };

  const handleProfileUpdated = async () => {
    const res = await getMe();
    setUserProfile(res.data);
    console.log("🔥 NEW PROFILE AFTER UPDATE:", res.data);
  };

  const getDashboardUrl = () => {
    if (!userProfile) return '/';

    const role = userProfile.role;
    if (role === 'VENUEOWNER') {
      return '/venue/dashboard';
    } else if (role === 'ADMIN') {
      return '/admin';
    }
    return '/';
  };

  useEffect(() => {
    const handleOpenProfileModal = () => {
      setShowEditModal(true);
    };

    window.addEventListener("openProfileModal", handleOpenProfileModal);

    return () => {
      window.removeEventListener("openProfileModal", handleOpenProfileModal);
    };
  }, []);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      {!hideSidebar && (
      <aside
        className={`
          ${isSidebarOpen ? 'w-56' : 'w-16'} 
          bg-[#8093F1] flex flex-col transition-all duration-300 ease-in-out
          border-r border-purple-200/50
        `}
      >
        {/* Sidebar Header */}
        <div className="p-2.5 border-b border-white/10 bg-[#8093F1]">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <Link
                href={getDashboardUrl()}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
              >
                <Image
                  src="/logo.png"
                  alt="CoupleMood"
                  width={32}
                  height={32}
                />
                <span className="font-semibold text-white text-md">CoupleMood</span>
              </Link>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200 text-white"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">


          {/* Fallback for tabs without sections */}
          {sidebarConfig.tabs && (
            <div className="space-y-0.5">
              {sidebarConfig.tabs.map((tab) => {
                const isActive = isRouteActive(pathname, tab.href);
                const Icon = getIcon(tab.icon);

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`
                      flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-200
                      group relative
                      ${isActive
                        ? 'bg-white text-[#8093F1] shadow-sm font-medium'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }
                    `}
                    title={!isSidebarOpen ? tab.label : undefined}
                  >
                    {Icon && <Icon className="w-4 h-4 shrink-0" />}
                    {isSidebarOpen && <span className="text-md truncate">{tab.label}</span>}
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white rounded-l"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Sections */}
          {sidebarConfig.sections?.map((section) => (
            <div key={section.title} className="mb-3">
              {isSidebarOpen && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-md font-semibold text-white/80 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    {section.icon && (() => {
                      const SectionIcon = getIcon(section.icon);
                      return SectionIcon ? <SectionIcon className="w-4 h-4" /> : null;
                    })()}
                    <span>{section.title}</span>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedSections.includes(section.title) ? 'rotate-180' : ''
                      }`}
                  />
                </button>
              )}

              <div className={`space-y-0.5 mt-0.5 ${isSidebarOpen && !expandedSections.includes(section.title)
                ? 'hidden'
                : ''
                }`}>
                {section.items.map((item) => {
                  const isActive = isRouteActive(pathname, item.href);
                  const Icon = getIcon(item.icon);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-200
                        group relative ${isSidebarOpen ? 'ml-5' : ''}
                        ${isActive
                          ? 'bg-white text-[#8093F1] shadow-sm font-medium'
                          : 'text-white/90 hover:bg-white/10 hover:text-white'
                        }
                      `}
                      title={!isSidebarOpen ? item.label : undefined}
                    >
                      {Icon && (
                        <Icon className="w-4 h-4 shrink-0" />
                      )}
                      {isSidebarOpen && (
                        <span className="text-md truncate">{item.label}</span>
                      )}
                      {isActive && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white rounded-l"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}


        </nav>

        {/* Footer */}
        {/* <div className="p-3 border-t border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <button className={`
            w-full px-3 py-2.5 text-sm font-medium text-gray-600 
            hover:bg-white hover:text-purple-600 rounded-xl transition-all duration-200
            flex items-center gap-2 justify-center
          `}>
            <User className="w-4 h-4" />
            {isSidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div> */}
      </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-purple-100">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Left side - Title */}
              <div>
                <h1 className="text-2xl font-bold text-black">
                  {title || 'Chủ địa điểm'}
                </h1>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center gap-4">
                {/* Filter Button */}
                {/* <button className="p-2 hover:bg-purple-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-purple-600 relative group">
                  <Filter className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full"></span>
                </button> */}

                {/* Export Button */}
                {/* <button className="p-2 hover:bg-purple-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-purple-600">
                  <Download className="w-5 h-5" />
                </button> */}

                {/* Notifications */}
                {/* <button className="p-2 hover:bg-purple-50 rounded-xl transition-all duration-200 text-gray-600 hover:text-purple-600 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                </button> */}

                {/* User Profile */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 pl-4 border-l border-purple-200 hover:bg-purple-50 rounded-xl pr-3 py-2 transition-all duration-200"
                  >
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">
                        {userProfile?.fullName || 'Loading...'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userProfile ? getRoleDisplay(userProfile.role) : '...'}
                      </p>
                    </div>
                    {userProfile?.avatarUrl ? (
                      <Image
                        src={userProfile.avatarUrl || "/default-avatar.png"}
                        alt={userProfile.fullName}
                        width={40}
                        height={40}
                        className="rounded-full object-cover ring-2 ring-purple-200 hover:ring-purple-400 transition-all duration-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-linear-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-lg transition-all duration-200">
                        {userProfile ? getInitials(userProfile.fullName) : '?'}
                      </div>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden z-50">
                      {/* Profile Header */}
                      <div className="bg-linear-to-r from-purple-500 to-pink-500 p-4">
                        <div className="flex items-center gap-3">
                          {userProfile?.avatarUrl ? (
                            <Image
                              src={userProfile.avatarUrl || "/default-avatar.png"}
                              alt={userProfile.fullName || "avatar"}
                              width={56}
                              height={56}
                              className="rounded-full object-cover ring-4 ring-white/30"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg ring-4 ring-white/30">
                              {userProfile ? getInitials(userProfile.fullName) : '?'}
                            </div>
                          )}
                          <div className="flex-1 text-white">
                            <p className="font-semibold text-base">
                              {userProfile?.fullName}
                            </p>
                            <p className="text-xs text-white/80">
                              {userProfile?.email}
                            </p>
                            <p className="text-xs text-white/90 mt-1 bg-white/20 px-2 py-0.5 rounded-full inline-block">
                              {userProfile ? getRoleDisplay(userProfile.role) : ''}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Profile Info */}
                      <div className="p-4 space-y-3 border-b border-purple-100">
                        <div className="flex items-start gap-2 text-sm">
                          <User className="w-4 h-4 text-purple-500 mt-0.5" />
                          <div>
                            <p className="text-gray-500 text-xs">Số điện thoại</p>
                            <p className="text-gray-700 font-medium">
                              {userProfile?.phoneNumber || 'Chưa cập nhật'}
                            </p>
                          </div>
                        </div>
                        {userProfile?.venueOwnerProfile && (
                          <div className="flex items-start gap-2 text-sm">
                            <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center mt-0.5">
                              <span className="text-purple-600 text-xs font-bold">B</span>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Tên doanh nghiệp</p>
                              <p className="text-gray-700 font-medium">
                                {userProfile.venueOwnerProfile.businessName}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            setShowEditModal(true);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-purple-50 rounded-lg transition-all duration-200 font-medium text-sm"
                        >
                          <User className="w-4 h-4" />
                          <span>Chỉnh sửa hồ sơ</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div>{children}</div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {userProfile && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          userProfile={userProfile}
          onUpdate={handleProfileUpdated}
        />
      )}
    </div>
  );
}
