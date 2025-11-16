import { BriefcaseBusiness, Plus } from "lucide-react";

import { useState } from "react";
import { useSearchParams } from "react-router";

import LoadingScreen from "@/components/LoadingScreen.tsx";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";

import ActionButton from "../components/ActionButton.tsx";
import DeleteProjectModal from "../components/DeleteProjectModal.tsx";
import EditTitleModal from "../components/EditTitleModal.tsx";
import HeaderTitle from "../components/HeaderTitle.tsx";
import Pagination from "../components/Pagination.tsx";
import ProjectsCard from "../components/ProjectsCard.tsx";
import SearchBar from "../components/SearchBar.tsx";
import { useModal } from "../hooks/useModal.ts";
import { useProjects } from "../hooks/useProjects.ts";
import type { ProjectWithForkAndLikeInfo } from "../types/types.ts";

export default function Projects() {
  const { session } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 8;

  const searchQuery = searchParams.get("search") || "";

  const {
    projects,
    loading,
    toggleVisibility,
    editTitle,
    deleteProject,
    titleEditingId,
    togglingVisibilityId,
    deletingId,
    creatingProject,
    createNewProject,
    totalProjectsCount,
  } = useProjects(session?.user.id, page, pageSize, searchQuery);

  const [activeProject, setActiveProject] =
    useState<ProjectWithForkAndLikeInfo | null>(null); // track which project is being edited or deleted

  const editTitleModal = useModal();
  const deleteProjectModal = useModal();

  if (loading) return <LoadingScreen />;

  const totalPages = Math.ceil(totalProjectsCount / pageSize);

  return (
    <>
      <div className="mb-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <HeaderTitle
          icon={<BriefcaseBusiness />}
          title="Projects"
          description="Create, manage and run your projects."
        />
        <ActionButton
          onClick={createNewProject}
          loading={creatingProject}
          icon={Plus}
          className="btn btn-primary"
        >
          New Project
        </ActionButton>
      </div>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={(newQuery) => {
          setSearchParams({ search: newQuery });
        }}
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {!projects || projects.length === 0 ? (
          <div className="col-span-full">
            No projects yet. Create one to get started!
          </div>
        ) : (
          projects.map((project) => (
            <ProjectsCard
              key={project.id}
              project={project}
              onEditTitle={() => {
                setActiveProject(project);
                editTitleModal.open();
              }}
              onDeleteProject={() => {
                setActiveProject(project);
                deleteProjectModal.open();
              }}
              toggleVisibility={async () => {
                await toggleVisibility(project.id, project.is_private);
              }}
              togglingVisibility={togglingVisibilityId === project.id}
              titleEditing={titleEditingId === project.id}
              deleting={deletingId === project.id}
            />
          ))
        )}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={(newPage) => {
          setSearchParams({ page: String(newPage) });
        }}
      />
      {activeProject && (
        <>
          <EditTitleModal
            oldTitle={activeProject.title}
            isOpen={editTitleModal.isOpen}
            onClose={() => {
              setActiveProject(null);
              editTitleModal.close();
            }}
            onSubmit={async (newTitle) => {
              await editTitle(activeProject.id, newTitle);
              editTitleModal.close();
            }}
          />
          <DeleteProjectModal
            isOpen={deleteProjectModal.isOpen}
            onClose={() => {
              setActiveProject(null);
              deleteProjectModal.close();
            }}
            onSubmit={async () => {
              await deleteProject(activeProject.id);
              deleteProjectModal.close();
            }}
          />
        </>
      )}
    </>
  );
}
