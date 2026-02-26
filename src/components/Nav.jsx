const flowQuickLinks = [
  { catKey: 'marca', label: 'Marca' },
  { catKey: 't2i', label: 'T2I' },
  { catKey: 'i2i', label: 'I2I' },
  { catKey: 'pantalla', label: 'Pantalla' },
  { catKey: 'video', label: 'Video' },
]

export default function Nav({ searchQuery, onSearchChange, onExpandCategory }) {

  const handleClick = (e, catKey) => {
    e.preventDefault()
    if (onExpandCategory) onExpandCategory(catKey)
    // Scroll to category after a tick (to let it expand)
    setTimeout(() => {
      const el = document.getElementById(`flow-${catKey}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 50)
  }

  return (
    <nav className="nav" id="mainNav">
      <input
        type="text"
        className="nav-search"
        placeholder="🔍 Buscar skill..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
      />
      {flowQuickLinks.map(link => (
        <a
          key={link.catKey}
          href={`#flow-${link.catKey}`}
          onClick={e => handleClick(e, link.catKey)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}
