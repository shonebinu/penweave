import { BriefcaseBusiness, Plus, Search } from "lucide-react";

import { useState } from "react";

import ActionButton from "./ActionButton.tsx";

export default function ProjectsHeader({
  createNewProject,
  creatingProject,
  searchQuery,
  setSearchQuery,
}: {
  createNewProject: () => void;
  creatingProject: boolean;
  searchQuery: string;
  setSearchQuery: (newQuery: string) => void;
}) {
  const [query, setQuery] = useState(searchQuery);
  return (
    <>
      <div className="mb-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <BriefcaseBusiness />
            Projects
          </h1>
          <p className="text-base-content/80 text-sm">
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
        <div className="join">
          <label className="input join-item">
            <Search size=".8rem" className="opacity-50" />
            <input
              type="search"
              required
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSearchQuery(query);
              }}
            />
          </label>
          <button
            className="btn join-item"
            onClick={() => setSearchQuery(query)}
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
}
