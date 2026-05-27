import { createClient } from '@supabase/supabase-js'

// ── Replace these values after Supabase setup ──────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = SUPABASE_URL
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null

export const IS_DEMO = !SUPABASE_URL

// ── AUTH ────────────────────────────────────────────────────────
export async function signIn(email, password) {
  if (IS_DEMO) return { user: { id: 'demo' } }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  if (IS_DEMO) return
  await supabase.auth.signOut()
}

export async function getCurrentUser() {
  if (IS_DEMO) return null
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('users').select('*,schools(name,plan)').eq('id', user.id).single()
  return data
}

// ── STUDENTS ────────────────────────────────────────────────────
export async function getStudents(schoolId) {
  if (IS_DEMO) { const { DEMO_STUDENTS } = await import('../data/demo.js'); return DEMO_STUDENTS }
  const { data, error } = await supabase.from('students').select('*').eq('school_id', schoolId).order('name')
  if (error) throw error; return data
}

export async function addStudent(s) {
  const { data, error } = await supabase.from('students').insert(s).select().single()
  if (error) throw error; return data
}

// ── ATTENDANCE ──────────────────────────────────────────────────
export async function saveAttendance(records) {
  if (IS_DEMO) return
  const { error } = await supabase.from('attendance').upsert(records, { onConflict:'student_id,date' })
  if (error) throw error
}

// ── HOMEWORK ────────────────────────────────────────────────────
export async function getHomework(schoolId) {
  if (IS_DEMO) { const { DEMO_HOMEWORK } = await import('../data/demo.js'); return DEMO_HOMEWORK }
  const { data, error } = await supabase.from('homework').select('*,users(name)').eq('school_id', schoolId).order('due_date')
  if (error) throw error; return data
}

export async function addHomework(hw) {
  const { data, error } = await supabase.from('homework').insert(hw).select().single()
  if (error) throw error; return data
}

// ── ANNOUNCEMENTS ───────────────────────────────────────────────
export async function getAnnouncements(schoolId, role) {
  if (IS_DEMO) { const { DEMO_ANNOUNCEMENTS } = await import('../data/demo.js'); return DEMO_ANNOUNCEMENTS }
  let q = supabase.from('announcements').select('*,users(name)').eq('school_id', schoolId).order('created_at', { ascending:false })
  if (role && role !== 'admin') q = q.or(`target_role.eq.all,target_role.eq.${role}`)
  const { data, error } = await q
  if (error) throw error; return data
}

// ── COMPLAINTS ──────────────────────────────────────────────────
export async function updateComplaintStatus(id, status) {
  if (IS_DEMO) return
  const { error } = await supabase.from('complaints').update({ status }).eq('id', id)
  if (error) throw error
}

// ── SUPERADMIN ──────────────────────────────────────────────────
export async function getAllSchools() {
  if (IS_DEMO) { const { DEMO_SCHOOLS } = await import('../data/demo.js'); return DEMO_SCHOOLS }
  const { data, error } = await supabase.from('school_stats').select('*').order('created_at', { ascending:false })
  if (error) throw error; return data
}
