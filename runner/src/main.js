import { snapdom } from "@zumer/snapdom";

const MESSAGE_ORIGIN = import.meta.env.VITE_MESSAGE_ORIGIN;

const iframe = document.querySelector("iframe");

const respond = (source, origin, type, payload) =>
  source.postMessage({ type, payload }, origin);

window.addEventListener("message", ({ origin, data, source }) => {
  if (origin !== MESSAGE_ORIGIN) {
    return;
  }

  const { type, payload } = data;

  if (type === "render") {
    try {
      const { html, css, js } = payload;
      iframe.srcdoc = `<!DOCTYPE html>
                              <html>
                                <head>
                                  <style>${css}</style>
                                </head>
                                <body>
                                  ${html}
                                  <script>${js}<\/script>
                                </body>
                              </html>`;

      respond(source, origin, "render:response", {
        status: "success",
        message: "Rendered",
      });
    } catch (err) {
      respond(source, origin, "render:response", {
        status: "error",
        message: err.message || "Render failed",
      });
    }
  }

  if (type === "screenshot") {
    snapdom
      .toWebp(iframe.contentDocument.body)
      .then((img) => {
        respond(source, origin, "screenshot:response", {
          status: "success",
          dataUrl: img.src,
        });
      })
      .catch((err) =>
        respond(source, origin, "screenshot:response", {
          status: "error",
          message: err.message || "Screenshot failed",
        }),
      );
  }
});
