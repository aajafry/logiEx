import { Brand } from "@/atoms";
import {
  SidebarHeader,
  SidebarMenuButton,
} from "@/shadcn/components/ui/sidebar";
import { getUser } from "@/utilities";
import { Link } from "react-router-dom";

export const SidebarHeaderSection = () => {
  const { role: userUole } = getUser();

  return (
    <SidebarHeader>
      <SidebarMenuButton asChild>
        <Link to={`/${userUole}`}>
          <Brand />
        </Link>
      </SidebarMenuButton>
    </SidebarHeader>
  );
};
