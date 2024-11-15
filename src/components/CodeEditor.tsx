import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDarkInit } from "@uiw/codemirror-theme-vscode";
import CodeMirror from "@uiw/react-codemirror";

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

  return (
    <div className="p-2 border-2 rounded">
      <CodeMirror
        value={code}
        height="40vh"
        extensions={[selectedLang()]}
        onChange={onChangeCode}
        theme={vscodeDarkInit({
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
