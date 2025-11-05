import { useState } from "react";

import LoadingScreen from "@/components/LoadingScreen.tsx";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";

import DeleteProjectModal from "../components/DeleteProjectModal.tsx";
import EditTitleModal from "../components/EditTitleModal.tsx";
import ProjectCard from "../components/ProjectCard.tsx";
import ProjectsHeader from "../components/ProjectsHeader.tsx";
import { useModal } from "../hooks/useModal.ts";
import { useProjects } from "../hooks/useProjects.ts";
import type { ProjectWithForkInfo } from "../types/types.ts";

export default function Projects() {
  /* use nuqs for filters, use pagination or infinite scroll | pagination by daisy ui */
  const { session } = useAuth();
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
  } = useProjects(session?.user.id);

  const [activeProject, setActiveProject] =
    useState<ProjectWithForkInfo | null>(null); // track which project is being edited or deleted

  const editTitleModal = useModal();
  const deleteProjectModal = useModal();

  if (loading) return <LoadingScreen />;

  return (
    <>
      <ProjectsHeader
        createNewProject={createNewProject}
        creatingProject={creatingProject}
      />
      <div className="grid grid-cols-4 gap-8">
        {!projects || projects.length === 0 ? (
          <div className="col-span-full">
            No projects yet. Create one to get started!
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard
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
