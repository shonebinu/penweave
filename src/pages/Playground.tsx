import {
  css as beautifyCSS,
  html as beautifyHTML,
  js as beautifyJS,
} from "js-beautify";
import {
  Bookmark,
  GitFork,
  House,
  Loader2,
  LoaderCircle,
  LogIn,
  Save,
} from "lucide-react";
import numbro from "numbro";
import { Toaster, toast } from "sonner";
import { useDebounce } from "use-debounce";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
  toggleBookmark,
  updatePlayground,
} from "@/services/firebase/firestore.ts";
import { PlaygroundMeta } from "@/types/firestore.ts";

function PlaygroundContent() {
  const { playgroundId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleSaveRef = useRef<(() => Promise<void>) | null>(null);

  const [playground, setPlayground] = useState<PlaygroundMeta | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isForking, setIsForking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [loading, setLoading] = useState(true);

  const { htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode } =
    useCode();
  const [debouncedHtml] = useDebounce(htmlCode, 3000);
  const [debouncedCss] = useDebounce(cssCode, 3000);
  const [debouncedJs] = useDebounce(jsCode, 3000);

  const isAuthor = user?.uid === playground?.userId;
  const isSignedIn = !!user;

  useEffect(() => {
    const fetchPlayground = async () => {
      if (!playgroundId) {
        navigate("/home");
        return;
      }

      try {
        const fetchedPlayground = await getPlayground(playgroundId);
        setPlayground(fetchedPlayground);
        setHtmlCode(fetchedPlayground.html);
        setCssCode(fetchedPlayground.css);
        setJsCode(fetchedPlayground.js);
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
      setPlayground((prev) => (prev ? { ...prev, title: newTitle } : prev));
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

  const handleToggleBookmark = async () => {
    if (!user) {
      toast.error("You need to sign in to bookmark playgrounds.");
      return;
    }

    setIsBookmarking(true);
    try {
      const newState = await toggleBookmark(
        playground?.id || "",
        playground?.isBookmarked || false,
      );

      setPlayground((prev) =>
        prev
          ? {
              ...prev,
              isBookmarked: newState,
              bookmarkCount: newState
                ? prev.bookmarkCount + 1
                : prev.bookmarkCount - 1,
            }
          : prev,
      );

      toast.success(
        `Successfully ${newState ? "added" : "removed"} the bookmark!`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle bookmark.");
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleFork = async () => {
    setIsForking(true);
    try {
      const forkedId = await forkPlayground(playgroundId || "");

      setPlayground((prev) =>
        prev ? { ...prev, forkCount: prev.forkCount + 1 } : prev,
      );

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
    } finally {
      setIsForking(false);
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
      if (!user || !isAuthor) return;

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
    [htmlCode, cssCode, jsCode, playgroundId, user, isAuthor],
  );

  handleSaveRef.current = handleSave;

  useEffect(() => {
    if (playgroundId && isAuthor) {
      handleSave();
    }
  }, [
    debouncedHtml,
    debouncedCss,
    debouncedJs,
    playgroundId,
    isAuthor,
    handleSave,
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
            {isSignedIn && (
              <Button variant="outline" size="icon" asChild>
                <Link to="/home">
                  <House />
                </Link>
              </Button>
            )}
            {playground?.userId && (
              <Button variant="ghost" asChild>
                <Link to={`/user/${playground.userId}`}>
                  <div className="flex items-center gap-2">
                    <AvatarIcon
                      photoURL={playground.userPhotoURL}
                      userName={playground.userName}
                      className="h-7 w-7"
                    />
                    <Badge variant="secondary">Author</Badge>
                  </div>
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <div className="flex flex-col items-center justify-center">
            <h1 className="truncate text-base font-semibold">
              {playground?.title}
            </h1>
            <div className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
              <div className="flex items-center gap-1">
                <GitFork size={12} />
                <span>
                  {numbro(playground?.forkCount).format({
                    average: true,
                    mantissa: 1,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Bookmark size={12} />
                <span>
                  {numbro(playground?.bookmarkCount).format({
                    average: true,
                    mantissa: 1,
                  })}
                </span>
              </div>
            </div>
          </div>
          {isAuthor && (
            <RenamePopover
              initialTitle={playground?.title || ""}
              onRename={(newTitle) =>
                handleRename(playgroundId || "", newTitle)
              }
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isSignedIn && !isAuthor && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleBookmark}
              disabled={isBookmarking}
            >
              {isBookmarking ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Bookmark
                  className={playground?.isBookmarked ? "text-green-500" : ""}
                />
              )}
            </Button>
          )}
          {isSignedIn ? (
            isAuthor ? (
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
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                  <span>{isSaving ? "Saving..." : "Save"}</span>
                </Button>
              </>
            ) : playground?.isPublic ? (
              <Button
                className="pw-button w-[7rem]"
                onClick={handleFork}
                disabled={isForking}
              >
                {isForking ? <Loader2 className="animate-spin" /> : <GitFork />}
                <span>{isForking ? "Forking..." : "Fork"}</span>
              </Button>
            ) : null
          ) : (
            <Button className="pw-button" onClick={() => navigate("/login")}>
              <LogIn />
              Sign in to Fork
            </Button>
          )}
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
