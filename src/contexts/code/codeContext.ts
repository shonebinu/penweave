import { createContext } from "react";

type CodeStateType = {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  setHtmlCode: (code: string) => void;
  setCssCode: (code: string) => void;
  setJsCode: (code: string) => void;
};

// We don't pass the default value here. The undefined here is a fallback if no provider is present.
export const CodeContext = createContext<CodeStateType | undefined>(undefined);
