import { Bookmark, Earth, House, Rss } from "lucide-react";

import { Outlet } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";
import { NotificationProvider } from "@/contexts/notification/NotificationProvider.tsx";

import Header from "./layout/Header.tsx";
import Sidebar from "./layout/Sidebar.tsx";

const navigationItems = [
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

export default function Layout() {
  return (
    <SidebarProvider>
      <NotificationProvider>
        <Sidebar navigationItems={navigationItems} />
        <main className="w-full">
          <Header />
          <Outlet />
        </main>
      </NotificationProvider>
    </SidebarProvider>
  );
}
