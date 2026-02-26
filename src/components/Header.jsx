import { useEffect, useState } from 'react'

export default function Header({ theme, onToggleTheme, skillCount, sharedCount, nivelCount }) {
  return (
    <div className="header">
      <h1>🧠 NORA Skills</h1>
      <p>{skillCount} skills · {sharedCount} shared · {nivelCount} niveles</p>
      <button
        className="theme-toggle"
        title="Cambiar tema"
        onClick={onToggleTheme}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  )
}
