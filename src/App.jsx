import { useState, useEffect, useCallback, useMemo } from 'react'
import './App.css'

import Header from './components/Header'
import Nav from './components/Nav'
import Section from './components/Section'
import FlowDiagram from './components/FlowDiagram'
import Card from './components/Card'
import CronTable from './components/CronTable'
import ScriptsSection from './components/ScriptsSection'
import SharedFiles from './components/SharedFiles'
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
import { navLinks } from './data/nav'
import { getFlowDetail } from './data/flowDetails'

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

  // Active section (scroll spy)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const sectionIds = navLinks.map(l => l.id)
    const observers = []
    
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveSection(id)
            }
          })
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

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

  // Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (modalSkillId) {
          closeSkill()
        } else if (selectedBox) {
          setSelectedBox(null)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalSkillId, closeSkill, selectedBox])

  // Sidebar: selected flow box
  const [selectedBox, setSelectedBox] = useState(null)

  const handleSelectBox = useCallback((boxText) => {
    setSelectedBox(prev => prev === boxText ? null : boxText)
  }, [])

  const selectedDetail = useMemo(() => {
    return selectedBox ? getFlowDetail(selectedBox) : null
  }, [selectedBox])

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

  // Search filter helper
  const q = searchQuery.toLowerCase().trim()
  const matchesSearch = (text) => !q || text.toLowerCase().includes(q)

  // Check if any card in a section matches search
  const sectionHasMatch = (cards) => {
    if (!q) return true
    return cards.some(c => matchesSearch(`${c.title} ${c.description} ${c.badge || ''}`))
  }

  // Footer date
  const footerDate = useMemo(() => {
    const now = new Date()
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
    return `${now.getDate()} de ${months[now.getMonth()]} ${now.getFullYear()}`
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
        activeSection={activeSection}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="container">
        {/* FLUJO — Split Screen */}
        <Section id="flujo" icon="🔄" title="Flujo de trabajo" defaultOpen>
          <div className={`app-layout${selectedBox ? ' sidebar-open' : ''}`}>
            <div className="flow-panel">
              <FlowDiagram selectedBox={selectedBox} onSelectBox={handleSelectBox} />
            </div>
            <div className="sidebar-panel">
              <Sidebar
                detail={selectedDetail}
                onClose={() => setSelectedBox(null)}
                onOpenSkill={openSkill}
              />
            </div>
          </div>
        </Section>

        {/* PROTOCOLO */}
        <Section
          id="protocolo"
          icon="⚙️"
          title="Protocolo de Ejecución"
          hidden={!sectionHasMatch([protocoloCard])}
        >
          <div style={{ maxWidth: 1200 }}>
            <Card
              skill={protocoloCard}
              className={`proto-card ${matchesSearch(`${protocoloCard.title} ${protocoloCard.description}`) ? '' : 'card-hidden'}`}
              onOpenSkill={openSkill}
            />
          </div>
        </Section>

        {/* CRON */}
        <Section id="cron" icon="📅" title="Cron Jobs">
          <CronTable searchQuery={searchQuery} />
        </Section>

        {/* SCRIPTS */}
        <Section
          id="scripts"
          icon="⚡"
          title="Scripts de Ejecución"
        >
          <ScriptsSection searchQuery={searchQuery} />
        </Section>

        {/* NIVEL 1 */}
        <Section
          id="nivel1"
          icon="🏛️"
          title="Nivel 1 — Marca"
          subtitle="(definen y mejoran la identidad de marca)"
          hidden={!sectionHasMatch(nivel1Skills)}
        >
          <div className="grid-3 level-1">
            {nivel1Skills.map(skill => (
              <Card
                key={skill.id}
                skill={skill}
                className={matchesSearch(`${skill.title} ${skill.description} ${skill.badge}`) ? '' : 'card-hidden'}
                onOpenSkill={openSkill}
              />
            ))}
          </div>
        </Section>

        {/* NIVEL 2 */}
        <Section
          id="nivel2"
          icon="🎨"
          title="Nivel 2 — Imagen"
          subtitle="(pipeline completo de generación de imágenes)"
          hidden={!sectionHasMatch([nivel2Concepto, ...nivel2T2iSkills, nivel2Producto, nivel2PromptMaster])}
        >
          {/* Concepto: full width */}
          <div className="level-2" style={{ marginBottom: 20 }}>
            <Card
              skill={nivel2Concepto}
              className={matchesSearch(`${nivel2Concepto.title} ${nivel2Concepto.description}`) ? '' : 'card-hidden'}
              onOpenSkill={openSkill}
            />
          </div>

          {/* Connector */}
          <div className="connector">▼ ▼ ▼ ▼ ▼ ▼</div>

          {/* 3x2 T2I grid */}
          <div className="grid-3 level-2" style={{ marginBottom: 20 }}>
            {nivel2T2iSkills.map(skill => (
              <Card
                key={skill.id}
                skill={skill}
                className={matchesSearch(`${skill.title} ${skill.description} ${skill.badge}`) ? '' : 'card-hidden'}
                onOpenSkill={openSkill}
              />
            ))}
          </div>

          {/* Connector */}
          <div className="connector">▼</div>

          {/* Producto */}
          <div className="level-2" style={{ marginBottom: 20 }}>
            <Card
              skill={nivel2Producto}
              className={matchesSearch(`${nivel2Producto.title} ${nivel2Producto.description}`) ? '' : 'card-hidden'}
              onOpenSkill={openSkill}
            />
          </div>

          {/* Connector */}
          <div className="connector">▼</div>

          {/* Prompt Master */}
          <div className="level-2" style={{ marginBottom: 20 }}>
            <Card
              skill={nivel2PromptMaster}
              className={matchesSearch(`${nivel2PromptMaster.title} ${nivel2PromptMaster.description}`) ? '' : 'card-hidden'}
              onOpenSkill={openSkill}
            />
          </div>
        </Section>

        {/* NIVEL 3 */}
        <Section
          id="nivel3"
          icon="✅"
          title="Nivel 3 — Calidad Imagen"
          subtitle="(QA automática + observaciones humanas)"
          hidden={!sectionHasMatch(nivel3Skills)}
        >
          <div className="grid-2 level-4" style={{ marginBottom: 20 }}>
            {nivel3Skills.map(skill => (
              <Card
                key={skill.id}
                skill={skill}
                className={matchesSearch(`${skill.title} ${skill.description} ${skill.badge}`) ? '' : 'card-hidden'}
                onOpenSkill={openSkill}
              />
            ))}
          </div>
        </Section>

        {/* NIVEL 4 */}
        <Section
          id="nivel4"
          icon="🎬"
          title="Nivel 4 — Video"
          subtitle="(pipeline: concepto → libreto → voz → animación → publicar)"
          hidden={!sectionHasMatch([nivel4VideoConcepto, ...nivel4GridSkills, nivel4Remotion, nivel4PublicarVideo, nivel4LtxVideo])}
        >
          {/* Video Concepto */}
          <div className="level-3" style={{ marginBottom: 20 }}>
            <Card
              skill={nivel4VideoConcepto}
              className={matchesSearch(`${nivel4VideoConcepto.title} ${nivel4VideoConcepto.description}`) ? '' : 'card-hidden'}
              onOpenSkill={openSkill}
            />
          </div>

          <div className="connector video">▼</div>

          {/* Libreto + Cartesia */}
          <div className="grid-2 level-3" style={{ marginBottom: 20 }}>
            {nivel4GridSkills.map(skill => (
              <Card
                key={skill.id}
                skill={skill}
                className={matchesSearch(`${skill.title} ${skill.description} ${skill.badge}`) ? '' : 'card-hidden'}
                onOpenSkill={openSkill}
              />
            ))}
          </div>

          <div className="connector video">▼</div>

          {/* Remotion */}
          <div className="level-3" style={{ marginBottom: 20 }}>
            <Card
              skill={nivel4Remotion}
              className={matchesSearch(`${nivel4Remotion.title} ${nivel4Remotion.description}`) ? '' : 'card-hidden'}
              onOpenSkill={openSkill}
            />
          </div>

          <div className="connector video">▼</div>

          {/* Publicar Video */}
          <div className="level-3" style={{ marginBottom: 20 }}>
            <Card
              skill={nivel4PublicarVideo}
              className={matchesSearch(`${nivel4PublicarVideo.title} ${nivel4PublicarVideo.description}`) ? '' : 'card-hidden'}
              onOpenSkill={openSkill}
            />
          </div>

          {/* LTX Video - Paused */}
          <div style={{ marginTop: 32, marginBottom: 20 }}>
            <div className="paused-label">⏸️ <strong>En desarrollo — se activa cuando el flujo esté validado</strong></div>
            <Card
              skill={nivel4LtxVideo}
              className={matchesSearch(`${nivel4LtxVideo.title} ${nivel4LtxVideo.description}`) ? '' : 'card-hidden'}
              onOpenSkill={openSkill}
            />
          </div>
        </Section>

        {/* NIVEL 5 */}
        <Section
          id="nivel5"
          icon="✅"
          title="Nivel 5 — Calidad Video"
          subtitle="(pendiente — se crean junto con review de skills de video)"
          hidden={!sectionHasMatch(nivel5Skills)}
        >
          <div className="grid-2 level-4">
            {nivel5Skills.map(skill => (
              <Card
                key={skill.id}
                skill={skill}
                className={matchesSearch(`${skill.title} ${skill.description} ${skill.badge}`) ? '' : 'card-hidden'}
              />
            ))}
          </div>
        </Section>

        {/* SHARED */}
        <Section id="shared" icon="📁" title="Archivos Compartidos">
          <SharedFiles searchQuery={searchQuery} onOpenSkill={openSkill} />
        </Section>

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
