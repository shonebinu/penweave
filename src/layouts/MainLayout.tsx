import { BriefcaseBusiness, Earth, LogOut } from "lucide-react";

import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";

import Logo from "@/components/Logo.tsx";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import { fetchProfile } from "@/features/users/services/usersService.ts";
import type { Profile } from "@/types/profile.ts";
import { handleError } from "@/utils/error.ts";

const navItems = [
  { icon: BriefcaseBusiness, label: "My Works", href: "/projects" },
  { icon: Earth, label: "Explore", href: "/explore" },
];

const menuItems = [{ icon: LogOut, label: "Logout", href: "/logout" }];

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

  const userInitials =
    profile?.display_name
      ?.split(" ")
      .map((word: string) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "N/A";
  return (
    <>
      <header className="flex h-[var(--header-height)] items-center justify-between border-b px-2 md:px-3">
        <Logo includeName />

        <div className="flex-none">
          <ul className="menu menu-horizontal gap-1 px-1">
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

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  referrerPolicy="no-referrer"
                  alt="user avatar"
                />
              ) : (
                <div className="bg-neutral text-neutral-content flex h-full items-center justify-center">
                  <span>{userInitials}</span>
                </div>
              )}
            </div>
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
                  {label === "Notifications" && (
                    <div className="badge badge-primary badge-xs">New</div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <main className="mx-28 py-5">
        <Outlet />
      </main>
    </>
  );
}
