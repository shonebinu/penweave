import {
  BellDot,
  Bookmark,
  BriefcaseBusiness,
  Code,
  LayoutDashboard,
  Rss,
} from "lucide-react";

import { Outlet } from "react-router-dom";

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

import PenWeaveIcon from "./PenWeaveIcon.tsx";
import { ThemeToggle } from "./ThemeToggle.tsx";

const items = [
  {
    title: "New Playground",
    url: "#",
    icon: Code,
  },
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "My Works",
    url: "#",
    icon: BriefcaseBusiness,
  },
  {
    title: "Following",
    url: "#",
    icon: Rss,
  },
  {
    title: "Bookmarks",
    url: "#",
    icon: Bookmark,
  },
];

// TODO: NEW logo or logo styling
// TODO: Avatar image should be user's or first name and last name first character
// TODO: Avatar dropdown > settings, logout
// TODO: New playground at the under of bookmarks.. a different group
// TODO: Add theme toggle... Make a custom shadcn / tailwind theme for my page, both dark and white mode, edit the css vars in shadcn theme
export default function Layout() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenuButton size={"lg"}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <PenWeaveIcon />
            </div>
            <span className="text-lg font-semibold">PenWeave</span>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size={"lg"}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="w-full">
        <header className="flex h-16 w-full shrink-0 items-center gap-2 border-b px-2">
          <SidebarTrigger />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <BellDot />
          <ThemeToggle />
        </header>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
