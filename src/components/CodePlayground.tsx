import { CodeProvider, useCode } from "../contexts/CodeContext";
import CodeEditorGroup from "./CodeEditorGroup";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Cloud, Settings } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

// TODO: penweave logo, filename and username
// TODO: font and editor theme select
// TODO: https://medium.com/@yuvrajkakkar1/best-2024-top-20-visual-studio-code-extensions-for-react-js-developers-f3bfde74d4e2

function CodePlaygroundContent() {
  const { htmlCode, cssCode, jsCode } = useCode();
  const handleSave = () => console.log({ htmlCode, cssCode, jsCode });

  return (
    <main>
      <nav className="flex justify-between items-center pt-2 px-2">
        <div>
          <strong>Pen Weave</strong>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Label htmlFor="font-select">Select an Editor font</Label>
              <Label htmlFor="editor-theme-select">
                Select an Editor Theme
              </Label>
            </PopoverContent>
          </Popover>
          <ModeToggle />
          <Button
            variant="outline"
            className="bg-green-500 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-700"
            onClick={handleSave}
          >
            <Cloud />
            Save
          </Button>
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
