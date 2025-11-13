import { useState } from "react";
import { useSearchParams } from "react-router";

import LoadingScreen from "@/components/LoadingScreen.tsx";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";

import DeleteProjectModal from "../components/DeleteProjectModal.tsx";
import EditTitleModal from "../components/EditTitleModal.tsx";
import Pagination from "../components/Pagination.tsx";
import ProjectsCard from "../components/ProjectsCard.tsx";
import ProjectsHeader from "../components/ProjectsHeader.tsx";
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
      <ProjectsHeader
        createNewProject={createNewProject}
        creatingProject={creatingProject}
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
