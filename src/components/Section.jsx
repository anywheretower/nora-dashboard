export default function Section({ id, icon, title, subtitle, defaultOpen = false, hidden = false, children }) {
  return (
    <details
      className={`section-collapse${hidden ? ' section-hidden' : ''}`}
      id={`section-${id}`}
      open={defaultOpen || undefined}
    >
      <summary>
        <div className="section-title" id={id}>
          <span className="icon">{icon}</span>
          {title}
          {subtitle && <span className="subtitle">{subtitle}</span>}
          <span className="chevron">▶</span>
        </div>
      </summary>
      {children}
    </details>
  )
}
