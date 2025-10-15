import { Outlet } from "react-router";

import { LogoWithName } from "@/shared/components/LogoWithName.tsx";

import { NavMenu } from "./main-layout/NavMenu.tsx";
import { UserMenu } from "./main-layout/UserMenu.tsx";

export function MainLayout() {
  return (
    <>
      <header className="flex h-[var(--header-height)] items-center justify-between border-b px-6">
        <LogoWithName />
        <NavMenu />
        <UserMenu />
      </header>
      <main className="mx-28 py-5">
        <Outlet />
      </main>
    </>
  );
}
