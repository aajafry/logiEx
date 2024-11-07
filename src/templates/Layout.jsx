/* eslint-disable react/prop-types */
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shadcn/components/ui/sidebar";
import { AppSidebar } from "@/organisms/index.js";
import { ModeToggle } from "@/molecules/index.js";
import { Separator } from "@/shadcn/components/ui/separator.jsx";

function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex items-center justify-between p-2 gap-2">
          <SidebarTrigger />
          <ModeToggle />
        </div>
        <Separator className="bg-sidebar-border" />
        {children}
      </main>
    </SidebarProvider>
  );
}

export { Layout };
