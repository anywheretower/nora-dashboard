import { cronJobs } from '../data/crons'

export default function CronTable({ searchQuery }) {
  const q = searchQuery.toLowerCase().trim()

  return (
    <div className="cron-table-wrap">
      <table className="cron-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Skill</th>
            <th>Horario</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {cronJobs.map(job => {
            const text = `${job.id} ${job.skill} ${job.schedule} ${job.description}`.toLowerCase()
            const visible = !q || text.includes(q)
            return (
              <tr key={job.id} style={{ opacity: 0.5, display: visible ? '' : 'none' }}>
                <td className="cron-id">{job.id}</td>
                <td className="cron-skill">{job.skill}</td>
                <td className="cron-schedule">{job.schedule}</td>
                <td>{job.description}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
