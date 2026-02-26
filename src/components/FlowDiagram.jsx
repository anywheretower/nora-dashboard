import { useMemo, useEffect } from 'react'
import FlowCard from './FlowCard'
import { textToImageFlows, pantallaFlow, imgToImgFlow, videoMGFlow, videoAIFlow, marcaFlows, legend } from '../data/flows'

// Category definitions
const categories = [
  {
    key: 'marca',
    label: 'Marca',
    flows: marcaFlows,
  },
  {
    key: 't2i',
    label: 'Imagen · Text-to-Image',
    flows: textToImageFlows,
  },
  {
    key: 'i2i',
    label: 'Imagen · Img-to-Image',
    flows: [imgToImgFlow],
    autoExpand: true,
  },
  {
    key: 'pantalla',
    label: 'Pantalla',
    flows: [pantallaFlow],
    autoExpand: true,
  },
  {
    key: 'video',
    label: 'Video',
    flows: [videoMGFlow, videoAIFlow],
  },
]

// Build a flat searchable index
function matchesSearch(flow, q) {
  if (!q) return true
  const haystack = [
    flow.id,
    flow.title,
    flow.subtitle || '',
    flow.note || '',
    ...Object.values(flow.levels).flat().map(b => b.text),
  ].join(' ').toLowerCase()
  return haystack.includes(q)
}

export default function FlowDiagram({
  selectedBox, onSelectBox, selectedTitle, onSelectTitle, searchQuery,
  expandedCategory, setExpandedCategory, expandedFlow, setExpandedFlow,
}) {
  const q = (searchQuery || '').toLowerCase().trim()
  const isSearching = q.length > 0

  // Compute which flows match search
  const searchMatches = useMemo(() => {
    if (!isSearching) return null
    const matches = new Set()
    categories.forEach(cat => {
      cat.flows.forEach(flow => {
        if (matchesSearch(flow, q)) matches.add(flow.id)
      })
    })
    return matches
  }, [q, isSearching])

  // Which categories have matches during search
  const categoryHasMatch = useMemo(() => {
    if (!searchMatches) return null
    const result = {}
    categories.forEach(cat => {
      result[cat.key] = cat.flows.some(f => searchMatches.has(f.id))
    })
    return result
  }, [searchMatches])

  const handleCategoryClick = (catKey) => {
    if (isSearching) return // Don't toggle during search
    // Accordion: toggle, or close others
    if (expandedCategory === catKey) {
      setExpandedCategory(null)
      setExpandedFlow(null)
    } else {
      setExpandedCategory(catKey)
      setExpandedFlow(null)
    }
    // Also trigger sidebar summary for the category
    onSelectTitle(catKey)
  }

  const handleFlowClick = (flowId) => {
    if (isSearching) return // Don't toggle during search
    if (expandedFlow === flowId) {
      setExpandedFlow(null)
    } else {
      setExpandedFlow(flowId)
    }
    // Trigger sidebar summary for this flow
    onSelectTitle(flowId)
  }

  // Auto-expand single-flow categories when they open
  useEffect(() => {
    if (!expandedCategory || isSearching) return
    const cat = categories.find(c => c.key === expandedCategory)
    if (cat && cat.autoExpand && cat.flows.length === 1) {
      setExpandedFlow(cat.flows[0].id)
    }
  }, [expandedCategory, isSearching, setExpandedFlow])

  return (
    <div className="flow-diagram">
      {categories.map(cat => {
        const isCatExpanded = isSearching
          ? (categoryHasMatch && categoryHasMatch[cat.key])
          : expandedCategory === cat.key
        const flowCount = cat.flows.length
        const flowWord = flowCount === 1 ? 'flujo' : 'flujos'

        // During search, hide categories with no matches
        if (isSearching && categoryHasMatch && !categoryHasMatch[cat.key]) {
          return null
        }

        return (
          <div key={cat.key} className="flow-accordion-category" id={`flow-${cat.key}`}>
            {/* Level 1 — Category header */}
            <div
              className={`flow-category${isCatExpanded ? ' expanded' : ''}${selectedTitle === cat.key ? ' flow-title-selected' : ''}${cat.key === 'video' ? ' video' : ''}`}
              onClick={() => handleCategoryClick(cat.key)}
            >
              <span className="flow-category-chevron">{isCatExpanded ? '–' : '+'}</span>
              <span className="flow-category-label">{cat.label}</span>
              <span className="flow-category-count">{flowCount} {flowWord}</span>
            </div>

            {/* Level 2 — Flow titles (visible when category is expanded) */}
            <div className={`flow-category-content${isCatExpanded ? ' open' : ''}`}>
              {cat.flows.map(flow => {
                const isFlowExpanded = isSearching
                  ? (searchMatches && searchMatches.has(flow.id))
                  : expandedFlow === flow.id
                const paused = flow.paused || false

                // During search, skip non-matching flows
                if (isSearching && searchMatches && !searchMatches.has(flow.id)) {
                  return null
                }

                return (
                  <div key={flow.id} className="flow-accordion-item">
                    {/* Level 2 — Flow title row */}
                    <div
                      className={`flow-item-title${isFlowExpanded ? ' expanded' : ''}${paused ? ' paused' : ''}${selectedTitle === flow.id ? ' flow-title-selected' : ''}`}
                      onClick={() => handleFlowClick(flow.id)}
                    >
                      <span className="flow-item-chevron">{isFlowExpanded ? '–' : '+'}</span>
                      <span className="flow-item-name">{flow.title}</span>
                      {flow.subtitle && <span className="flow-item-subtitle">{flow.subtitle}</span>}
                      {paused && <span className="flow-item-paused-badge">⏸ Pausado</span>}
                    </div>

                    {/* Level 3 — FlowCard detail (visible when flow is expanded) */}
                    <div className={`flow-item-content${isFlowExpanded ? ' open' : ''}`}>
                      <FlowCard
                        flow={flow}
                        selectedBox={selectedBox}
                        onSelectBox={onSelectBox}
                        selectedTitle={selectedTitle}
                        onSelectTitle={onSelectTitle}
                        searchQuery={q}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

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
        ejecucion-pipeline se lee antes de cada ejecución de script (transversal a todos los flujos)
      </div>
    </div>
  )
}
