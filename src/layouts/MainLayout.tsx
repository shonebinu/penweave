import { Outlet } from "react-router";

import Logo from "@/components/Logo.tsx";

import NavMenu from "./main-layout/NavMenu.tsx";
import UserMenu from "./main-layout/UserMenu.tsx";

export default function MainLayout() {
  return (
    <>
      <header className="flex h-[var(--header-height)] items-center justify-between border-b px-2 md:px-3">
        <Logo includeName={true} />
        <NavMenu />
        <UserMenu />
      </header>
      <main className="mx-28 py-5">
        <Outlet />
      </main>
    </>
  );
}
