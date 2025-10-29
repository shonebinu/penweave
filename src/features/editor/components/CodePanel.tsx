import { EditorView } from "@codemirror/view";
import { nordInit } from "@uiw/codemirror-theme-nord";
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
    <CodeMirror
      value={value}
      extensions={[EditorView.lineWrapping, ...extensions]}
      onChange={onChange}
      theme={nordInit({ settings: { fontSize: "1rem" } })}
    />
  );
}
