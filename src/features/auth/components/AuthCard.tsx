import type { ReactNode } from "react";

import PenweaveLogo from "@/assets/penweave.svg";

export function AuthCard({
  title,
  message,
  children,
}: {
  title: string;
  message: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="card bg-base-100 m-5 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <img
          src={PenweaveLogo}
          alt="PenWeave Logo"
          className="mb-1 h-10 w-10"
        />
        <h2 className="text-xl font-bold">{title}</h2>
        <p>{message}</p>
        {children}
      </div>
    </div>
  );
}
