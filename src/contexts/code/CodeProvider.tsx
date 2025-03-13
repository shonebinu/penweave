import { useState } from "react";

import { CodeContext } from "./codeContext.ts";

export function CodeProvider({ children }: { children: React.ReactNode }) {
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");

  const value = {
    htmlCode,
    cssCode,
    jsCode,
    setHtmlCode,
    setCssCode,
    setJsCode,
  };

  return <CodeContext.Provider value={value}>{children}</CodeContext.Provider>;
}
