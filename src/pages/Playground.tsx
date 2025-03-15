import {
  css as beautifyCSS,
  html as beautifyHTML,
  js as beautifyJS,
} from "js-beautify";
import { Cloud, Loader2 } from "lucide-react";
import { Toaster, toast } from "sonner";

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import PenWeaveIcon from "@/components/PenWeaveIcon";
import CodeEditorGroup from "@/components/playground/CodeEditorGroup";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CodeProvider } from "@/contexts/code/CodeProvider.tsx";
import { useCode } from "@/hooks/useCode.ts";
import {
  getPlayground,
  updatePlayground,
} from "@/services/firebase/firestore.ts";

function PlaygroundContent() {
  const { playgroundId } = useParams();
  const { htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode } =
    useCode();
  const [isSaving, setIsSaving] = useState(false);
  const handleSaveRef = useRef<(() => Promise<void>) | null>(null);

  // TODO: Some kind of feedback when code loading from firestore
  useEffect(() => {
    const fetchPlayground = async () => {
      if (!playgroundId) return;

      try {
        const playground = await getPlayground(playgroundId);
        if (playground) {
          setHtmlCode(playground.html);
          setCssCode(playground.css);
          setJsCode(playground.js);
        }
      } catch (error) {
        toast.error("Failed to load playground");
        console.error(error);
      }
    };

    fetchPlayground();
  }, [playgroundId, setHtmlCode, setCssCode, setJsCode]);

  const handlePrettify = () => {
    // TODO: Save when prettify
    setHtmlCode(beautifyHTML(htmlCode));
    setCssCode(beautifyCSS(cssCode));
    setJsCode(beautifyJS(jsCode));
  };

  const handleSave = async () => {
    if (!playgroundId) return;

    setIsSaving(true);
    try {
      await updatePlayground(playgroundId, {
        html: htmlCode,
        css: cssCode,
        js: jsCode,
      });
      toast.success("Playground saved!");
    } catch (error) {
      toast.error("Failed to save playground");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  // TODO: Only saved toast if clicked manually. or toast is not required

  handleSaveRef.current = handleSave;

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (handleSaveRef.current) {
        handleSaveRef.current();
      }
    }, 30000);

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
  // TODO: USE lucide icon for html, css, js

  // TODO: OPtion to change theme, font, etc, add cdn links
  // TODO: author name and icon in playground. if public and not owned. only clone button

  return (
    <main>
      <nav className="flex items-center justify-between px-2 pt-2">
        <div className="flex items-center gap-2">
          <PenWeaveIcon />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrettify}>
            Prettify
          </Button>
          <Button
            variant="outline"
            className="pw-button"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <Cloud />}
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </nav>
      <Separator className="my-2" />
      <CodeEditorGroup />
      <iframe
        srcDoc={combinedCode}
        title="Code Preview"
        className="h-screen w-full border-2 bg-white"
        sandbox="allow-scripts allow-modals"
      />
      <Toaster richColors />
    </main>
  );
}

export default function Playground() {
  return (
    <CodeProvider>
      <PlaygroundContent />
    </CodeProvider>
  );
}
