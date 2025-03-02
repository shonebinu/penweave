import { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function LinkButton({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Button asChild variant="link">
      <Link to={to}>{children}</Link>
    </Button>
  );
}
