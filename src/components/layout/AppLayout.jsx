import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth, showToast } from '../../App'

export default function AppLayout({ nav, schoolName, plan, base, title, children }) {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const cur = location.pathname.split('/').pop() || 'dashboard'

  const go = p => navigate(`${base}/${p}`)

  const handleLogout = () => { logout(); navigate('/login'); showToast('Logged out', 'info') }

  const today = new Date().toLocaleDateString('en-IN', { weekday:'short', year:'numeric', month:'short', day:'numeric' })

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎓</div>
          <div className="sidebar-logo-text">Edu<span>Sync</span></div>
        </div>
        {schoolName && (
          <div className="sidebar-school">
            <div className="sidebar-school-name">{schoolName}</div>
            <div className="sidebar-plan-badge">{plan || 'Basic'} Plan</div>
          </div>
        )}
        <nav className="sidebar-nav">
          {nav.map((item, i) =>
            item.section
              ? <div key={i} className="nav-section-label">{item.section}</div>
              : (
                <div
                  key={item.id}
                  className={`nav-item ${cur === item.id ? 'active' : ''}`}
                  onClick={() => go(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
                </div>
              )
          )}
        </nav>
        <div className="sidebar-footer">
          <div className="user-avatar">{user?.avatar || '👤'}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">⏻</button>
        </div>
      </aside>

      <div className="main-area">
        <div className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-date">{today}</div>
          <button className="notif-btn" onClick={() => showToast('No new notifications', 'info')}>
            🔔<div className="notif-dot" />
          </button>
        </div>
        <div className="page-content">{children}</div>
      </div>
    </div>
  )
}
