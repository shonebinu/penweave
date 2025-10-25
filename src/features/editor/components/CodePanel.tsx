import { EditorView } from "@codemirror/view";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import CodeMirror, { type Extension } from "@uiw/react-codemirror";

export default function CodePanel({
  value,
  onChange,
  extensions,
}: {
  value: string;
  onChange: (value: string) => void;
  extensions: Extension[];
}) {
  return (
    <div className="h-[40svh]">
      <CodeMirror
        value={value}
        extensions={[EditorView.lineWrapping, ...extensions]}
        onChange={onChange}
        theme={vscodeDark}
      />
    </div>
  );
}
