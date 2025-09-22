import { Link, Outlet } from "react-router";

import PenweaveLogo from "@/assets/penweave.svg";

export function AuthLayout() {
  return (
    <>
      <header className="flex h-[var(--header-height)] items-center border-b px-6">
        <Link to="/" className="flex items-center">
          <img src={PenweaveLogo} alt="PenWeave Logo" className="h-10 w-10" />
          <h1 className="ml-1">PenWeave</h1>
        </Link>
      </header>
      <Outlet />
    </>
  );
}
