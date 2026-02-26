import FlowCard from './FlowCard'
import { textToImageFlows, imgToImgFlow, videoMGFlow, videoAIFlow, marcaFlow, legend } from '../data/flows'

export default function FlowDiagram({ selectedBox, onSelectBox, selectedTitle, onSelectTitle, searchQuery }) {
  const q = (searchQuery || '').toLowerCase().trim()

  return (
    <div className="flow-diagram">
      {/* Text-to-Image section */}
      <div
        id="flow-t2i"
        className={`flow-section-header flow-title-clickable${selectedTitle === 't2i' ? ' flow-title-selected' : ''}`}
        onClick={() => onSelectTitle('t2i')}
      >
        Imagen Text-to-Image
      </div>

      {textToImageFlows.map((flow) => (
        <FlowCard
          key={flow.id}
          flow={flow}
          selectedBox={selectedBox}
          onSelectBox={onSelectBox}
          selectedTitle={selectedTitle}
          onSelectTitle={onSelectTitle}
          searchQuery={q}
        />
      ))}

      {/* Separator */}
      <div className="flow-separator" />

      {/* Img-to-Image */}
      <div
        id="flow-i2i"
        className={`flow-section-header flow-title-clickable${selectedTitle === 'i2i' ? ' flow-title-selected' : ''}`}
        onClick={() => onSelectTitle('i2i')}
      >
        Imagen Img-to-Image
      </div>

      <FlowCard
        flow={imgToImgFlow}
        selectedBox={selectedBox}
        onSelectBox={onSelectBox}
        selectedTitle={selectedTitle}
        onSelectTitle={onSelectTitle}
        searchQuery={q}
      />

      {/* Separator */}
      <div className="flow-separator" />

      {/* Video */}
      <div
        id="flow-video"
        className={`flow-section-header video flow-title-clickable${selectedTitle === 'video' ? ' flow-title-selected' : ''}`}
        onClick={() => onSelectTitle('video')}
      >
        Video
      </div>

      <FlowCard
        flow={videoMGFlow}
        selectedBox={selectedBox}
        onSelectBox={onSelectBox}
        selectedTitle={selectedTitle}
        onSelectTitle={onSelectTitle}
        searchQuery={q}
      />

      <FlowCard
        flow={videoAIFlow}
        selectedBox={selectedBox}
        onSelectBox={onSelectBox}
        selectedTitle={selectedTitle}
        onSelectTitle={onSelectTitle}
        searchQuery={q}
      />

      {/* Separator */}
      <div className="flow-separator" />

      {/* Marca */}
      <div
        id="flow-marca"
        className={`flow-section-header flow-title-clickable${selectedTitle === 'marca' ? ' flow-title-selected' : ''}`}
        onClick={() => onSelectTitle('marca')}
      >
        Marca
      </div>

      <FlowCard
        flow={marcaFlow}
        selectedBox={selectedBox}
        onSelectBox={onSelectBox}
        selectedTitle={selectedTitle}
        onSelectTitle={onSelectTitle}
        searchQuery={q}
      />

      {/* Legend */}
      <div className="flow-legend">
        {legend.map(item => (
          <span key={item.type}>
            <span className={`flow-box flow-${item.type}`} style={{ padding: '3px 8px', fontSize: '0.65rem' }}>{item.text}</span>
            {' '}{item.label}
          </span>
        ))}
      </div>
      <div className="flow-legend-note">
        ⚙️ <strong>ejecucion-pipeline</strong> se lee ANTES de cada ejecución de script (transversal a todos los flujos)
      </div>
    </div>
  )
}
