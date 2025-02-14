import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/shadcn/components/ui/sidebar";
import {
  adminMenus,
  procurementManagerMenus,
  fleetManagerMenus,
  inventoryManagerMenus,
  inventoryInChargeMenus,
  CaptainMenus,
} from "@/config";
import { NavLink } from "react-router-dom";
import { useRole } from "@/contexts";
import { MenuType } from "@/config/menus";
import { FC } from "react";

export const SidebarMenuSection: FC = () => {
  const allowedRole = useRole();
  let menus: MenuType[];

  switch (allowedRole) {
    case "admin":
      menus = adminMenus;
      break;
    case "procurement-manager":
      menus = procurementManagerMenus;
      break;
    case "fleet-manager":
      menus = fleetManagerMenus;
      break;
    case "inventory-manager":
      menus = inventoryManagerMenus;
      break;
    case "inventory-in-charge":
      menus = inventoryInChargeMenus;
      break;
    case "captain":
      menus = CaptainMenus;
      break;
    default:
      menus = [];
  }

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {menus.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
