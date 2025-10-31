import { useDebouncedCallback } from "use-debounce";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const IFRAME_SRC = import.meta.env.VITE_CODE_RUNNER_URL;
const SCREENSHOT_TIMEOUT = 10000;
const getOrigin = (url: string) => new URL(url).origin;

export function useProjectPreview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const screenshotPromiseRef = useRef<{
    resolve: (dataUrl: string) => void;
    reject: (error: Error) => void;
  } | null>(null);

  const sendToIframe = useDebouncedCallback(
    (html: string, css: string, js: string) => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: "render",
          payload: { html, css, js },
        },
        IFRAME_SRC,
      );
    },
    500,
  );

  const captureScreenshot = async (): Promise<string> => {
    if (screenshotPromiseRef.current) {
      throw new Error("Screenshot already in progress");
    }

    return new Promise((resolve, reject) => {
      screenshotPromiseRef.current = { resolve, reject };

      const timeoutId = setTimeout(() => {
        screenshotPromiseRef.current = null;
        reject(new Error("Screenshot request timed out"));
      }, SCREENSHOT_TIMEOUT);

      const wrappedResolve = (dataUrl: string) => {
        clearTimeout(timeoutId);
        screenshotPromiseRef.current = null;
        resolve(dataUrl);
      };

      const wrappedReject = (error: Error) => {
        clearTimeout(timeoutId);
        screenshotPromiseRef.current = null;
        reject(error);
      };

      screenshotPromiseRef.current = {
        resolve: wrappedResolve,
        reject: wrappedReject,
      };

      iframeRef.current?.contentWindow?.postMessage(
        { type: "screenshot" },
        IFRAME_SRC,
      );
    });
  };

  useEffect(() => {
    const handleMessage = ({ origin, data }: MessageEvent) => {
      if (origin !== getOrigin(IFRAME_SRC)) return;

      const { type, payload } = data;

      if (type === "render:response" && payload.status === "error") {
        console.error(payload.message);
        toast.error("Rendering failed: " + payload.message);
      }

      if (type === "screenshot:response") {
        const pending = screenshotPromiseRef.current;
        if (!pending) return;

        if (payload.status === "error") {
          console.error(payload.message);
          pending.reject(new Error(payload.message));
        } else if (payload.status === "success") {
          pending.resolve(payload.dataUrl);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return {
    iframeRef,
    iframeSrc: IFRAME_SRC,
    sendToIframe,
    captureScreenshot,
  };
}
