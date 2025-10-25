import { type ReactNode, Suspense } from "react";

import LoadingScreen from "@/shared/pages/LoadingScreen.tsx";

export default function WithSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}
