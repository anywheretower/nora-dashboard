import { cronJobs } from '../data/crons'
import { scripts } from '../data/scripts'
import { sharedFiles } from '../data/shared'
import { protocoloCard } from '../data/skills'

const scriptStyleMap = { 1: 'script-card-1', 2: 'script-card-2', 3: 'script-card-3', 4: 'script-card-4' }

export default function FlowSummary({ summary, onClose, onOpenSkill }) {
  const relevantCrons = cronJobs.filter(c => summary.cronSkills.includes(c.skill))
  const relevantScripts = scripts.filter(s => summary.scriptIds.includes(s.id))

  return (
    <div className="sidebar-content">
      <button className="sidebar-close" onClick={onClose} title="Cerrar">&times;</button>

      <div className="flow-summary">
        {/* Header */}
        <div className="flow-summary-header">
          <span className="flow-summary-icon">{summary.icon}</span>
          <h2>{summary.label}</h2>
        </div>
        <p className="flow-summary-desc">{summary.description}</p>

        {/* Protocolo de Ejecución */}
        <div className="flow-summary-section">
          <h3>⚙️ Protocolo de Ejecución</h3>
          <div className="flow-summary-proto">
            <p>{protocoloCard.description}</p>
            <button className="skill-btn" onClick={() => onOpenSkill(protocoloCard.id)}>
              📄 Ver SKILL.md
            </button>
          </div>
        </div>

        {/* Archivos Compartidos */}
        <div className="flow-summary-section">
          <h3>📁 Archivos Compartidos</h3>
          <div className="flow-summary-shared">
            {sharedFiles.map(f => (
              <div key={f.modalId} className="flow-summary-shared-item">
                <span>{f.icon} <strong>{f.name}</strong></span>
                <button className="skill-btn" onClick={() => onOpenSkill(f.modalId)}>Ver</button>
              </div>
            ))}
          </div>
        </div>

        {/* Cron Jobs */}
        {relevantCrons.length > 0 && (
          <div className="flow-summary-section">
            <h3>📅 Cron Jobs</h3>
            <div className="flow-summary-cron-wrap">
              <table className="flow-summary-cron-table">
                <thead>
                  <tr>
                    <th>Skill</th>
                    <th>Horario</th>
                    <th>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {relevantCrons.map(c => (
                    <tr key={c.id}>
                      <td className="cron-skill">{c.skill}</td>
                      <td className="cron-schedule">{c.schedule}</td>
                      <td>{c.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {summary.scriptNote && (
              <div className="flow-summary-note">💡 {summary.scriptNote}</div>
            )}
          </div>
        )}

        {relevantCrons.length === 0 && (
          <div className="flow-summary-section">
            <h3>📅 Cron Jobs</h3>
            <p className="flow-summary-empty">Sin cron jobs definidos aún</p>
          </div>
        )}

        {/* Scripts */}
        {relevantScripts.length > 0 && (
          <div className="flow-summary-section">
            <h3>⚡ Scripts</h3>
            <div className="flow-summary-scripts">
              {relevantScripts.map(s => (
                <div key={s.id} className={`flow-summary-script-card ${scriptStyleMap[s.cardStyle] || ''}`}>
                  <div className="flow-summary-script-header">
                    <strong>{s.title}</strong>
                    <span className={`card-badge ${s.badgeClass}`}>{s.badge}</span>
                  </div>
                  <p>{s.description}</p>
                  {s.meta && s.meta.slice(0, 2).map((m, i) => (
                    <div className="meta-row" key={i}>
                      <span className="meta-icon">{m.icon}</span>
                      <span className="meta-text">
                        <strong>{m.label}:</strong>{' '}
                        {m.code ? <code>{m.value}</code> : m.value}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {relevantScripts.length === 0 && (
          <div className="flow-summary-section">
            <h3>⚡ Scripts</h3>
            <p className="flow-summary-empty">Sin scripts asociados</p>
          </div>
        )}
      </div>
    </div>
  )
}
