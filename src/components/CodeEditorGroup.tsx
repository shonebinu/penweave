import { useState } from "react";
import CodeEditor from "./CodeEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CODE_DEFAULT_VALUES = {
  html: `<button>Click Here</button>`,
  css: `button {
    padding: 10px;
}`,
  js: `document.querySelector("button").onClick = () => window.alert("Welcome to Pen Weave");`,
};

function CodePlayground() {
  const [htmlCode, setHtmlCode] = useState(CODE_DEFAULT_VALUES.html);
  const [cssCode, setCssCode] = useState(CODE_DEFAULT_VALUES.css);
  const [jsCode, setJsCode] = useState(CODE_DEFAULT_VALUES.js);

  const onHtmlChange = (value: string) => setHtmlCode(value);
  const onCssChange = (value: string) => setCssCode(value);
  const onJsChange = (value: string) => setJsCode(value);

  return (
    <Tabs defaultValue="html" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="html" className="font-bold flex gap-1 items-center">
          <span>HTML</span>
          <svg className="w-5 aspect-square fill-red-500" viewBox="0 0 128 128">
            <path d="M9.032 2l10.005 112.093 44.896 12.401 45.02-12.387L118.968 2H9.032zm89.126 26.539l-.627 7.172L97.255 39H44.59l1.257 14h50.156l-.336 3.471-3.233 36.119-.238 2.27L64 102.609v.002l-.034.018-28.177-7.423L33.876 74h13.815l.979 10.919L63.957 89H64v-.546l15.355-3.875L80.959 67H33.261l-3.383-38.117L29.549 25h68.939l-.33 3.539z"></path>
          </svg>
        </TabsTrigger>
        <TabsTrigger value="css" className="font-bold flex gap-1 items-center">
          <span>CSS</span>
          <svg
            className="w-5 aspect-square fill-blue-500"
            viewBox="0 0 128 128"
          >
            <path d="M8.76 1l10.055 112.883 45.118 12.58 45.244-12.626L119.24 1H8.76zm89.591 25.862l-3.347 37.605.01.203-.014.467v-.004l-2.378 26.294-.262 2.336L64 101.607v.001l-.022.019-28.311-7.888L33.75 72h13.883l.985 11.054 15.386 4.17-.004.008v-.002l15.443-4.229L81.075 65H48.792l-.277-3.043-.631-7.129L47.553 51h34.749l1.264-14H30.64l-.277-3.041-.63-7.131L29.401 23h69.281l-.331 3.862z"></path>
          </svg>
        </TabsTrigger>
        <TabsTrigger value="js" className="font-bold flex gap-1 items-center">
          <span>JS</span>
          <svg
            className="w-5 aspect-square fill-yellow-500"
            viewBox="0 0 128 128"
          >
            <path d="M2 1v125h125V1H2zm66.119 106.513c-1.845 3.749-5.367 6.212-9.448 7.401-6.271 1.44-12.269.619-16.731-2.059-2.986-1.832-5.318-4.652-6.901-7.901l9.52-5.83c.083.035.333.487.667 1.071 1.214 2.034 2.261 3.474 4.319 4.485 2.022.69 6.461 1.131 8.175-2.427 1.047-1.81.714-7.628.714-14.065C58.433 78.073 58.48 68 58.48 58h11.709c0 11 .06 21.418 0 32.152.025 6.58.596 12.446-2.07 17.361zm48.574-3.308c-4.07 13.922-26.762 14.374-35.83 5.176-1.916-2.165-3.117-3.296-4.26-5.795 4.819-2.772 4.819-2.772 9.508-5.485 2.547 3.915 4.902 6.068 9.139 6.949 5.748.702 11.531-1.273 10.234-7.378-1.333-4.986-11.77-6.199-18.873-11.531-7.211-4.843-8.901-16.611-2.975-23.335 1.975-2.487 5.343-4.343 8.877-5.235l3.688-.477c7.081-.143 11.507 1.727 14.756 5.355.904.916 1.642 1.904 3.022 4.045-3.772 2.404-3.76 2.381-9.163 5.879-1.154-2.486-3.069-4.046-5.093-4.724-3.142-.952-7.104.083-7.926 3.403-.285 1.023-.226 1.975.227 3.665 1.273 2.903 5.545 4.165 9.377 5.926 11.031 4.474 14.756 9.271 15.672 14.981.882 4.916-.213 8.105-.38 8.581z"></path>
          </svg>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="html">
        <CodeEditor lang="html" code={htmlCode} onChangeCode={onHtmlChange} />
      </TabsContent>

      <TabsContent value="css">
        <CodeEditor lang="css" code={cssCode} onChangeCode={onCssChange} />
      </TabsContent>

      <TabsContent value="js">
        <CodeEditor lang="js" code={jsCode} onChangeCode={onJsChange} />
      </TabsContent>
    </Tabs>
  );
}

export default CodePlayground;