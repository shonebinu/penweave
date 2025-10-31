import { type FormEvent, useEffect, useRef, useState } from "react";

import LoadingDots from "@/shared/components/LoadingDots.tsx";

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, isPrivate: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(title, description, isPrivate);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setIsPrivate(false);
    onClose();
  };

  return (
    <dialog className="modal" ref={dialogRef} onClose={handleClose}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">Create a new project</h3>
        <form className="pt-2" onSubmit={handleSubmit} id="create-project">
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
            disabled={isSubmitting}
            form="create-project"
          >
            {isSubmitting && <LoadingDots />}
            {isSubmitting ? "Creating" : "Create Project"}
          </button>

          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
