import {
  BellDot,
  Bookmark,
  Code,
  Earth,
  House,
  LogOut,
  Rss,
  Settings,
} from "lucide-react";

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth.ts";
import { doSignOut } from "@/services/firebase/auth.ts";

import PenWeaveIcon from "./PenWeaveIcon.tsx";
import { ThemeToggle } from "./ThemeToggle.tsx";
import { Button } from "./ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu.tsx";
import { Separator } from "./ui/separator.tsx";

const items = [
  {
    title: "Home",
    url: "/home",
    icon: House,
  },
  {
    title: "Explore",
    url: "/explore",
    icon: Earth,
  },
  {
    title: "Following",
    url: "/following",
    icon: Rss,
  },
  {
    title: "Bookmarks",
    url: "/bookmarks",
    icon: Bookmark,
  },
];

// TODO: New logo or logo styling
// TODO: when clicking on new playground. instead of showing loading page. show the editor .. then load in the bg
// TODO: Make a custom theme for my webpage. starry bg??
// TODO: GIve option to change profile pic.. now tell them to add url, later we could add cloudflare r2 or something
export default function Layout() {
  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const getAvatarFallback = (name: string | null | undefined) =>
    name
      ? name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";

  const handleSignOut = async () => {
    navigate("/", { replace: true });
    await doSignOut();
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="ml-1 mt-5 flex items-center gap-2">
            <PenWeaveIcon />
            <span className="text-base font-semibold">PenWeave</span>
          </div>
          <Separator className="mx-auto mb-2 mt-4 w-[90%]" />
        </SidebarHeader>
        <SidebarMenuButton
          size={"lg"}
          className="pw-button mx-auto w-[90%] justify-center"
          asChild
        >
          <Link to={"/playground/new"}>
            <Code />
            <span>New Playground</span>
          </Link>
        </SidebarMenuButton>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      size={"lg"}
                      isActive={location.pathname === item.url}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="w-full">
        <header className="flex h-16 w-full shrink-0 items-center justify-between gap-2 border-b px-2 md:pr-6">
          <div className="flex items-center">
            <SidebarTrigger />
            <Separator orientation="vertical" className="ml-2 h-6" />
          </div>
          <div className="flex items-center gap-3">
            <Button variant={"outline"} size={"icon"}>
              <BellDot />
            </Button>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="hover:cursor-pointer">
                  {user?.photoURL ? (
                    <AvatarImage
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                    />
                  ) : (
                    <AvatarFallback>
                      {getAvatarFallback(user?.displayName)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
