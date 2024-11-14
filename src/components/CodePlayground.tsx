import { CodeProvider, useCode } from "../contexts/CodeContext";
import CodeEditorGroup from "./CodeEditorGroup";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Cloud } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import {
  html as beautifyHTML,
  css as beautifyCSS,
  js as beautifyJS,
} from "js-beautify";

function CodePlaygroundContent() {
  const { htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode } =
    useCode();

  const handlePrettify = () => {
    setHtmlCode(beautifyHTML(htmlCode));
    setCssCode(beautifyCSS(cssCode));
    setJsCode(beautifyJS(jsCode));
  };
  const handleSave = () => console.log({ htmlCode, cssCode, jsCode });

  return (
    <main>
      <nav className="flex justify-between items-center pt-2 px-2">
        <div>
          <strong>Pen Weave</strong>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrettify}>
            Prettify
          </Button>
          <Button
            variant="outline"
            className="bg-green-500 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-700"
            onClick={handleSave}
          >
            <Cloud />
            Save
          </Button>
          <ModeToggle />
          <Button>Sign Up</Button>
          <Button variant="secondary">Log In</Button>
        </div>
      </nav>
      <Separator className="my-2" />
      <CodeEditorGroup />
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
