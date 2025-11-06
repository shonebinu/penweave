import { Fragment } from "react";

import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { nordInit } from "@uiw/codemirror-theme-nord";
import CodeMirror from "@uiw/react-codemirror";

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
      langExtension: html(),
    },
    {
      label: "CSS",
      value: cssCode,
      setValue: setCssCode,
      langExtension: css(),
    },
    {
      label: "JS",
      value: jsCode,
      setValue: setJsCode,
      langExtension: javascript(),
    },
  ];

  return (
    <div className="tabs tabs-border h-full">
      {tabs.map(({ label, value, setValue, langExtension }) => (
        <Fragment key={label}>
          <input
            type="radio"
            name="editor-tabs"
            className="tab flex-1 font-semibold"
            aria-label={label}
            defaultChecked={label === "HTML"}
          />
          <div className="tab-content">
            <div className="h-full">
              <CodeMirror
                value={value}
                extensions={[EditorView.lineWrapping, langExtension]}
                onChange={(val) => setValue(val)}
                theme={nordInit({
                  settings: {
                    fontSize: "1rem",
                    fontFamily: "var(--default-mono-font-family)",
                  },
                })}
              />
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
