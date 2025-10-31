import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import LoadingScreen from "@/shared/pages/LoadingScreen.tsx";

import { useModal } from "../../../shared/hooks/useModal.ts";
import CreateProjectModal from "../components/CreateProjectModal.tsx";
import ProjectsCard from "../components/ProjectsCard.tsx";
import ProjectsFilter from "../components/ProjectsFilter.tsx";
import ProjectsHeader from "../components/ProjectsHeader.tsx";
import { useProjects } from "../hooks/useProjects.ts";

export default function Projects() {
  /* use nuqs for filters, use pagination or infinite scroll */
  const { session } = useAuth();

  const { loading, projects, createNewProject } = useProjects(session?.user.id);

  const createModal = useModal();

  if (loading) return <LoadingScreen />;

  return (
    <>
      <ProjectsHeader onNewProject={createModal.open} />
      <ProjectsFilter />

      <div className="grid grid-cols-4 gap-8">
        {!projects || projects.length === 0 ? (
          <div className="mx-auto">
            No projects yet. Create one to get started!
          </div>
        ) : (
          projects.map((project) => (
            <ProjectsCard key={project.id} project={project} />
          ))
        )}
      </div>

      <CreateProjectModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        onSubmit={createNewProject}
      />
    </>
  );
}
