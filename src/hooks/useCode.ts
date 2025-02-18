import { useContext } from "react";

import { CodeContext } from "@/contexts/code/codeContext.ts";

export function useCode() {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error("useCode must be used within an CodeProvider");
  }
  return context;
}
