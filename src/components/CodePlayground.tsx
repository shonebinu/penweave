import {
  css as beautifyCSS,
  html as beautifyHTML,
  js as beautifyJS,
} from "js-beautify";
import { Cloud, Loader2 } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { CodeProvider, useCode } from "../contexts/CodeContext";
import CodeEditorGroup from "./CodeEditorGroup";
import PenWeaveIcon from "./PenWeaveIcon";

function CodePlaygroundContent() {
  const { htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode } =
    useCode();
  const [isSaving, setIsSaving] = useState(false);
  const handleSaveRef = useRef<(() => Promise<void>) | null>(null);

  const handlePrettify = () => {
    setHtmlCode(beautifyHTML(htmlCode));
    setCssCode(beautifyCSS(cssCode));
    setJsCode(beautifyJS(jsCode));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log({ htmlCode, cssCode, jsCode });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsSaving(false);
    }
  };

  handleSaveRef.current = handleSave;

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (handleSaveRef.current) {
        handleSaveRef.current();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, []);

  const combinedCode = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          ${cssCode}
        </style>
        <script>
          document.addEventListener("DOMContentLoaded", () => {
            ${jsCode}
          });
        </script> 
      </head>
      <body>
        ${htmlCode}
      </body>
    </html>
  `;

  return (
    <main>
      <nav className="flex justify-between items-center pt-2 px-2">
        <div className="flex gap-2 items-center">
          <PenWeaveIcon />
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            className="bg-green-500 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-700"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <Cloud />}
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={handlePrettify}>
            Prettify
          </Button>
          <Button variant="secondary">Sign In</Button>
        </div>
      </nav>
      <Separator className="my-2" />
      <CodeEditorGroup />
      <iframe
        srcDoc={combinedCode}
        title="Code Preview"
        className="w-full h-screen border-2 bg-white"
        sandbox="allow-scripts allow-modals"
      />
    </main>
  );
}

function CodePlayground() {
  return (
    <CodeProvider>
      <CodePlaygroundContent />
    </CodeProvider>
  );
}

export default CodePlayground;
