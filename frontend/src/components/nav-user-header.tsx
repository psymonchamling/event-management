import {
  IconClipboardList,
  IconDashboard,
  IconListDetails,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useLogout from "@/hooks/useLogout.hook";
import { useAuth } from "@/context/auth-context/auth-context";
import { extractInitialsConcise } from "@/lib/name-initial";
import { useNavigate } from "@tanstack/react-router";

const dropdownMenus = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "My Events",
    url: "/dashboard/event-list",
    icon: IconListDetails,
  },
  {
    title: "My Registration",
    url: "/dashboard/registration",
    icon: IconClipboardList,
  },
  {
    title: "Settings",
    url: "/dashboard/setting",
    icon: IconSettings,
  },
];

export function NavUser() {
  const { logout } = useLogout();
  const { userData } = useAuth();

  const navigate = useNavigate();

  const { name: userName = "", email: userEmail = "" } = userData?.user || {};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex">
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            {/* <AvatarImage src={user?.avatar} alt={user?.name} /> */}
            <AvatarFallback className="rounded-lg">
              {extractInitialsConcise(userName)}
            </AvatarFallback>
          </Avatar>
          {/* <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {user.email}
            </span>
          </div>
          <IconDotsVertical className="ml-auto size-4" /> */}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        // side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
              <AvatarFallback className="rounded-lg">
                {extractInitialsConcise(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{userName}</span>
              <span className="text-muted-foreground truncate text-xs">
                {userEmail}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {dropdownMenus.map((item) => (
            <DropdownMenuItem onClick={() => navigate({ to: item.url })}>
              <item.icon />
              {item.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          <IconLogout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
