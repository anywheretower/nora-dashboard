import Card from './Card'
import FlowSummary from './FlowSummary'

export default function Sidebar({ detail, selectedTitle, flowSummary, onClose, onOpenSkill }) {
  // Flow title selected → show summary panel
  if (selectedTitle && flowSummary) {
    return (
      <FlowSummary
        summary={flowSummary}
        onClose={onClose}
        onOpenSkill={onOpenSkill}
      />
    )
  }

  // No box selected → empty state
  if (!detail) {
    return (
      <div className="sidebar-empty">
        <div className="sidebar-empty-icon">←</div>
        <p>Haz click en cualquier elemento del flujo para ver su detalle</p>
      </div>
    )
  }

  const { type } = detail

  // Skill card
  if (type === 'skill') {
    return (
      <div className="sidebar-content">
        <button className="sidebar-close" onClick={onClose} title="Cerrar">&times;</button>
        <div className="sidebar-card-wrap">
          <Card skill={detail.data} onOpenSkill={onOpenSkill} />
        </div>
      </div>
    )
  }

  // Script card
  if (type === 'script') {
    const styleMap = { 1: 'script-card-1', 2: 'script-card-2', 3: 'script-card-3', 4: 'script-card-4' }
    return (
      <div className="sidebar-content">
        <button className="sidebar-close" onClick={onClose} title="Cerrar">&times;</button>
        <div className="sidebar-card-wrap">
          <Card skill={detail.data} className={styleMap[detail.data.cardStyle] || ''} />
        </div>
      </div>
    )
  }

  // Step info card
  if (type === 'step') {
    return (
      <div className="sidebar-content">
        <button className="sidebar-close" onClick={onClose} title="Cerrar">&times;</button>
        <div className="sidebar-info-card sidebar-info-step">
          <div className="sidebar-info-icon">{detail.icon}</div>
          <h3>{detail.title}</h3>
          <p>{detail.description}</p>
          <div className="sidebar-info-badge" style={{ color: detail.color, borderColor: detail.color }}>
            Estado Supabase
          </div>
        </div>
      </div>
    )
  }

  // Input info card
  if (type === 'input') {
    return (
      <div className="sidebar-content">
        <button className="sidebar-close" onClick={onClose} title="Cerrar">&times;</button>
        <div className="sidebar-info-card sidebar-info-input">
          <div className="sidebar-info-icon">{detail.icon}</div>
          <h3>{detail.title}</h3>
          <p>{detail.description}</p>
          <div className="sidebar-info-badge" style={{ color: detail.color, borderColor: detail.color }}>
            Fuente de datos
          </div>
        </div>
      </div>
    )
  }

  // Generic info card
  if (type === 'info') {
    return (
      <div className="sidebar-content">
        <button className="sidebar-close" onClick={onClose} title="Cerrar">&times;</button>
        <div className="sidebar-info-card sidebar-info-generic">
          <div className="sidebar-info-icon">{detail.icon}</div>
          <h3>{detail.title}</h3>
          <p>{detail.description}</p>
          <div className="sidebar-info-badge" style={{ color: detail.color, borderColor: detail.color }}>
            Info
          </div>
        </div>
      </div>
    )
  }

  return null
}
