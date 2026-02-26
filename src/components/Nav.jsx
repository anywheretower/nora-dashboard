import { navLinks } from '../data/nav'

export default function Nav({ activeSection, searchQuery, onSearchChange }) {

  const handleClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
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
      {navLinks.map(link => (
        <a
          key={link.id}
          href={`#${link.id}`}
          data-section={link.id}
          className={activeSection === link.id ? 'spy-active' : ''}
          onClick={e => handleClick(e, link.id)}
        >
          {link.label}
        </a>
      ))}
    </nav>
  )
}
