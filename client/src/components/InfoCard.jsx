function InfoCard({ children, className = "", title, subtitle }) {
  return (
    <section className={`surface-card ${className}`.trim()}>
      {title ? <h3>{title}</h3> : null}
      {subtitle ? <p className="muted">{subtitle}</p> : null}
      {children}
    </section>
  );
}

export default InfoCard;
