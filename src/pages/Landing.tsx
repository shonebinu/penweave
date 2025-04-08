import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-white">
      <div className="text-center">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
          Penweave
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground md:text-xl">
          A minimal playground for HTML, CSS & JS. Build, share, and fork ideas.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild className="w-40">
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="outline" asChild className="w-40">
            <Link to="/signup">Signup</Link>
          </Button>
        </div>
      </div>

      <footer className="absolute bottom-4 text-sm text-muted-foreground opacity-70">
        <p>
          Already building?{" "}
          <Link to="/home" className="underline">
            Go to Home
          </Link>
        </p>
      </footer>
    </main>
  );
}
