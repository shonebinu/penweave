import { createContext, useContext, useState } from "react";

const CODE_DEFAULT_VALUES = {
  html: `<button>Click Here</button>`,
  css: `button {
    padding: 6px 3px;
}`,
  js: `const button = document.querySelector("button");
button.addEventListener("click", () => window.alert("Hello world"));`,
};

type CodeState = {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  setHtmlCode: (code: string) => void;
  setCssCode: (code: string) => void;
  setJsCode: (code: string) => void;
};

export const CodeContext = createContext<CodeState | undefined>(undefined);

export function CodeProvider({ children }: { children: React.ReactNode }) {
  const [htmlCode, setHtmlCode] = useState(CODE_DEFAULT_VALUES.html);
  const [cssCode, setCssCode] = useState(CODE_DEFAULT_VALUES.css);
  const [jsCode, setJsCode] = useState(CODE_DEFAULT_VALUES.js);

  return (
    <CodeContext.Provider
      value={{
        htmlCode,
        cssCode,
        jsCode,
        setHtmlCode,
        setCssCode,
        setJsCode,
      }}
    >
      {children}
    </CodeContext.Provider>
  );
}

export function useCode() {
  const context = useContext(CodeContext);
  if (context === undefined) {
    throw new Error("useCode must be used within a CodeProvider");
  }
  return context;
}
