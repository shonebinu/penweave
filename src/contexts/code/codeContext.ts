import { createContext } from "react";

type CodeStateType = {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  setHtmlCode: (code: string) => void;
  setCssCode: (code: string) => void;
  setJsCode: (code: string) => void;
};

export const CodeContext = createContext<CodeStateType | undefined>(undefined);
