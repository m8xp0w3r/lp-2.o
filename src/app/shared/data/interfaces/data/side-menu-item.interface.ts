export interface SideMenuItem {
  title: string;
  url: string;
  icon: string;
  isAdminItem?: boolean;
  isPreGameItem?: boolean;
  isBaseItem?: boolean;
  order: number;
}
