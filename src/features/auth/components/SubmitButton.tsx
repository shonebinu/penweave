import LoadingDots from "@/shared/components/LoadingDots.tsx";

export default function SubmitButton({
  loading,
  text,
}: {
  loading: boolean;
  text: string;
}) {
  return (
    <button className="btn btn-primary mt-4 w-full" disabled={loading}>
      {loading && <LoadingDots />}
      {text}
    </button>
  );
}
