import { Link } from "react-router";

import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <>
      <header className="flex h-[var(--header-height)] items-center border-b px-6">
        <Logo includeName />
      </header>
      <main className="flex min-h-[calc(100svh-var(--header-height))] flex-col items-center justify-center px-2">
        <h1 className="font-mono text-8xl font-bold">404</h1>
        <p className="md:text-lg">
          We are sorry, the page you requested was not found.
        </p>
        <Link to="/" className="btn mt-3">
          Go Home
        </Link>
      </main>
    </>
  );
}
