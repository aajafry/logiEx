import { Brand } from "@/atoms";
import {
  SidebarHeader,
  SidebarMenuButton,
} from "@/shadcn/components/ui/sidebar";
import { getUser } from "@/utilities";
import { FC } from "react";
import { Link } from "react-router-dom";

export const SidebarHeaderSection: FC = () => {
  const user = getUser();
  const userRole = user?.role;

  return (
    <SidebarHeader>
      <SidebarMenuButton asChild>
        <Link to={`/${userRole}`}>
          <Brand />
        </Link>
      </SidebarMenuButton>
    </SidebarHeader>
  );
};
