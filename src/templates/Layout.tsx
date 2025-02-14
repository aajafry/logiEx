import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shadcn/components/ui/sidebar";
import { AppSidebar } from "@/organisms/index";
import { ModeToggle } from "@/molecules/index";
import { Separator } from "@/shadcn/components/ui/separator";
import { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
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
