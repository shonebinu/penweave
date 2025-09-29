import { LoadingDots } from "./LoadingDots.tsx";

export function SubmitButton({
  loading,
  text,
}: {
  loading: boolean;
  text: string;
}) {
  return (
    <button className="btn btn-neutral mt-4 w-full" disabled={loading}>
      {loading && <LoadingDots />}
      {text}
    </button>
  );
}
