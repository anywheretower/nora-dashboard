import FlowRow from './FlowRow'

const levelConfig = {
  activador: { label: 'Activador', colorClass: 'level-activador' },
  supabase:  { label: 'Supabase',  colorClass: 'level-supabase' },
  comfy:     { label: 'Comfy',     colorClass: 'level-comfy' },
  qa:        { label: 'QA',        colorClass: 'level-qa' },
}

export default function FlowLevel({ levelKey, boxes, selectedBox, onSelectBox, searchQuery, paused }) {
  const config = levelConfig[levelKey]
  if (!config) return null

  return (
    <div className={`flow-level ${config.colorClass}`}>
      <div className={`flow-level-label ${config.colorClass}`}>
        <span className="flow-level-text">{config.label}</span>
      </div>
      <div className="flow-level-content">
        <FlowRow boxes={boxes} paused={paused} selectedBox={selectedBox} onSelectBox={onSelectBox} searchQuery={searchQuery} />
      </div>
    </div>
  )
}
