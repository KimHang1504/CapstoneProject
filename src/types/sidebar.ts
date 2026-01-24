/**
 * Types cho Sidebar Navigation
 */

export type SidebarTab = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type SidebarSection = {
  title: string;
  items: SidebarTab[];
  icon?: React.ComponentType<{ className?: string }>;
};

export type SidebarConfig = {
  tabs: SidebarTab[];
    sections?: SidebarSection[];
};
