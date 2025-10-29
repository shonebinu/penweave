import { type FormEvent, useEffect, useRef, useState } from "react";

import LoadingDots from "@/shared/components/LoadingDots.tsx";

export default function EditTitleModal({
  oldTitle,
  isOpen,
  onClose,
  onSubmit,
}: {
  oldTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
}) {
  const [title, setTitle] = useState(oldTitle);
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
    await onSubmit(title);
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    setTitle(oldTitle);
    onClose();
  };

  return (
    <dialog className="modal" ref={dialogRef} onClose={handleClose}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">Edit Project Title</h3>
        <form className="pt-2" onSubmit={handleSubmit} id="edit-title">
          <fieldset className="fieldset">
            <label htmlFor="title" className="label text-sm">
              Project Title
            </label>
            <input
              id="title"
              type="text"
              className="input w-full"
              required
              placeholder="A title matching your project"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </fieldset>
        </form>
        <div className="modal-action">
          <button
            className="btn btn-primary"
            disabled={isSubmitting}
            form="edit-title"
          >
            {isSubmitting && <LoadingDots />}Submit
          </button>

          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
