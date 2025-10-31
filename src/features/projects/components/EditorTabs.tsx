import { Code, PaintRoller, Parentheses } from "lucide-react";

import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

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
  const tabButtonStyles =
    "text-base-content hover:bg-base-200 flex w-full items-center justify-center rounded-md font-medium outline-none hover:cursor-pointer";

  const tabs = [
    {
      label: "HTML",
      icon: <Code size="1rem" className="text-error mr-2" />,
      value: htmlCode,
      setValue: setHtmlCode,
      extensions: [html()],
    },
    {
      label: "CSS",
      icon: <PaintRoller size="1rem" className="text-info mr-2" />,
      value: cssCode,
      setValue: setCssCode,
      extensions: [css()],
    },
    {
      label: "JS",
      icon: <Parentheses size="1rem" className="text-warning mr-2" />,
      value: jsCode,
      setValue: setJsCode,
      extensions: [javascript()],
    },
  ];

  return (
    <Tabs selectedTabClassName="bg-base-300">
      <TabList className="flex h-10 w-full gap-1">
        {tabs.map(({ label, icon }) => (
          <Tab key={label} className={tabButtonStyles}>
            {icon} {label}
          </Tab>
        ))}
      </TabList>
      {tabs.map(({ label, value, setValue, extensions }) => (
        <TabPanel key={label}>
          <div className="h-[40svh]">
            <CodePanel
              value={value}
              extensions={extensions}
              onChange={(val) => setValue(val)}
            />
          </div>
        </TabPanel>
      ))}
    </Tabs>
  );
}
