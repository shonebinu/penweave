import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { sublimeInit } from "@uiw/codemirror-theme-sublime";

const langMap = {
  html,
  css,
  js: javascript,
};

type LangType = keyof typeof langMap;

interface CodeEditorProps {
  lang: string;
  code: string;
  onChangeCode: (value: string) => void;
}

function CodeEditor({ lang, code, onChangeCode }: CodeEditorProps) {
  const selectedLang = langMap[lang as LangType] || javascript;

  return (
    // TODO: option to set font and colorscheme
    <div className="p-2 border-2 rounded">
      <CodeMirror
        value={code}
        height="40vh"
        extensions={[selectedLang()]}
        onChange={onChangeCode}
        theme={sublimeInit({
          settings: {
            fontFamily: "JetBrains Mono",
            fontSize: ".9rem",
          },
        })}
      />
    </div>
  );
}

export default CodeEditor;
