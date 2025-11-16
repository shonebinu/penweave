import type { ReactNode } from "react";

export default function HeaderTitle({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        {icon}
        {title}
      </h1>
      <p className="text-base-content/80 text-sm">{description}</p>
    </div>
  );
}
