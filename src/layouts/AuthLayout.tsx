import { Outlet } from "react-router";

import LogoWithName from "@/shared/components/LogoWithName";

export default function AuthLayout() {
  return (
    <>
      <header className="flex h-[var(--header-height)] items-center border-b px-6">
        <LogoWithName />
      </header>
      <main className="flex min-h-[calc(100svh-var(--header-height))] items-center justify-center">
        <Outlet />
      </main>
    </>
  );
}
