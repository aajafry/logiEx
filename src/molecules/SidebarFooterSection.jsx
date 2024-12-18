// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/shadcn/components/ui/dropdown-menu";
// import {
//   SidebarFooter,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/shadcn/components/ui/sidebar";
// import { Ellipsis, User2 } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/shadcn/components/ui/avatar";
// import { useRole } from "@/contexts/RoleContext";
// import { logout } from "@/services";
// import { getUser } from "@/utilities";
// import { toast } from "react-toastify";

// function profileNavigation(allowedRole) {
//   switch (allowedRole) {
//     case "admin":
//       return "/admin/profile";
//     case "procurement-manager":
//       return "/procurement-manager/profile";
//     case "fleet-manager":
//       return "/fleet-manager/profile";
//     case "inventory-manager":
//       return "/inventory-manager/profile";
//     case "inventory-in-charge":
//       return "/inventory-in-charge/profile";
//     case "captain":
//       return "/captain/profile";
//     default:
//       return "";
//   }
// }

// export const SidebarFooterSection = () => {
//   const navigate = useNavigate();
//   const allowedRole = useRole();
//   const { id: userId, name: userName, avatar: userAvatar } = getUser();

//   const handleLogout = async (userId) => {
//     localStorage.removeItem("logiEx-token");
//     try {
//       const result = await logout(userId);
//       toast.success(result.message);
//       navigate("/authentication", { replace: true });
//     } catch (error) {
//       toast.error(error.message || "An error occurred while logging out");
//     }
//   };

//   return (
//     <SidebarFooter>
//       <SidebarMenu>
//         <SidebarMenuItem>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <SidebarMenuButton className="focus-visible:ring-0 -ml-2">
//                 <Avatar className="h-8 w-8 float-start">
//                   <AvatarImage src={`${userAvatar}`} />
//                   <AvatarFallback>
//                     <User2 className="h-full w-full" />
//                   </AvatarFallback>
//                 </Avatar>
//                 {userName || "Alice Smith"}
//                 <Ellipsis className="ml-auto" />
//               </SidebarMenuButton>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//               side="top"
//               className="w-[--radix-popper-anchor-width]"
//             >
//               <Link to={`${profileNavigation(allowedRole)}`}>
//                 <DropdownMenuItem className="cursor-pointer">
//                   <span>Profile</span>
//                 </DropdownMenuItem>
//               </Link>
//               <DropdownMenuItem className="cursor-pointer">
//                 <span onClick={() => handleLogout(userId)}>Sign out</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </SidebarMenuItem>
//       </SidebarMenu>
//     </SidebarFooter>
//   );
// };

import { Link, useNavigate } from "react-router-dom";
import { Ellipsis, User2 } from "lucide-react";
import { toast } from "react-toastify";

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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/components/ui/avatar";

import { useRole } from "@/contexts/RoleContext";
import { logout } from "@/services";
import { getUser } from "@/utilities";
import { cn } from "@/shadcn/lib/utils";

function profileNavigation(allowedRole) {
  switch (allowedRole) {
    case "admin":
      return "/admin/profile";
    case "procurement-manager":
      return "/procurement-manager/profile";
    case "fleet-manager":
      return "/fleet-manager/profile";
    case "inventory-manager":
      return "/inventory-manager/profile";
    case "inventory-in-charge":
      return "/inventory-in-charge/profile";
    case "captain":
      return "/captain/profile";
    default:
      return "";
  }
}

export const SidebarFooterSection = () => {
  const navigate = useNavigate();
  const allowedRole = useRole();
  const { id: userId, name: userName, avatar: userAvatar } = getUser();

  const handleLogout = async (userId) => {
    localStorage.removeItem("logiEx-token");
    try {
      const result = await logout(userId);
      toast.success(result.message);
      navigate("/authentication", { replace: true });
    } catch (error) {
      toast.error(error.message || "An error occurred while logging out");
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
                  <AvatarImage
                    src={userAvatar}
                    alt={userName || "User avatar"}
                  />
                  <AvatarFallback>
                    <User2 />
                  </AvatarFallback>
                </Avatar>
                <span className="flex-grow text-left">{userName || "N/A"}</span>
                <Ellipsis />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <Link to={`${profileNavigation(allowedRole)}`}>
                <DropdownMenuItem className="cursor-pointer">
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => handleLogout(userId)}
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
