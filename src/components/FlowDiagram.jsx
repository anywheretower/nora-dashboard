import FlowRow from './FlowRow'
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

      {textToImageFlows.map((flow, idx) => (
        <div key={flow.id} id={`flow-row-${flow.id}`} style={idx > 0 ? { marginTop: 14 } : undefined}>
          <div
            className={`flow-row-label flow-title-clickable${selectedTitle === flow.id ? ' flow-title-selected' : ''}`}
            onClick={() => onSelectTitle(flow.id)}
          >
            {flow.icon} {flow.title} <span>{flow.subtitle}</span>
          </div>
          <FlowRow boxes={flow.boxes} selectedBox={selectedBox} onSelectBox={onSelectBox} searchQuery={q} />
          <div className="flow-note">{flow.note}</div>
        </div>
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
      <div
        className={`flow-row-label flow-title-clickable${selectedTitle === 'producto' ? ' flow-title-selected' : ''}`}
        onClick={() => onSelectTitle('producto')}
      >
        {imgToImgFlow.icon} {imgToImgFlow.title} <span>{imgToImgFlow.subtitle}</span>
      </div>
      <FlowRow boxes={imgToImgFlow.boxes} selectedBox={selectedBox} onSelectBox={onSelectBox} searchQuery={q} />
      <div className="flow-note">{imgToImgFlow.note}</div>

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

      <div
        className={`flow-row-label flow-title-clickable${selectedTitle === 'video-mg' ? ' flow-title-selected' : ''}`}
        onClick={() => onSelectTitle('video-mg')}
      >
        {videoMGFlow.icon} {videoMGFlow.title}
      </div>
      <FlowRow boxes={videoMGFlow.boxes} selectedBox={selectedBox} onSelectBox={onSelectBox} searchQuery={q} />
      <div className="flow-note">{videoMGFlow.note}</div>

      <div style={{ marginTop: 14 }}>
        <div
          className={`flow-row-label flow-title-clickable${selectedTitle === 'video-ai' ? ' flow-title-selected' : ''}`}
          style={{ color: '#999' }}
          onClick={() => onSelectTitle('video-ai')}
        >
          {videoAIFlow.icon} {videoAIFlow.title}
        </div>
        <FlowRow boxes={videoAIFlow.boxes} paused selectedBox={selectedBox} onSelectBox={onSelectBox} searchQuery={q} />
        <div className="flow-note" style={{ color: '#999' }}>{videoAIFlow.note}</div>
      </div>

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
      <div
        className={`flow-row-label flow-title-clickable${selectedTitle === 'marca' ? ' flow-title-selected' : ''}`}
        onClick={() => onSelectTitle('marca')}
      >
        {marcaFlow.icon} {marcaFlow.title}
      </div>
      <FlowRow boxes={marcaFlow.boxes} selectedBox={selectedBox} onSelectBox={onSelectBox} searchQuery={q} />
      <div className="flow-note" dangerouslySetInnerHTML={{ __html: marcaFlow.note }} />

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
