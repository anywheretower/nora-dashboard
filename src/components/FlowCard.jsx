import FlowLevel from './FlowLevel'

const levelKeys = ['activador', 'supabase', 'comfy', 'qa']

export default function FlowCard({ flow, selectedBox, onSelectBox, selectedTitle, onSelectTitle, searchQuery }) {
  const paused = flow.paused || false

  return (
    <div className={`flow-card-wrap${paused ? ' flow-card-paused' : ''}`}>
      {/* 4-level card */}
      <div className="flow-card">
        {levelKeys.map(key => (
          <FlowLevel
            key={key}
            levelKey={key}
            boxes={flow.levels[key]}
            selectedBox={selectedBox}
            onSelectBox={onSelectBox}
            searchQuery={searchQuery}
            paused={paused}
          />
        ))}
      </div>

      {/* Note */}
      {flow.note && (
        <div
          className="flow-note"
          style={paused ? { color: '#999' } : undefined}
          dangerouslySetInnerHTML={{ __html: flow.note }}
        />
      )}
    </div>
  )
}
