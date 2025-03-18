import {
  css as beautifyCSS,
  html as beautifyHTML,
  js as beautifyJS,
} from "js-beautify";
import {
  Cloud,
  ExternalLink,
  House,
  Loader2,
  LoaderCircle,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { useDebounce } from "use-debounce";

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AvatarIcon from "@/components/AvatarIcon.tsx";
import PenWeaveIcon from "@/components/PenWeaveIcon";
import RenamePopover from "@/components/RenamePopover.tsx";
import { ThemeToggle } from "@/components/ThemeToggle.tsx";
import CodeEditorGroup from "@/components/playground/CodeEditorGroup";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CodeProvider } from "@/contexts/code/CodeProvider.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import { useCode } from "@/hooks/useCode.ts";
import {
  forkPlayground,
  getPlayground,
  updatePlayground,
} from "@/services/firebase/firestore.ts";

function PlaygroundContent() {
  const { playgroundId } = useParams();
  const { user } = useAuth();
  const [playgroundTitle, setPlaygroundTitle] = useState("");
  const { htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode } =
    useCode();
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState({ id: "", name: "", photoURL: "" });
  const [isPublic, setIsPublic] = useState(false);
  const navigate = useNavigate();
  const handleSaveRef = useRef<(() => Promise<void>) | null>(null);

  const [debouncedHtml] = useDebounce(htmlCode, 3000);
  const [debouncedCss] = useDebounce(cssCode, 3000);
  const [debouncedJs] = useDebounce(jsCode, 3000);

  const isAuthor = user?.uid === author.id;

  useEffect(() => {
    const fetchPlayground = async () => {
      if (!playgroundId) {
        navigate("/home");
        return;
      }

      try {
        const playground = await getPlayground(playgroundId);

        setHtmlCode(playground.html);
        setCssCode(playground.css);
        setJsCode(playground.js);
        setPlaygroundTitle(playground.title);
        setAuthor({
          id: playground.userId,
          name: playground.userName,
          photoURL: playground.userPhotoURL ?? "",
        });
        setIsPublic(playground.isPublic);
        setLoading(false);
      } catch (error) {
        navigate("/home", {
          replace: true,
          state: {
            error: "Failed to load playground",
            details:
              error instanceof Error
                ? error.message
                : "An unexpected error occured",
          },
        });
      }
    };

    fetchPlayground();
  }, [playgroundId, navigate, setHtmlCode, setCssCode, setJsCode]);

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

  const handleFork = async () => {
    try {
      const forkedId = await forkPlayground(playgroundId || "");
      toast.success("Playground forked successfully!", {
        action: {
          label: "Open Fork",
          onClick: () => navigate(`/playground/${forkedId}`),
        },
      });
    } catch (error) {
      toast.error("Failed to fork playground", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occured",
      });
    }
  };

  const handlePrettify = () => {
    setHtmlCode(beautifyHTML(htmlCode, { indent_size: 2 }));
    setCssCode(beautifyCSS(cssCode, { indent_size: 2 }));
    setJsCode(beautifyJS(jsCode, { indent_size: 2 }));
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
    if (playgroundId && user?.uid === author.id) {
      handleSave();
    }
  }, [
    debouncedHtml,
    debouncedCss,
    debouncedJs,
    playgroundId,
    handleSave,
    author,
    user,
  ]);

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
      <nav className="flex items-center justify-between px-4 pt-2">
        <div className="flex items-center gap-5">
          <PenWeaveIcon />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/home")}
            >
              <House />
            </Button>
            {author.id && (
              <Button
                variant="ghost"
                onClick={() => window.open(`/user/${author.id}`, "_blank")}
              >
                <div className="flex items-center gap-2">
                  <AvatarIcon
                    photoURL={author.photoURL}
                    userName={author.name}
                    className="h-7 w-7"
                  />
                  <Badge variant="secondary">Author</Badge>
                  <ExternalLink />
                </div>
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <h1 className="truncate text-base font-semibold">
            {playgroundTitle}
          </h1>
          {isAuthor && (
            <RenamePopover
              initialTitle={playgroundTitle}
              onRename={(newTitle) =>
                handleRename(playgroundId || "", newTitle)
              }
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthor ? (
            <>
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
                <span>{isSaving ? "Saving..." : "Save"}</span>
              </Button>
            </>
          ) : isPublic ? (
            <Button variant="outline" onClick={handleFork}>
              Fork Playground
            </Button>
          ) : null}
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
