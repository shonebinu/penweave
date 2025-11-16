import LoadingDots from "@/components/LoadingDots.tsx";

export default function ActionButton({
  onClick,
  loading = false,
  icon: Icon,
  className,
  tooltip,
  children,
  title,
  iconFill,
}: {
  onClick: () => void;
  loading?: boolean;
  className?: string;
  icon?: React.ElementType;
  tooltip?: string;
  children?: React.ReactNode;
  title?: string;
  iconFill?: string;
}) {
  const button = (
    <button
      onClick={onClick}
      disabled={loading}
      className={className}
      title={title}
    >
      {Icon && !loading && <Icon size="1rem" fill={iconFill || "none"} />}
      {loading && <LoadingDots />}
      {children}
    </button>
  );

  return tooltip ? (
    <div className="lg:tooltip lg:tooltip-bottom" data-tip={tooltip}>
      {button}
    </div>
  ) : (
    button
  );
}
