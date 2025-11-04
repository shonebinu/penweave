import { formatDistanceToNowStrict } from "date-fns";
import { GitFork, Lock, Pencil, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import { Link } from "react-router";

import LoadingScreen from "@/components/LoadingScreen.tsx";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import type { Project } from "@/types/project.ts";
import { handleError } from "@/utils/error.ts";

import ProjectsHeader from "../components/ProjectsHeader.tsx";
import { fetchAllProjectsByUser } from "../services/projectService.ts";

export default function Projects() {
  /* use nuqs for filters, use pagination or infinite scroll | pagination by daisy ui */
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    if (!session?.user.id) return;

    const loadProjects = async () => {
      try {
        const projs = await fetchAllProjectsByUser(session.user.id);
        setProjects(projs);
      } catch (err) {
        handleError(err, "Project loading failed");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [session]);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <ProjectsHeader />
      <div className="grid grid-cols-4 gap-8">
        {!projects || projects.length === 0 ? (
          <div className="mx-auto">
            No projects yet. Create one to get started!
          </div>
        ) : (
          projects.map((project) => (
            <div className="card bg-base-100 shadow" key={project.id}>
              <figure className="bg-base-300 flex h-48 w-full items-center justify-center overflow-hidden">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt="Project thumbnail"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm">No Thumbnail</span>
                )}
              </figure>

              <div className="card-body pt-3">
                <div>
                  <Link to={"/projects/" + project.id}>
                    <h2 className="card-title line-clamp-1">{project.title}</h2>
                  </Link>
                  <Link
                    to="/to"
                    className="link text-base-content/60 flex items-center gap-1"
                  >
                    <GitFork size=".9rem" className="shrink-0" />
                    Forked from
                  </Link>
                </div>
                <div>
                  Updated{" "}
                  {formatDistanceToNowStrict(new Date(project.updated_at), {
                    addSuffix: true,
                  })}
                </div>
                <div className="card-actions justify-end">
                  <button className="btn btn-square btn-soft">
                    <Pencil size="1rem" />
                  </button>
                  <button className="btn btn-square btn-soft">
                    <Lock size="1rem" />
                  </button>
                  <button className="btn btn-square btn-soft">
                    <Trash2 size="1rem" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
