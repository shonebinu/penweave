import { useState } from "react";

import BaseModal from "./BaseModal";

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

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => {
        setTitle(oldTitle);
        onClose();
      }}
      onSubmit={async () => onSubmit(title)}
      title="Edit Project Title"
      submitLabel="Submit"
    >
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
    </BaseModal>
  );
}
