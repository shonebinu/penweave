import { LoadingDots } from "./LoadingDots.tsx";

export function SubmitButton({
  loading,
  text,
}: {
  loading: boolean;
  text: string;
}) {
  return (
    <button className="btn btn-neutral mt-4" disabled={loading}>
      {loading && <LoadingDots />}
      {text}
    </button>
  );
}
