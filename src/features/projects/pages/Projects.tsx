import { formatDistanceToNowStrict } from "date-fns";
import {
  BriefcaseBusiness,
  Ellipsis,
  GitFork,
  MessageSquare,
  Plus,
  Search,
  ThumbsUp,
} from "lucide-react";

import { type FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

import { useAuth } from "@/features/auth/useAuth.ts";
import { LoadingDots } from "@/shared/components/LoadingDots.tsx";
import { handleError } from "@/utils/error.ts";

import { createProject, fetchAllProjectsByUser } from "../projectsService.ts";

export function Projects() {
  /* use nuqs for filters, use pagination or infinite scroll */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  const { session } = useAuth();

  const userId = session?.user.id;

  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    setTitle("");
    setIsPrivate(false);
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchAllProjectsByUser(userId);

        setProjects(data);
      } catch (err) {
        handleError(err, "project loading failed");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [userId]);

  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const response = await createProject(
        userId,
        title,
        description,
        !isPrivate,
      );
      const projectId = response[0].id;

      toast.success("Project created succesfully. Opening...");

      navigate(`${projectId}/editor`);
    } catch (err) {
      handleError(err, "Project creation failed");
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <BriefcaseBusiness />
            My Works
          </h1>
          <p className="label text-sm">Create, manage and run your projects.</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          <Plus size="1rem" />
          New Project
        </button>
      </div>

      <div className="mb-5 flex justify-between gap-3">
        <label className="input">
          <Search size=".8rem" className="opacity-50" />
          <input type="search" required placeholder="Search" />
        </label>

        <select className="select w-40">
          <option disabled>Sort by</option>
          <option selected>Recently Updated</option>
          <option>Recently Created</option>
          <option>Most Forked</option>
          <option>Most Liked</option>
        </select>
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

      <div className="flex gap-5">
        {(!projects || projects.length === 0) && <div>No Projects found</div>}
        {projects.map((project) => (
          <div className="card bg-base-100 w-80 shadow-sm" key={project.title}>
            <figure>
              <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes"
              />
            </figure>

            <div className="card-body">
              <div className="flex justify-between">
                <h2 className="card-title truncate">{project.title}</h2>{" "}
                <span className="badge badge-soft badge-primary">
                  {project.is_public ? "Public" : "Private"}
                </span>
              </div>
              <p className="truncate">{project.description}</p>
              <span className="label">
                Updated{" "}
                {formatDistanceToNowStrict(new Date(project.updated_at), {
                  addSuffix: true,
                })}
              </span>
              <div className="flex justify-between text-sm">
                <div className="badge badge-sm badge-soft p-3">
                  <ThumbsUp size="1rem" />
                  123
                </div>
                <div className="badge badge-sm badge-soft p-3">
                  <MessageSquare size="1rem" />
                  123
                </div>
                <div className="badge badge-sm badge-soft p-3">
                  <GitFork size="1rem" />
                  123
                </div>
              </div>
              <div className="card-actions mt-1 justify-end">
                <Link to={`/projects/${project.id}`}>
                  <button className="btn">View</button>
                </Link>
                <Link to={`/projects/${project.id}/editor`}>
                  <button className="btn">Open Editor</button>
                </Link>
                <div className="dropdown">
                  <div tabIndex={0} role="button" className="btn btn-square">
                    <Ellipsis />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                  >
                    <li>
                      <a>Edit Details</a>
                    </li>
                    <li>
                      <a>Duplicate</a>
                    </li>
                    <li>
                      <a>Delete</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Create a new project</h3>
          <form
            className="pt-2"
            onSubmit={handleCreateProject}
            id="create-project"
          >
            <fieldset className="fieldset">
              <label htmlFor="title" className="label text-sm">
                Title<span className="text-error">*</span>
              </label>
              <input
                id="title"
                type="text"
                className="input w-full"
                required
                placeholder="Project title"
                maxLength={255}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="description" className="label text-sm">
                Description
              </label>
              <textarea
                id="description"
                className="textarea w-full"
                placeholder="Project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <label htmlFor="visibility" className="label text-sm">
                Visibility
              </label>
              <select
                id="visibility"
                className="select w-full"
                required
                value={isPrivate ? "Private" : "Public"}
                onChange={(e) => setIsPrivate(e.target.value === "Private")}
              >
                <option>Public</option>
                <option>Private</option>
              </select>
            </fieldset>
          </form>
          <div className="modal-action">
            <button
              className="btn btn-primary"
              disabled={loading}
              form="create-project"
            >
              {loading && <LoadingDots />}
              {loading ? "Creating" : "Create Project"}
            </button>

            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
