import { useState } from "react";
import CodeEditor from "./CodeEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CodePlayground() {
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");

  const onHtmlChange = (value: string) => setHtmlCode(value);
  const onCssChange = (value: string) => setCssCode(value);
  const onJsChange = (value: string) => setJsCode(value);

  return (
    <Tabs defaultValue="html" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="html" className="font-bold">
          HTML
        </TabsTrigger>
        <TabsTrigger value="css" className="font-bold">
          CSS
        </TabsTrigger>
        <TabsTrigger value="js" className="font-bold">
          JS
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
