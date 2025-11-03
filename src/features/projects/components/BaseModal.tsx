import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import LoadingDots from "@/components/LoadingDots.tsx";

export default function BaseModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitLabel,
  submitClassName = "btn btn-primary",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => Promise<void>;
  title: string;
  children: ReactNode;
  submitLabel: string;
  submitClassName?: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) dialog.showModal();
    else dialog.close();
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(e);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <dialog className="modal" ref={dialogRef} onClose={onClose}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        <form className="pt-2" onSubmit={handleSubmit} id={formId}>
          {children}
        </form>
        <div className="modal-action">
          <button
            className={submitClassName}
            disabled={isSubmitting}
            form={formId}
          >
            {isSubmitting && <LoadingDots />}
            {submitLabel}
          </button>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
