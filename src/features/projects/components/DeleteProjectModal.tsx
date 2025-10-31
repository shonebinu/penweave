import { type FormEvent, useEffect, useRef, useState } from "react";

import LoadingDots from "@/shared/components/LoadingDots.tsx";

export default function DeleteProjectModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
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
    await onSubmit();
    setIsSubmitting(false);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <dialog className="modal" ref={dialogRef} onClose={handleClose}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">Delete Project</h3>
        <form className="pt-2" onSubmit={handleSubmit} id="delete-project">
          <fieldset className="fieldset">
            <label htmlFor="title" className="label text-sm">
              Do you wish to delete this project?
            </label>
          </fieldset>
        </form>
        <div className="modal-action">
          <button
            className="btn btn-error"
            disabled={isSubmitting}
            form="delete-project"
          >
            {isSubmitting && <LoadingDots />}Delete Forever
          </button>

          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
