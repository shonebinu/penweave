import { useState } from "react";

import { CodeContext } from "./codeContext.ts";

const CODE_DEFAULT_VALUES = {
  html: `<button>Click Here</button>`,
  css: `button {
    padding: 6px 3px;
}`,
  js: `const button = document.querySelector("button");

button.addEventListener("click", () => window.alert("Hello world"));`,
};

export function CodeProvider({ children }: { children: React.ReactNode }) {
  const [htmlCode, setHtmlCode] = useState(CODE_DEFAULT_VALUES.html);
  const [cssCode, setCssCode] = useState(CODE_DEFAULT_VALUES.css);
  const [jsCode, setJsCode] = useState(CODE_DEFAULT_VALUES.js);

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
