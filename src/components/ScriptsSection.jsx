import Card from './Card'
import { scripts } from '../data/scripts'

const styleMap = {
  1: 'script-card-1',
  2: 'script-card-2',
  3: 'script-card-3',
  4: 'script-card-4',
}

export default function ScriptsSection({ searchQuery }) {
  const q = searchQuery.toLowerCase().trim()

  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))' }}>
      {scripts.map(script => {
        const text = `${script.title} ${script.description} ${script.badge}`.toLowerCase()
        const visible = !q || text.includes(q)
        return (
          <Card
            key={script.id}
            skill={script}
            className={`${styleMap[script.cardStyle] || ''} ${visible ? '' : 'card-hidden'}`}
          />
        )
      })}
    </div>
  )
}
