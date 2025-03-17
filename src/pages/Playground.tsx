import {
  css as beautifyCSS,
  html as beautifyHTML,
  js as beautifyJS,
} from "js-beautify";
import { ArrowLeft, Cloud, Loader2, LoaderCircle } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useDebounce } from "use-debounce";

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PenWeaveIcon from "@/components/PenWeaveIcon";
import RenamePopover from "@/components/RenamePopover.tsx";
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
  const [playgroundTitle, setPlaygroundTitle] = useState("");
  const { htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode } =
    useCode();
  const [isSaving, setIsSaving] = useState(false);
  const handleSaveRef = useRef<(() => Promise<void>) | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [debouncedHtml] = useDebounce(htmlCode, 3000);
  const [debouncedCss] = useDebounce(cssCode, 3000);
  const [debouncedJs] = useDebounce(jsCode, 3000);

  useEffect(() => {
    const fetchPlayground = async () => {
      if (!playgroundId) {
        navigate("/home", { replace: true });
        return;
      }

      try {
        const playground = await getPlayground(playgroundId);
        if (playground) {
          setHtmlCode(playground.html);
          setCssCode(playground.css);
          setJsCode(playground.js);
          setPlaygroundTitle(playground.title);
        }
      } catch (error) {
        toast.error("Failed to load playground");
        console.error(error);
        navigate("/home", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchPlayground();
  }, [playgroundId, setHtmlCode, setCssCode, setJsCode, navigate]);

  const handleRename = async (id: string, newTitle: string) => {
    try {
      if (newTitle.length === 0) throw new Error("Title shouldn't be empty.");
      await updatePlayground(id, { title: newTitle });
      setPlaygroundTitle(newTitle);
      toast.success("Playground renamed successfully");
    } catch (error) {
      toast.error("Failed to rename playground", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  const handlePrettify = () => {
    setHtmlCode(beautifyHTML(htmlCode));
    setCssCode(beautifyCSS(cssCode));
    setJsCode(beautifyJS(jsCode));
    handleSave();
  };

  const handleSave = useCallback(
    async (isManual = false) => {
      if (!playgroundId) return;

      setIsSaving(true);
      try {
        await updatePlayground(playgroundId, {
          html: htmlCode,
          css: cssCode,
          js: jsCode,
        });
        if (isManual) toast.success("Playground saved!");
      } catch (error) {
        toast.error("Failed to save playground");
        console.error(error);
      } finally {
        setIsSaving(false);
      }
    },
    [playgroundId, htmlCode, cssCode, jsCode],
  );

  handleSaveRef.current = handleSave;

  useEffect(() => {
    if (playgroundId) {
      handleSave();
    }
  }, [debouncedHtml, debouncedCss, debouncedJs, playgroundId, handleSave]);

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

  return loading ? (
    <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
      <LoaderCircle className="animate-spin" />
      <p className="ml-2">Loading your playground...</p>
    </div>
  ) : (
    <main>
      <nav className="flex items-center justify-between px-2 pt-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <PenWeaveIcon />
        </div>

        <div className="flex items-center justify-center gap-2">
          <h1 className="truncate text-base font-semibold">
            {playgroundTitle}
          </h1>
          <RenamePopover
            initialTitle={playgroundTitle}
            onRename={(newTitle) => handleRename(playgroundId || "", newTitle)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrettify}>
            Prettify
          </Button>
          <Button
            variant="outline"
            className="pw-button w-[7rem]"
            onClick={() => handleSave(true)}
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
