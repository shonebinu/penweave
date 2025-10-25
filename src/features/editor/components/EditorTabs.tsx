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

  return (
    <Tabs selectedTabClassName="bg-base-300" className="mb-1">
      <TabList className="flex h-10 w-full gap-1">
        <Tab className={tabButtonStyles}>
          <Code size="1rem" className="text-error mr-2" /> HTML
        </Tab>
        <Tab className={tabButtonStyles}>
          <PaintRoller size="1rem" className="text-info mr-2" /> CSS
        </Tab>
        <Tab className={tabButtonStyles}>
          <Parentheses size="1rem" className="text-warning mr-2" /> JS
        </Tab>
      </TabList>
      <TabPanel>
        <CodePanel
          value={htmlCode}
          extensions={[html()]}
          onChange={(val) => setHtmlCode(val)}
        />
      </TabPanel>
      <TabPanel>
        <CodePanel
          value={cssCode}
          extensions={[css()]}
          onChange={(val) => setCssCode(val)}
        />
      </TabPanel>
      <TabPanel>
        <CodePanel
          value={jsCode}
          extensions={[javascript()]}
          onChange={(val) => setJsCode(val)}
        />
      </TabPanel>
    </Tabs>
  );
}
