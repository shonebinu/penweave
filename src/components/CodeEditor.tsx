import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { githubDark } from "@uiw/codemirror-theme-github";
import { EditorView } from "@uiw/react-codemirror";
import { Card, CardTitle } from "@/components/ui/card";

const langMap = {
  html,
  css,
  js: javascript,
};

type LangType = keyof typeof langMap;

interface CodeEditorProps {
  lang: string;
}

function CodeEditor({ lang }: CodeEditorProps) {
  const [codeValue, setCodeValue] = useState("");

  const selectedLang = langMap[lang as LangType] || javascript;

  const FontFamilyTheme = EditorView.theme({
    ".cm-content": {
      fontFamily: "JetBrains Mono, monospace",
      fontSize: ".9rem",
    },
  });

  return (
    <Card className="p-2 rounded-sm">
      <CardTitle className="pb-5">{lang.toUpperCase()}</CardTitle>
      <CodeMirror
        value={codeValue}
        height="40vh"
        extensions={[selectedLang(), FontFamilyTheme]}
        onChange={(value) => setCodeValue(value)}
        theme={githubDark}
      />
    </Card>
  );
}

export default CodeEditor;
