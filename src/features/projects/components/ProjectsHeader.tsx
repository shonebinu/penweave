import { BriefcaseBusiness, Plus, Search } from "lucide-react";

import ActionButton from "./ActionButton.tsx";

export default function ProjectsHeader({
  createNewProject,
  creatingProject,
}: {
  createNewProject: () => void;
  creatingProject: boolean;
}) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <BriefcaseBusiness />
            Projects
          </h1>
          <p className="text-base-content/60 text-sm">
            Create, manage and run your projects.
          </p>
        </div>
        <ActionButton
          onClick={createNewProject}
          loading={creatingProject}
          icon={Plus}
          className="btn btn-primary"
        >
          New Project
        </ActionButton>
      </div>
      <div className="mb-5">
        <label className="input">
          <Search size=".8rem" className="opacity-50" />
          <input type="search" required placeholder="Search" />
        </label>
      </div>

      <form className="mb-5 flex flex-wrap gap-1">
        <input
          className="btn"
          type="checkbox"
          name="visibility"
          aria-label="Public"
        />
        <input
          className="btn"
          type="checkbox"
          name="visibility"
          aria-label="Private"
        />

        <input
          className="btn"
          type="checkbox"
          name="type"
          aria-label="Forked"
        />
        <input
          className="btn"
          type="checkbox"
          name="type"
          aria-label="Originals"
        />

        <input className="btn btn-square" type="reset" value="×" />
      </form>
    </>
  );
}
