import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDarkInit, vscodeLightInit } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";

import { useTheme } from "@/hooks/useTheme.ts";

const langMap = {
  html: html,
  css: css,
  js: javascript,
};

type LangType = keyof typeof langMap;

type CodeEditorProps = {
  lang: LangType;
  code: string;
  onChangeCode: (value: string) => void;
};

function CodeEditor({ lang, code, onChangeCode }: CodeEditorProps) {
  const { theme } = useTheme();
  const selectedLang = langMap[lang];

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  const currentTheme = theme === "system" ? systemTheme : theme;

  const editorTheme =
    currentTheme === "dark" ? vscodeDarkInit : vscodeLightInit;

  return (
    <div className="h-[40vh] rounded border-2 p-2">
      <CodeMirror
        value={code}
        extensions={[selectedLang()]}
        onChange={onChangeCode}
        theme={editorTheme({
          settings: {
            fontFamily: "monospace",
            fontSize: ".95rem",
          },
        })}
      />
    </div>
  );
}

export default CodeEditor;
