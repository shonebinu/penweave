import { Bookmark, Earth, House, Rss } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth.ts";
import { doSignOut } from "@/services/firebase/auth.ts";

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
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate("/", { replace: true });
    await doSignOut();
  };

  return (
    <SidebarProvider>
      <Sidebar navigationItems={navigationItems} />
      <main className="w-full">
        <Header user={user} handleLogout={handleLogout} />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
