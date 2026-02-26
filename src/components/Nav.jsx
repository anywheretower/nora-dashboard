const flowQuickLinks = [
  { id: 'flow-t2i', label: 'T2I' },
  { id: 'flow-i2i', label: 'I2I' },
  { id: 'flow-row-pantalla', label: 'Pantalla' },
  { id: 'flow-video', label: 'Video' },
  { id: 'flow-marca', label: 'Marca' },
]

export default function Nav({ searchQuery, onSearchChange }) {

  const handleClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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
          key={link.id}
          href={`#${link.id}`}
          onClick={e => handleClick(e, link.id)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}
