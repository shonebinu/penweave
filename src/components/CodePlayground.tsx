import CodeEditorGroup from "./CodeEditorGroup";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Cloud } from "lucide-react";

function CodePlayground() {
  return (
    <main>
      <nav className="flex justify-between items-center pt-2 px-2">
        <div>
          <strong>Pen Weave</strong>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-green-500 hover:bg-green-400 dark:bg-green-600 dark:hover:bg-green-700"
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

export default CodePlayground;
