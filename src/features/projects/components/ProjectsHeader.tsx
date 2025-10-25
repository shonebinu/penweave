import { BriefcaseBusiness, Plus } from "lucide-react";

export default function ProjectsHeader({
  onNewProject,
}: {
  onNewProject: () => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <BriefcaseBusiness />
          My Works
        </h1>
        <p className="label text-sm">Create, manage and run your projects.</p>
      </div>
      <button className="btn btn-primary" onClick={onNewProject}>
        <Plus size="1rem" />
        New Project
      </button>
    </div>
  );
}
