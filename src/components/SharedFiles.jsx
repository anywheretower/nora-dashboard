import { sharedFiles } from '../data/shared'

export default function SharedFiles({ searchQuery, onOpenSkill }) {
  const q = searchQuery.toLowerCase().trim()

  return (
    <div className="shared-section">
      <h3>skills/shared/</h3>
      <div className="grid-6">
        {sharedFiles.map(file => {
          const text = `${file.name} ${file.desc}`.toLowerCase()
          const visible = !q || text.includes(q)
          return (
            <div
              key={file.modalId}
              className="shared-item"
              style={{ display: visible ? '' : 'none' }}
            >
              {file.icon} <strong>{file.name}</strong> — {file.desc}{' '}
              <button className="skill-btn" onClick={() => onOpenSkill(file.modalId)}>📄</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
