import BaseModal from "./BaseModal";

export default function DeleteProjectModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={async () => onSubmit()}
      title="Delete Project"
      submitLabel="Delete Forever"
      submitClassName="btn btn-error"
    >
      <fieldset className="fieldset">
        <label className="label text-sm">
          Do you wish to delete this project?
        </label>
      </fieldset>
    </BaseModal>
  );
}
