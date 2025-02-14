import {
  SidebarFooterSection,
  SidebarHeaderSection,
  SidebarMenuSection,
} from "@/molecules";
import { Sidebar, SidebarSeparator } from "@/shadcn/components/ui/sidebar";
import { FC } from "react";

export const AppSidebar: FC = () => {
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
