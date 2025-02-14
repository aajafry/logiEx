import { useRole } from "@/contexts/RoleContext";
import { logout } from "@/services";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shadcn/components/ui/sidebar";
import { cn } from "@/shadcn/lib/utils";
import { getUser } from "@/utilities";
import { Ellipsis, User2 } from "lucide-react";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define role types for type safety
type RoleType =
  | "admin"
  | "procurement-manager"
  | "fleet-manager"
  | "inventory-manager"
  | "inventory-in-charge"
  | "captain";

// Role-based profile navigation paths
const rolePaths: Record<RoleType, string> = {
  admin: "/admin/profile",
  "procurement-manager": "/procurement-manager/profile",
  "fleet-manager": "/fleet-manager/profile",
  "inventory-manager": "/inventory-manager/profile",
  "inventory-in-charge": "/inventory-in-charge/profile",
  captain: "/captain/profile",
};

// Function to get profile path based on role
const getProfilePath = (role: RoleType) => rolePaths[role] || "/";

export const SidebarFooterSection: FC = () => {
  const navigate = useNavigate();
  const allowedRole = useRole() as RoleType;
  const user = getUser();

  const userId = user?.id;
  const userName = user?.name;
  const userAvatar = user?.avatar;

  const handleLogout = async () => {
    if (!userId) return;

    localStorage.removeItem("logiEx-token");
    try {
      const result = (await logout(userId)) as { message: string };
      toast.success(result.message);
      navigate("/authentication", { replace: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "An error occurred while logging out");
      } else {
        toast.error("An error occurred while logging out");
      }
    }
  };

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                className={cn(
                  "justify-start items-center gap-2 pl-0",
                  "group-data-[collapsible=icon]:!p-0"
                )}
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback>
                    <User2 />
                  </AvatarFallback>
                </Avatar>
                <span className="flex-grow text-left">{userName}</span>
                <Ellipsis />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[var(--radix-popper-anchor-width)]"
            >
              <Link to={getProfilePath(allowedRole)}>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
