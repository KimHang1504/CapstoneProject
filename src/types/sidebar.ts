/**
 * Types cho Sidebar Navigation
 */

export type IconName =
  | 'LayoutDashboard'
  | 'Building2'
  | 'Users'
  | 'Megaphone'
  | 'Sparkles'
  | 'Trophy'
  | 'Tag'
  | 'Flag'
  | 'Settings'
  | 'FolderTree'
  | 'Wallet'
  | 'CreditCard'
  | 'Package'
  | 'ClipboardList'
  | 'Calendar'
  | 'MessageSquare'
  | 'BarChart'
  | 'BarChart3'
  | 'FileText'
  | 'MapPin'
  | 'TicketPercent';

export type SidebarTab = {
  label: string;
  href: string;
  icon?: IconName;
};

export type SidebarSection = {
  title: string;
  items: SidebarTab[];
  icon?: IconName;
};

export type SidebarConfig = {
  tabs: SidebarTab[];
  sections?: SidebarSection[];
};
