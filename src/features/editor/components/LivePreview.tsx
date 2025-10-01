export function LivePreview({
  htmlCode,
  cssCode,
  jsCode,
}: {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}) {
  const combinedCode = `<!DOCTYPE html>
    <html>
      <head>
        <style>${cssCode}</style>
        <script>
          document.addEventListener("DOMContentLoaded", () => {
            ${jsCode}
          });
        </script>
      </head>
      <body>${htmlCode}</body>
    </html>`;

  return <iframe srcDoc={combinedCode} className="min-h-screen w-full" />;
}
