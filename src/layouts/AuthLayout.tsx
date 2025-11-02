import { Outlet } from "react-router";

import Logo from "@/shared/components/Logo.tsx";

export default function AuthLayout() {
  return (
    <>
      <header className="flex h-[var(--header-height)] items-center border-b px-6">
        <Logo includeName={true} />
      </header>
      <main className="flex min-h-[calc(100svh-var(--header-height))] items-center justify-center px-2">
        <Outlet />
      </main>
    </>
  );
}
