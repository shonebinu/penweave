export default function LoadingDots({
  size = "md",
}: {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  return <span className={`loading loading-dots loading-${size}`}></span>;
}
