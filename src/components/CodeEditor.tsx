import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { githubDarkInit, githubLightInit } from "@uiw/codemirror-theme-github";
import { useTheme } from "@/contexts/theme-provider";

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
  const selectedLang = langMap[lang];
  const { theme } = useTheme();

  const isDarkMode =
    theme === "dark"
      ? true
      : theme === "light"
      ? false
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

  const editorThemeInit = isDarkMode ? githubDarkInit : githubLightInit;

  return (
    <div className="p-2 border-2 rounded">
      <CodeMirror
        value={code}
        height="40vh"
        extensions={[selectedLang()]}
        onChange={onChangeCode}
        theme={editorThemeInit({
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
