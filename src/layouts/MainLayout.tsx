import {
  BriefcaseBusiness,
  Earth,
  LogOut,
  Menu,
  Settings,
  User2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";

import LoadingScreen from "@/components/LoadingScreen.tsx";
import Logo from "@/components/Logo.tsx";
import UserAvatar from "@/components/UserAvatar.tsx";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { fetchProfile } from "@/features/users/services/usersService.ts";
import type { Profile } from "@/types/profile.ts";
import { handleError } from "@/utils/error.ts";

export default function MainLayout() {
  const { session } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!session) return;

    const loadProfile = async () => {
      try {
        const profile = await fetchProfile(session?.user.id);
        setProfile(profile);
      } catch (err) {
        handleError(err, "Profile loading failed");
      }
    };

    loadProfile();
  }, [session]);

  const navItems = [
    { icon: BriefcaseBusiness, label: "Projects", href: "/projects" },
    { icon: Earth, label: "Explore", href: "/explore" },
    //  { icon: Rss, label: "Following", href: "/following" },
    //  { icon: Bookmark, label: "Bookmarks", href: "/bookmarks" },
  ];

  const menuItems = [
    { icon: User2, label: "Profile", href: "/users/" + session?.user.id },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: LogOut, label: "Logout", href: "/logout" },
  ];

  if (!profile) return <LoadingScreen />;

  return (
    <>
      <header className="grid h-[var(--header-height)] grid-cols-2 items-center border-b px-2 md:grid-cols-3 md:px-10">
        <div className="flex gap-2">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-square md:hidden"
            >
              <Menu size="1rem" />
            </div>
            <ul
              tabIndex={-1}
              className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {navItems.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link to={href}>
                    <Icon size="1rem" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Logo showNameOnLargeOnly />
        </div>

        <div className="mx-auto hidden md:block">
          <ul className="menu menu-horizontal gap-1 px-1">
            {navItems.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <NavLink
                  to={href}
                  className={({ isActive }) => (isActive ? "menu-active" : "")}
                >
                  <Icon size="1rem" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="dropdown dropdown-end ml-auto">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <UserAvatar
              avatarUrl={profile.avatar_url || undefined}
              displayName={profile.display_name}
            />
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 gap-1 p-2 shadow"
          >
            {menuItems.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <Link to={href}>
                  <Icon size="1rem" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <main className="mx-4 py-5 sm:mx-8 md:mx-16 lg:mx-32">
        <Outlet />
      </main>
    </>
  );
}
