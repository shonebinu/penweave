import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { githubDark } from "@uiw/codemirror-theme-github";
import { EditorView } from "@uiw/react-codemirror";

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

  const FontFamilyTheme = EditorView.theme({
    ".cm-content": {
      fontFamily: "JetBrains Mono, monospace",
      fontSize: ".9rem",
    },
  });

  return (
    // TODO: Create a shadcn theme for the codemirror
    // TODO: should be aware of shadcn current theme context
    <CodeMirror
      value={code}
      height="40vh"
      extensions={[selectedLang(), FontFamilyTheme]}
      onChange={onChangeCode}
      theme={githubDark}
    />
  );
}

export default CodeEditor;
