import React from 'react'
import { showToast } from '../../App'

export function Modal({ title, children, onClose, wide }) {
  return (
    <div className="modal-overlay" onClick={e => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className={`modal ${wide ? 'modal-wide' : ''}`}>
        <div className="modal-title">{title}</div>
        {children}
      </div>
    </div>
  )
}

export function StatCard({ icon, label, value, sub, subType, color }) {
  return (
    <div className="stat-card">
      <div className="stat-bg" style={{ background: color || '#4299e1' }} />
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className={`stat-sub ${subType || ''}`}>{sub}</div>}
    </div>
  )
}

export function Badge({ children, type }) {
  return <span className={`badge badge-${type || 'gray'}`}>{children}</span>
}

export function ProgressBar({ value }) {
  const bg = value >= 80 ? 'var(--accent2)' : value >= 60 ? 'var(--warning)' : 'var(--danger)'
  return (
    <div className="progress-bar" style={{ flex: 1, minWidth: 60 }}>
      <div className="progress-fill" style={{ width: `${value}%`, background: bg }} />
    </div>
  )
}

export function BirthdayBanner({ students }) {
  if (!students?.length) return null
  return (
    <div className="birthday-banner">
      <div style={{ fontSize: 13, fontWeight: 700, opacity: .8, marginBottom: 4 }}>🎂 Today's Birthdays!</div>
      <div style={{ fontSize: 20, fontWeight: 800 }}>Wishing a wonderful day to our students!</div>
      <div className="birthday-list">
        {students.map(s => (
          <div key={s.id} className="birthday-chip">
            <div className="birthday-chip-name">{s.name}</div>
            <div className="birthday-chip-class">Class {s.class}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function EmptyState({ icon, text }) {
  return <div className="empty-state"><div className="ei">{icon || '📭'}</div><div>{text || 'No data'}</div></div>
}
