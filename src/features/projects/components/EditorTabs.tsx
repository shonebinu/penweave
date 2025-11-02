import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";

import CodePanel from "./CodePanel.tsx";

export default function EditorTabs({
  htmlCode,
  setHtmlCode,
  cssCode,
  setCssCode,
  jsCode,
  setJsCode,
}: {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  setHtmlCode: (value: string) => void;
  setCssCode: (value: string) => void;
  setJsCode: (value: string) => void;
}) {
  const tabs = [
    {
      label: "HTML",
      value: htmlCode,
      setValue: setHtmlCode,
      extensions: [html()],
    },
    {
      label: "CSS",
      value: cssCode,
      setValue: setCssCode,
      extensions: [css()],
    },
    {
      label: "JS",
      value: jsCode,
      setValue: setJsCode,
      extensions: [javascript()],
    },
  ];

  return (
    <div className="tabs tabs-border">
      {tabs.map(({ label, value, setValue, extensions }) => (
        <>
          <input
            type="radio"
            name="editor-tabs"
            className="tab flex-1 font-medium"
            aria-label={label}
            defaultChecked={label === "HTML"}
          />
          <div className="tab-content h-[40svh]">
            <CodePanel
              value={value}
              extensions={extensions}
              onChange={(val) => setValue(val)}
            />
          </div>
        </>
      ))}
    </div>
  );
}
