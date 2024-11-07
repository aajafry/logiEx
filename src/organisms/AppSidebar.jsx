import {
  SidebarFooterSection,
  SidebarHeaderSection,
  SidebarMenuSection,
} from "@/molecules";
import { Sidebar, SidebarSeparator } from "@/shadcn/components/ui/sidebar";

export const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeaderSection />
      <SidebarSeparator />
      <SidebarMenuSection />
      <SidebarSeparator />
      <SidebarFooterSection />
    </Sidebar>
  );
};
