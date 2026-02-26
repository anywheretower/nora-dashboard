import FlowRow from './FlowRow'
import { textToImageFlows, imgToImgFlow, videoMGFlow, videoAIFlow, marcaFlow, legend } from '../data/flows'

export default function FlowDiagram() {
  return (
    <div className="flow-diagram">
      {/* Text-to-Image section */}
      <div className="flow-section-header">Imagen Text-to-Image</div>

      {textToImageFlows.map((flow, idx) => (
        <div key={flow.id} style={idx > 0 ? { marginTop: 14 } : undefined}>
          <div className="flow-row-label">
            {flow.icon} {flow.title} <span>{flow.subtitle}</span>
          </div>
          <FlowRow boxes={flow.boxes} />
          <div className="flow-note">{flow.note}</div>
        </div>
      ))}

      {/* Separator */}
      <div className="flow-separator" />

      {/* Img-to-Image */}
      <div className="flow-section-header">Imagen Img-to-Image</div>
      <div className="flow-row-label">
        {imgToImgFlow.icon} {imgToImgFlow.title} <span>{imgToImgFlow.subtitle}</span>
      </div>
      <FlowRow boxes={imgToImgFlow.boxes} />
      <div className="flow-note">{imgToImgFlow.note}</div>

      {/* Separator */}
      <div className="flow-separator" />

      {/* Video */}
      <div className="flow-section-header video">Video</div>
      
      <div className="flow-row-label">
        {videoMGFlow.icon} {videoMGFlow.title}
      </div>
      <FlowRow boxes={videoMGFlow.boxes} />
      <div className="flow-note">{videoMGFlow.note}</div>

      <div style={{ marginTop: 14 }}>
        <div className="flow-row-label" style={{ color: '#999' }}>
          {videoAIFlow.icon} {videoAIFlow.title}
        </div>
        <FlowRow boxes={videoAIFlow.boxes} paused />
        <div className="flow-note" style={{ color: '#999' }}>{videoAIFlow.note}</div>
      </div>

      {/* Separator */}
      <div className="flow-separator" />

      {/* Marca */}
      <div className="flow-section-header">Marca</div>
      <div className="flow-row-label">
        {marcaFlow.icon} {marcaFlow.title}
      </div>
      <FlowRow boxes={marcaFlow.boxes} />
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
