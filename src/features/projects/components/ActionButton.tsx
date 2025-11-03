import LoadingDots from "@/components/LoadingDots.tsx";

export default function ActionButton({
  onClick,
  loading = false,
  icon: Icon,
  className,
  tooltip,
  children,
  title,
}: {
  onClick: () => void;
  loading?: boolean;
  className?: string;
  icon?: React.ElementType;
  tooltip?: string;
  children?: React.ReactNode;
  title?: string;
}) {
  const button = (
    <button
      onClick={onClick}
      disabled={loading}
      className={className}
      title={title}
    >
      {Icon && !loading && <Icon size="1rem" />}
      {loading && <LoadingDots />}
      {children}
    </button>
  );

  return tooltip ? (
    <div className="tooltip tooltip-bottom" data-tip={tooltip}>
      {button}
    </div>
  ) : (
    button
  );
}
