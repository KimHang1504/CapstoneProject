'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarConfig } from '@/types/sidebar';
import { useState } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Bell,
  User,
  Download,
  Filter
} from 'lucide-react';

type ManagementLayoutProps = {
  children: React.ReactNode;
  sidebarConfig: SidebarConfig;
  title?: string;
};

export default function ManagementLayout({
  children,
  sidebarConfig,
  title,
}: ManagementLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="min-h-screen flex ">
      {/* Sidebar */}
      <aside
        className={`
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          bg-[#8093F1] flex flex-col transition-all duration-300 ease-in-out
          border-r border-purple-100
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-purple-100 bg-[#8093F1]">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white font-bold">
                  CM
                </div>
                <span className="font-semibold text-white text-sm">CoupleMood</span>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-purple-100 rounded-lg transition-all duration-200 text-white"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {/* Dashboard */}
          <div className="mb-6">
            <Link
              href="/admin"
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${pathname === '/admin'
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                }
              `}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              </div>
              {isSidebarOpen && <span className="font-medium">Dashboard</span>}
            </Link>
          </div>

          {/* Sections */}
          {sidebarConfig.sections?.map((section) => (
            <div key={section.title} className="mb-4">
              {isSidebarOpen && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-2 font-semibold text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {section.icon && <section.icon className="w-5 h-5" />}
                  <span>{section.title}</span>
                  </div>
                  
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${expandedSections.includes(section.title) ? 'rotate-180' : ''
                      }`}
                  />
                </button>
              )}

              <div className={`space-y-1 ${isSidebarOpen && !expandedSections.includes(section.title)
                  ? 'hidden'
                  : ''
                }`}>
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                   const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                        group relative overflow-hidden ml-7
                        ${isActive
                          ? 'bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 shadow-sm'
                          : 'text-white hover:bg-purple-50 hover:text-purple-600 hover:translate-x-1'
                        }
                      `}
                      title={!isSidebarOpen ? item.label : undefined}
                    >
                      {Icon && (
                        <Icon className={`w-5 h-5 transition-transform duration-200 ${!isActive ? 'group-hover:scale-110' : ''
                          }`} />
                      )}
                      {isSidebarOpen && (
                        <span className="font-medium text-sm">{item.label}</span>
                      )}
                      {isActive && (
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-l"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Fallback for tabs without sections */}
          {sidebarConfig.tabs && (
            <div className="space-y-1">
              {sidebarConfig.tabs.map((tab) => {
                const isActive = pathname === tab.href;
                const Icon = tab.icon;

                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mb-4
                      group relative overflow-hidden
                      ${isActive
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-sm'
                        : 'text-white hover:bg-purple-50 hover:text-purple-600 hover:translate-x-1'
                      }
                    `}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    {isSidebarOpen && <span className="font-medium text-sm">{tab.label}</span>}
                  </Link>
                );
              })}
            </div>
          )}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
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
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent bg-purple-50/50 text-sm w-64 transition-all"
                  />
                </div>

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
                <div className="flex items-center gap-3 pl-4 border-l border-purple-200">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">John Wick</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-lg transition-all duration-200">
                    JW
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
