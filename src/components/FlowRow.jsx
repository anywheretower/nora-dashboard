export default function FlowRow({ boxes, paused = false, selectedBox, onSelectBox }) {
  return (
    <div className="flow-row" style={paused ? { opacity: 0.5 } : undefined}>
      {boxes.map((box, i) => {
        if (box.type === 'separator') {
          return <span key={i} className="flow-arrow" style={{ color: '#999' }}>|</span>
        }
        if (box.type === 'bidirectional') {
          return <span key={i} className="flow-arrow">↔</span>
        }

        const isSelected = selectedBox === box.text
        const isClickable = box.type !== 'separator' && box.type !== 'bidirectional'

        return (
          <span key={i}>
            {i > 0 && box.type !== 'separator' && boxes[i - 1]?.type !== 'separator' && box.type !== 'bidirectional' && boxes[i - 1]?.type !== 'bidirectional' && (
              <span className="flow-arrow">→</span>
            )}
            <span
              className={`flow-box flow-${box.type}${isSelected ? ' selected' : ''}${isClickable ? ' clickable' : ''}`}
              onClick={isClickable && onSelectBox ? () => onSelectBox(box.text) : undefined}
            >
              {box.text}
            </span>
          </span>
        )
      })}
    </div>
  )
}
