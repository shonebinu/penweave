import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { githubDarkInit } from "@uiw/codemirror-theme-github";

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
    // TODO: option to set font and colorscheme
    <div className="p-2 border-2 rounded">
      <CodeMirror
        value={code}
        height="40vh"
        extensions={[selectedLang()]}
        onChange={onChangeCode}
        theme={githubDarkInit({
          settings: {
            fontFamily: "JetBrains Mono",
            fontSize: ".95rem",
          },
        })}
      />
    </div>
  );
}

export default CodeEditor;
