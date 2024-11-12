import CodeEditor from "./CodeEditor";

function CodePlayground() {
  return (
    <section className="grid grid-cols-3 gap-2 p-2">
      <CodeEditor lang="html" />
      <CodeEditor lang="css" />
      <CodeEditor lang="js" />
    </section>
  );
}

export default CodePlayground;
