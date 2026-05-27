import React, { createContext, useContext, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LoginPage       from './pages/LoginPage'
import SuperAdminShell from './pages/superadmin/SuperAdminShell'
import AdminShell      from './pages/admin/AdminShell'
import { TeacherShell, ParentShell, StudentShell } from './pages/roles/TeacherShell'

// ── AUTH CONTEXT ────────────────────────────────────────
const AuthCtx  = createContext(null)
export const useAuth = () => useContext(AuthCtx)

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('edu_user')) } catch { return null }
  })
  const login  = u => { setUser(u); sessionStorage.setItem('edu_user', JSON.stringify(u)) }
  const logout = ()  => { setUser(null); sessionStorage.removeItem('edu_user') }
  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>
}

function RequireAuth({ role, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  return children
}

// ── TOAST SYSTEM ────────────────────────────────────────
export function showToast(msg, type = 'info') {
  const icons = { success:'✅', error:'❌', info:'ℹ️' }
  const wrap = document.getElementById('toast-root')
  if (!wrap) return
  const el = document.createElement('div')
  el.className = `toast ${type}`
  el.innerHTML = `${icons[type]||'ℹ️'} ${msg}`
  wrap.appendChild(el)
  setTimeout(() => el.remove(), 3500)
}

// ── APP ──────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/superadmin/*" element={<RequireAuth role="superadmin"><SuperAdminShell /></RequireAuth>} />
        <Route path="/admin/*"      element={<RequireAuth role="admin">     <AdminShell />      </RequireAuth>} />
        <Route path="/teacher/*"    element={<RequireAuth role="teacher">   <TeacherShell />    </RequireAuth>} />
        <Route path="/parent/*"     element={<RequireAuth role="parent">    <ParentShell />     </RequireAuth>} />
        <Route path="/student/*"    element={<RequireAuth role="student">   <StudentShell />    </RequireAuth>} />
        <Route path="*"             element={<Navigate to="/login" replace />} />
      </Routes>
      <div id="toast-root" className="toast-container" />
    </AuthProvider>
  )
}
