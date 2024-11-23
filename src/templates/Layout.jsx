/* eslint-disable react/prop-types */
import {
  SidebarInset,
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
      <SidebarInset className="overflow-hidden">
        <main className="flex-1">
          <div className="flex items-center justify-between p-2 gap-2">
            <SidebarTrigger />
            <ModeToggle />
          </div>
          <Separator className="bg-sidebar-border" />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export { Layout };
