'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { SidebarConfig, IconName } from '@/types/sidebar';

import {
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

const getIcon = (icon?: IconName) => icon ? iconMap[icon] : null;

type Props = {
  sidebarConfig: SidebarConfig;
  isOpen: boolean;
  onToggle: () => void;
  getDashboardUrl: () => string;
};

export default function Sidebar({
  sidebarConfig,
  isOpen,
  onToggle,
  getDashboardUrl,
}: Props) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const isActive = (path: string, href: string) =>
    path === href || path.startsWith(href + '/');

  const toggleSection = (title: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  return (
    <aside className={`${isOpen ? 'w-56' : 'w-16'} bg-[#8093F1] flex flex-col`}>
      
      {/* Header */}
      <div className="p-2.5 border-b border-white/10 flex justify-between items-center">
        {isOpen && (
          <Link href={getDashboardUrl()} className="flex items-center gap-2 text-white">
            <Image src="/logo.png" alt="logo" width={28} height={28} />
            <span className="font-semibold">CoupleMood</span>
          </Link>
        )}

        <button onClick={onToggle} className="text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 overflow-y-auto">

        {/* tabs */}
        {sidebarConfig.tabs?.map(tab => {
          const Icon = getIcon(tab.icon);
          const active = isActive(pathname, tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                active ? 'bg-white text-[#8093F1]' : 'text-white'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {isOpen && tab.label}
            </Link>
          );
        })}

        {/* sections */}
        {sidebarConfig.sections?.map(section => {
          const SectionIcon = getIcon(section.icon);

          return (
            <div key={section.title} className="mt-3">
              
              {isOpen && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex justify-between text-white/80 text-sm"
                >
                  <div className="flex items-center gap-2">
                    {SectionIcon && <SectionIcon className="w-4 h-4" />}
                    {section.title}
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 transition ${
                      openSections.has(section.title) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              )}

              <div className={`${isOpen && !openSections.has(section.title) ? 'hidden' : ''}`}>
                {section.items.map(item => {
                  const Icon = getIcon(item.icon);
                  const active = isActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        active ? 'bg-white text-[#8093F1]' : 'text-white'
                      }`}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {isOpen && item.label}
                    </Link>
                  );
                })}
              </div>

            </div>
          );
        })}
      </nav>
    </aside>
  );
}