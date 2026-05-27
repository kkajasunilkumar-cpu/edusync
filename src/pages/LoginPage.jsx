import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, showToast } from '../App'

const ROLES = [
  { id:'superadmin', icon:'🛡️', label:'Super Admin', path:'/superadmin/dashboard' },
  { id:'admin',      icon:'👨‍💼', label:'Admin',       path:'/admin/dashboard'      },
  { id:'teacher',    icon:'👨‍🏫', label:'Teacher',     path:'/teacher/dashboard'    },
  { id:'parent',     icon:'👨‍👩‍👦', label:'Parent',      path:'/parent/dashboard'     },
  { id:'student',    icon:'👦',  label:'Student',     path:'/student/dashboard'    },
]
const USERS = {
  superadmin: { name:'Arjun (Owner)',    role:'superadmin', avatar:'🛡️' },
  admin:      { name:'Admin User',       role:'admin',      avatar:'👨‍💼' },
  teacher:    { name:'Mrs. Kavitha Rao', role:'teacher',    avatar:'👨‍🏫' },
  parent:     { name:'Rajesh Sharma',    role:'parent',     avatar:'👨‍👩‍👦' },
  student:    { name:'Aarav Sharma',     role:'student',    avatar:'👦'  },
}

export default function LoginPage() {
  const [role, setRole]     = useState('admin')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    login(USERS[role])
    showToast(`Welcome, ${USERS[role].name}! 👋`, 'success')
    navigate(ROLES.find(r2 => r2.id === role).path)
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🎓</div>
          <div className="auth-logo-text">Edu<span>Sync</span></div>
        </div>
        <div style={{ fontSize:24, fontWeight:700, marginBottom:4 }}>Welcome back</div>
        <div style={{ color:'var(--text3)', fontSize:13, marginBottom:26 }}>Sign in to your school dashboard</div>

        <div style={{ marginBottom:20 }}>
          <label className="form-label">SELECT YOUR ROLE</label>
          <div className="role-grid">
            {ROLES.map(r => (
              <div key={r.id} className={`role-btn ${role===r.id?'active':''}`} onClick={() => setRole(r.id)}>
                <div className="ri">{r.icon}</div>
                <div className="rn">{r.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label">EMAIL ADDRESS</label>
          <input className="form-input" type="email" defaultValue="admin@stmarys.edu" placeholder="you@school.edu" />
        </div>
        <div className="form-row">
          <label className="form-label">PASSWORD</label>
          <input className="form-input" type="password" defaultValue="demo1234" placeholder="••••••••" />
        </div>

        <button className="btn-auth" onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In to Dashboard →'}
        </button>
        <div className="auth-demo">
          Demo Mode — <strong onClick={handleLogin}>Click Sign In</strong> to explore
        </div>
      </div>
    </div>
  )
}
