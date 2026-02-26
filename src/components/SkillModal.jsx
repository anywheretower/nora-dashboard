import skillContent from '../data/skillContent'

export default function SkillModal({ skillId, onClose }) {
  if (!skillId) return null

  const content = skillContent[skillId] || 'Contenido no disponible.'

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="skill-modal-overlay active" onClick={handleOverlayClick}>
      <div className="skill-modal">
        <button className="skill-modal-close" onClick={onClose}>&times;</button>
        <pre>{content}</pre>
      </div>
    </div>
  )
}
