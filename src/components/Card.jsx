export default function Card({
  skill,
  level,
  className = '',
  style = {},
  onOpenSkill,
}) {
  const statusClass = skill.status === 'active' ? 'status-active' : skill.status === 'yellow' ? 'status-yellow' : skill.status === 'gray' ? 'status-gray' : ''
  const pausedClass = skill.paused ? 'paused' : ''
  const accentClass = skill.accentBorder ? `accent-${skill.accentBorder}` : ''
  
  // For compact T2I cards
  if (skill.compact) {
    return (
      <div className={`card ${statusClass} ${pausedClass} ${className} compact-card`} style={style}>
        <div className="card-header">
          <div className="card-title">{skill.title}</div>
        </div>
        <div className="card-body">
          <span className={`card-badge ${skill.badgeClass}`}>{skill.badge}</span>
          <div className="card-desc">{skill.description}</div>
          <div className="compact-cron">{skill.cron}</div>
          {skill.fields && (
            <details className="compact-fields">
              <summary>📋 <code>creatividades</code> — ver campos</summary>
              <div style={{ marginTop: 4, paddingLeft: 8 }}>{skill.fields}</div>
            </details>
          )}
        </div>
        <div className="card-footer">
          <span className="rev">{skill.rev}</span>
          {skill.skillBtn && onOpenSkill && (
            <button className="skill-btn" onClick={() => onOpenSkill(skill.id)}>📄 Ver SKILL.md</button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`card ${statusClass} ${pausedClass} ${accentClass} ${className}`} style={style}>
      <div className="card-header">
        <div className="card-title">{skill.title}</div>
        <span className={`card-badge ${skill.badgeClass}`}>{skill.badge}</span>
      </div>
      <div className="card-body">
        <div className="card-desc" dangerouslySetInnerHTML={{ __html: skill.description }} />
        {skill.meta && (
          <div className="card-meta">
            {skill.meta.map((m, i) => (
              <div className="meta-row" key={i}>
                <span className="meta-icon">{m.icon}</span>
                <span className="meta-text">
                  <strong>{m.label}:</strong>{' '}
                  {m.code ? <code>{m.value}</code> : m.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="card-footer">
        <span className="rev">{skill.rev}</span>
        {skill.deps && <span className="deps">{skill.deps}</span>}
        {skill.skillBtn && onOpenSkill && (
          <button className="skill-btn" onClick={() => onOpenSkill(skill.id)}>📄 Ver SKILL.md</button>
        )}
      </div>
    </div>
  )
}
