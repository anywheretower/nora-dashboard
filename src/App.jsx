import { useState, useEffect, useCallback, useMemo } from 'react'
import './App.css'

import Header from './components/Header'
import Nav from './components/Nav'
import FlowDiagram from './components/FlowDiagram'
import SkillModal from './components/SkillModal'
import ScrollToTop from './components/ScrollToTop'
import Sidebar from './components/Sidebar'

import {
  protocoloCard,
  nivel1Skills,
  nivel2Concepto,
  nivel2T2iSkills,
  nivel2Producto,
  nivel2PromptMaster,
  nivel3Skills,
  nivel4VideoConcepto,
  nivel4GridSkills,
  nivel4Remotion,
  nivel4PublicarVideo,
  nivel4LtxVideo,
  nivel5Skills,
} from './data/skills'
import { sharedFiles } from './data/shared'
import { getFlowDetail } from './data/flowDetails'
import { flowSummaries } from './data/flowSummaries'

function App() {
  // Theme
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('nora-theme')
    if (saved) return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('nora-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  // Search
  const [searchQuery, setSearchQuery] = useState('')

  // Accordion state
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [expandedFlow, setExpandedFlow] = useState(null)

  // Modal
  const [modalSkillId, setModalSkillId] = useState(null)

  const openSkill = useCallback((id) => {
    setModalSkillId(id)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeSkill = useCallback(() => {
    setModalSkillId(null)
    document.body.style.overflow = ''
  }, [])

  // Sidebar: selected flow box
  const [selectedBox, setSelectedBox] = useState(null)

  // Sidebar: selected flow title
  const [selectedFlowTitle, setSelectedFlowTitle] = useState(null)

  // Escape key to close modal or sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (modalSkillId) {
          closeSkill()
        } else if (selectedBox) {
          setSelectedBox(null)
        } else if (selectedFlowTitle) {
          setSelectedFlowTitle(null)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalSkillId, closeSkill, selectedBox, selectedFlowTitle])

  const handleSelectBox = useCallback((boxText) => {
    setSelectedFlowTitle(null)
    setSelectedBox(prev => prev === boxText ? null : boxText)
  }, [])

  const handleSelectTitle = useCallback((titleId) => {
    setSelectedBox(null)
    setSelectedFlowTitle(prev => prev === titleId ? null : titleId)
  }, [])

  const handleCloseSidebar = useCallback(() => {
    setSelectedBox(null)
    setSelectedFlowTitle(null)
  }, [])

  const selectedDetail = useMemo(() => {
    return selectedBox ? getFlowDetail(selectedBox) : null
  }, [selectedBox])

  const selectedSummary = useMemo(() => {
    return selectedFlowTitle ? flowSummaries[selectedFlowTitle] || null : null
  }, [selectedFlowTitle])

  const sidebarOpen = !!(selectedBox || selectedFlowTitle)

  // Stats
  const skillCount = useMemo(() => {
    const allSkills = [
      protocoloCard,
      ...nivel1Skills,
      nivel2Concepto,
      ...nivel2T2iSkills,
      nivel2Producto,
      nivel2PromptMaster,
      ...nivel3Skills,
      nivel4VideoConcepto,
      ...nivel4GridSkills,
      nivel4Remotion,
      nivel4PublicarVideo,
      nivel4LtxVideo,
      ...nivel5Skills,
    ]
    return allSkills.filter(s => s.title.startsWith('nora-')).length
  }, [])

  const sharedCount = sharedFiles.length
  const nivelCount = 5

  // Footer date
  const footerDate = useMemo(() => {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' }))
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
    const h = now.getHours().toString().padStart(2, '0')
    const m = now.getMinutes().toString().padStart(2, '0')
    return `${now.getDate()} de ${months[now.getMonth()]} ${now.getFullYear()}, ${h}:${m} hrs`
  }, [])

  return (
    <>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        skillCount={skillCount}
        sharedCount={sharedCount}
        nivelCount={nivelCount}
      />

      <Nav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExpandCategory={(catKey) => {
          setExpandedCategory(catKey)
          setExpandedFlow(null)
          handleSelectTitle(catKey)
        }}
      />

      <div className="container">
        <div className={`app-layout${sidebarOpen ? ' sidebar-open' : ''}`}>
          <div className="flow-panel">
            <FlowDiagram
              selectedBox={selectedBox}
              onSelectBox={handleSelectBox}
              selectedTitle={selectedFlowTitle}
              onSelectTitle={handleSelectTitle}
              searchQuery={searchQuery}
              expandedCategory={expandedCategory}
              setExpandedCategory={setExpandedCategory}
              expandedFlow={expandedFlow}
              setExpandedFlow={setExpandedFlow}
            />
          </div>
          <div className="sidebar-panel">
            <Sidebar
              detail={selectedDetail}
              selectedTitle={selectedFlowTitle}
              flowSummary={selectedSummary}
              onClose={handleCloseSidebar}
              onOpenSkill={openSkill}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="footer" id="footer-date">
          NORA Skills Dashboard — Última actualización: {footerDate}
        </div>
      </div>

      <ScrollToTop />
      <SkillModal skillId={modalSkillId} onClose={closeSkill} />
    </>
  )
}

export default App
