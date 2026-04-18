function StatusBadge({ children, variant = "neutral" }) {
  return <span className={`badge badge--${variant}`}>{children}</span>;
}

export default StatusBadge;
