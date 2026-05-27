import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { StatCard, Modal, Badge, BirthdayBanner, ProgressBar } from '../../components/ui/UI'
import { DEMO_STUDENTS, DEMO_TEACHERS, DEMO_HOMEWORK, DEMO_ANNOUNCEMENTS, DEMO_PTM, DEMO_HOLIDAYS, DEMO_COMPLAINTS, DEMO_TODAY_ATT } from '../../data/demo'
import { showToast } from '../../App'

const NAV = [
  { section:'Overview'   },
  { id:'dashboard',     icon:'📊', label:'Dashboard'       },
  { id:'students',      icon:'👦', label:'Students'         },
  { id:'teachers',      icon:'👨‍🏫', label:'Teachers'         },
  { section:'Academics' },
  { id:'attendance',    icon:'✅', label:'Attendance',      badge:3 },
  { id:'homework',      icon:'📝', label:'Homework'         },
  { id:'marksheet',     icon:'📋', label:'Marksheet'        },
  { section:'Communication' },
  { id:'announcements', icon:'📣', label:'Announcements'    },
  { id:'ptm',           icon:'🤝', label:'PTM'              },
  { id:'complaints',    icon:'🎫', label:'Complaints',      badge:2 },
  { section:'School'   },
  { id:'holidays',      icon:'🏖️', label:'Holidays'         },
  { id:'birthdays',     icon:'🎂', label:'Birthdays'        },
]

const PAGE_TITLES = { dashboard:'Dashboard', students:'Students', teachers:'Teachers', attendance:'Attendance', homework:'Homework', marksheet:'Marksheet', announcements:'Announcements', ptm:'PTM', complaints:'Complaints', holidays:'Holidays', birthdays:'Birthdays' }

export default function AdminShell() {
  const cur = window.location.pathname.split('/').pop() || 'dashboard'
  return (
    <AppLayout nav={NAV} schoolName="St. Mary's School" plan="Basic" base="/admin" title={PAGE_TITLES[cur] || 'Dashboard'}>
      <Routes>
        <Route path="dashboard"     element={<Dashboard />}     />
        <Route path="students"      element={<Students />}       />
        <Route path="teachers"      element={<Teachers />}       />
        <Route path="attendance"    element={<Attendance />}     />
        <Route path="homework"      element={<Homework />}       />
        <Route path="marksheet"     element={<Marksheet />}      />
        <Route path="announcements" element={<Announcements />}  />
        <Route path="ptm"           element={<PTM />}            />
        <Route path="complaints"    element={<Complaints />}     />
        <Route path="holidays"      element={<Holidays />}       />
        <Route path="birthdays"     element={<Birthdays />}      />
        <Route path="*"             element={<Dashboard />}      />
      </Routes>
    </AppLayout>
  )
}

// ── SHARED HELPERS ────────────────────────────────────────────
const todayBdays = () => DEMO_STUDENTS.filter(s=>{const d=new Date(s.dob),t=new Date();return d.getMonth()===t.getMonth()&&d.getDate()===t.getDate()})
const avg = s => Math.round(Object.values(s.marks).reduce((a,b)=>a+b,0)/5)
const grade = a => a>=90?'A+':a>=80?'A':a>=70?'B+':'B'
const PLAN_BADGE = {National:'blue',Festival:'yellow',School:'green'}

// ── DASHBOARD ─────────────────────────────────────────────────
function Dashboard() {
  return (
    <>
      <BirthdayBanner students={todayBdays()} />
      <div className="stat-grid">
        <StatCard icon="👦"  label="Students"        value={DEMO_STUDENTS.length} sub="3 classes"           color="#4299e1" />
        <StatCard icon="👨‍🏫" label="Teachers"         value={DEMO_TEACHERS.length} sub="4 subjects"          color="#48bb78" />
        <StatCard icon="✅"  label="Today Attendance" value="89%"  sub="↓ 3% vs yesterday" subType="down"     color="#ed8936" />
        <StatCard icon="📝"  label="Pending Homework" value="3"    sub="Due this week"                        color="#9f7aea" />
        <StatCard icon="🎫"  label="Open Complaints"  value="2"    sub="Needs attention"   subType="down"     color="#f56565" />
        <StatCard icon="🤝"  label="Next PTM"         value="May 30" sub="4 slots confirmed"                  color="#4fd1c5" />
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-title">📣 Recent Announcements</div>
          {DEMO_ANNOUNCEMENTS.slice(0,3).map(a=>(
            <div key={a.id} style={{padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
              <div style={{fontSize:12.5,fontWeight:600,marginBottom:3}}>{a.title}</div>
              <div style={{fontSize:11,color:'var(--text3)'}}>{a.date} · <Badge type="blue">{a.target}</Badge></div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">🎫 Complaints</div>
          {DEMO_COMPLAINTS.map(c=>(
            <div key={c.id} style={{padding:'9px 0',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:12.5,fontWeight:600}}>{c.title}</div>
                <div style={{fontSize:11,color:'var(--text3)'}}>{c.raisedBy}</div>
              </div>
              <Badge type={c.status==='resolved'?'green':c.status==='in-progress'?'yellow':'red'}>{c.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ── STUDENTS ──────────────────────────────────────────────────
function Students() {
  const [search, setSearch] = useState('')
  const [modal,  setModal]  = useState(null)
  const filtered = DEMO_STUDENTS.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.class.includes(search))
  return (
    <>
      <div className="table-wrap">
        <div className="table-header">
          <div className="table-title">👦 Students ({DEMO_STUDENTS.length})</div>
          <div className="table-actions">
            <div className="search-wrap"><span className="search-icon">🔍</span><input className="form-input" style={{width:190}} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
            <button className="btn btn-primary" onClick={()=>setModal('add')}>+ Add</button>
          </div>
        </div>
        <table>
          <thead><tr><th>Name</th><th>Class</th><th>Parent</th><th>Attendance</th><th>Avg</th><th></th></tr></thead>
          <tbody>
            {filtered.map(s=>(
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td>
                <td><Badge type="blue">{s.class}</Badge></td>
                <td>{s.parent}</td>
                <td><div style={{display:'flex',alignItems:'center',gap:7}}><ProgressBar value={s.attendance}/><span style={{fontSize:12,fontWeight:600,minWidth:34}}>{s.attendance}%</span></div></td>
                <td style={{fontWeight:700,color:avg(s)>=80?'var(--accent2)':avg(s)>=60?'var(--warning)':'var(--danger)'}}>{avg(s)}%</td>
                <td><button className="btn btn-sm btn-outline" onClick={()=>setModal({t:'view',s})}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal==='add' && (
        <Modal title="👦 Add Student" onClose={()=>setModal(null)}>
          <div className="grid-2">
            <div className="form-row"><label className="form-label">Full Name</label><input className="form-input" placeholder="Student name"/></div>
            <div className="form-row"><label className="form-label">Class</label><select className="form-select"><option>8A</option><option>8B</option><option>7A</option><option>9A</option></select></div>
            <div className="form-row"><label className="form-label">Roll No.</label><input className="form-input" placeholder="007"/></div>
            <div className="form-row"><label className="form-label">Date of Birth</label><input className="form-input" type="date"/></div>
            <div className="form-row"><label className="form-label">Parent Name</label><input className="form-input"/></div>
            <div className="form-row"><label className="form-label">Parent Email</label><input className="form-input" type="email"/></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>{setModal(null);showToast('Student added!','success')}}>Add Student</button>
          </div>
        </Modal>
      )}
      {modal?.t==='view' && (
        <Modal title={`👦 ${modal.s.name}`} onClose={()=>setModal(null)}>
          <div className="grid-2" style={{marginBottom:14}}>
            {[['Class',modal.s.class],['Roll',modal.s.roll],['Attendance',modal.s.attendance+'%'],['Parent',modal.s.parent]].map(([k,v])=>(
              <div key={k} style={{background:'var(--surface2)',padding:12,borderRadius:9}}><div style={{fontSize:10,color:'var(--text3)'}}>{k}</div><div style={{fontWeight:700}}>{v}</div></div>
            ))}
          </div>
          <div style={{fontWeight:700,marginBottom:10}}>Subject Marks</div>
          {Object.entries(modal.s.marks).map(([sub,mark])=>(
            <div key={sub} style={{display:'flex',alignItems:'center',gap:10,marginBottom:9}}>
              <span style={{fontSize:12,textTransform:'capitalize',width:74}}>{sub}</span>
              <ProgressBar value={mark}/><span style={{fontSize:12,fontWeight:700,width:28}}>{mark}</span>
            </div>
          ))}
          <div className="modal-actions"><button className="btn btn-primary" onClick={()=>setModal(null)}>Close</button></div>
        </Modal>
      )}
    </>
  )
}

// ── TEACHERS ──────────────────────────────────────────────────
function Teachers() {
  const [modal, setModal] = useState(false)
  return (
    <>
      <div className="table-wrap">
        <div className="table-header"><div className="table-title">👨‍🏫 Teachers</div><button className="btn btn-primary" onClick={()=>setModal(true)}>+ Add</button></div>
        <table>
          <thead><tr><th>Name</th><th>Subject</th><th>Classes</th><th>Email</th><th>Phone</th></tr></thead>
          <tbody>{DEMO_TEACHERS.map(t=>(
            <tr key={t.id}><td><strong>{t.name}</strong></td><td><Badge type="blue">{t.subject}</Badge></td><td>{t.classes}</td><td style={{fontFamily:'monospace',fontSize:12}}>{t.email}</td><td style={{fontFamily:'monospace',fontSize:12}}>{t.phone}</td></tr>
          ))}</tbody>
        </table>
      </div>
      {modal && (
        <Modal title="👨‍🏫 Add Teacher" onClose={()=>setModal(false)}>
          <div className="grid-2">
            <div className="form-row"><label className="form-label">Name</label><input className="form-input"/></div>
            <div className="form-row"><label className="form-label">Subject</label><input className="form-input"/></div>
            <div className="form-row"><label className="form-label">Email</label><input className="form-input" type="email"/></div>
            <div className="form-row"><label className="form-label">Classes</label><input className="form-input" placeholder="8A, 8B"/></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>{setModal(false);showToast('Teacher added!','success')}}>Add</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── ATTENDANCE ─────────────────────────────────────────────────
function Attendance() {
  const [att, setAtt] = useState({...DEMO_TODAY_ATT})
  const cls = DEMO_STUDENTS.filter(s=>s.class==='8A')
  const p=Object.values(att).filter(v=>v.status==='present').length
  const ab=Object.values(att).filter(v=>v.status==='absent').length
  const l=Object.values(att).filter(v=>v.status==='late').length
  return (
    <>
      <div style={{display:'flex',gap:10,marginBottom:18,flexWrap:'wrap',alignItems:'center'}}>
        <select className="form-select" style={{width:'auto'}}><option>Class 8A</option><option>Class 8B</option><option>Class 7A</option></select>
        <input type="date" className="form-input" style={{width:'auto'}} defaultValue="2026-05-27"/>
        <button className="btn btn-green" onClick={()=>showToast('Attendance saved! Parents notified.','success')}>💾 Save</button>
        <button className="btn btn-outline" onClick={()=>showToast('Report exported!','success')}>📊 Export</button>
      </div>
      <div className="three-col" style={{marginBottom:18}}>
        {[[p,'Present','var(--accent2)'],[ab,'Absent','var(--danger)'],[l,'Late','var(--warning)']].map(([v,lb,c])=>(
          <div key={lb} className="card" style={{textAlign:'center',padding:16,margin:0}}><div style={{fontSize:28,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:12,color:'var(--text3)'}}>{lb}</div></div>
        ))}
      </div>
      <div className="att-grid">
        {cls.map(s=>{
          const st=att[s.roll]?.status||''
          return (
            <div key={s.id} className="att-card">
              <div><div className="att-name">{s.name}</div><div className="att-roll">Roll: {s.roll}</div></div>
              <div className="att-btns">
                {['present','absent','late'].map(status=>(
                  <div key={status} className={`att-btn ${st===status?status:''}`} onClick={()=>setAtt(a=>({...a,[s.roll]:{status}}))}>
                    {status[0].toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ── HOMEWORK ──────────────────────────────────────────────────
function Homework() {
  const [modal, setModal] = useState(false)
  return (
    <>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:14}}><button className="btn btn-primary" onClick={()=>setModal(true)}>+ Assign</button></div>
      {DEMO_HOMEWORK.map(h=>(
        <div key={h.id} style={{background:'#fff',borderRadius:'var(--radius)',padding:'16px 18px',boxShadow:'var(--shadow)',marginBottom:9,display:'flex',gap:13,alignItems:'flex-start'}}>
          <div style={{width:42,height:42,borderRadius:9,background:h.color+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0}}>{h.icon}</div>
          <div style={{flex:1}}><div style={{fontWeight:600,marginBottom:3}}>{h.title}</div><div style={{fontSize:11.5,color:'var(--text3)'}}>{h.subject} · Class {h.class} · {h.teacher}</div></div>
          <div style={{textAlign:'right',flexShrink:0}}>
            <div style={{fontSize:11,fontWeight:600,marginBottom:5,padding:'3px 8px',borderRadius:20,background:new Date(h.dueDate)<=new Date(Date.now()+2*864e5)?'#f8d7da':'#d4edda',color:new Date(h.dueDate)<=new Date(Date.now()+2*864e5)?'#721c24':'#155724'}}>Due {h.dueDate}</div>
            <Badge type={h.status==='submitted'?'green':'yellow'}>{h.status}</Badge>
          </div>
        </div>
      ))}
      {modal && (
        <Modal title="📝 Assign Homework" onClose={()=>setModal(false)}>
          <div className="form-row"><label className="form-label">Title</label><input className="form-input" placeholder="Homework title"/></div>
          <div className="grid-2">
            <div className="form-row"><label className="form-label">Subject</label><select className="form-select"><option>Mathematics</option><option>Science</option><option>English</option></select></div>
            <div className="form-row"><label className="form-label">Class</label><select className="form-select"><option>8A</option><option>8B</option><option>7A</option></select></div>
            <div className="form-row"><label className="form-label">Due Date</label><input className="form-input" type="date"/></div>
          </div>
          <div className="form-row"><label className="form-label">Description</label><textarea className="form-textarea" placeholder="Describe the homework..."/></div>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>{setModal(false);showToast('Homework assigned!','success')}}>Assign</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── MARKSHEET ─────────────────────────────────────────────────
function Marksheet() {
  const [modal, setModal] = useState(false)
  const cls = DEMO_STUDENTS.filter(s=>s.class==='8A')
  return (
    <>
      <div style={{display:'flex',gap:10,marginBottom:14,flexWrap:'wrap'}}>
        <select className="form-select" style={{width:'auto'}}><option>Class 8A</option><option>8B</option></select>
        <select className="form-select" style={{width:'auto'}}><option>Term 1</option><option>Mid Term</option><option>Final</option></select>
        <button className="btn btn-outline" onClick={()=>showToast('Exported!','success')}>📊 Export</button>
        <button className="btn btn-primary" onClick={()=>setModal(true)}>+ Enter Marks</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Student</th><th>Math</th><th>Sci</th><th>Eng</th><th>His</th><th>Geo</th><th>Avg</th><th>Grade</th></tr></thead>
          <tbody>{cls.map(s=>{
            const a=avg(s),g=grade(a)
            return (
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td>
                {Object.values(s.marks).map((m,i)=><td key={i} style={{fontWeight:600,color:m>=80?'var(--accent2)':m>=60?'var(--warning)':'var(--danger)'}}>{m}</td>)}
                <td><strong>{a}%</strong></td>
                <td><Badge type="green">{g}</Badge></td>
              </tr>
            )
          })}</tbody>
        </table>
      </div>
      {modal && (
        <Modal title="📋 Enter Marks" onClose={()=>setModal(false)} wide>
          <div className="grid-2" style={{marginBottom:14}}>
            <div className="form-row"><label className="form-label">Class</label><select className="form-select"><option>8A</option></select></div>
            <div className="form-row"><label className="form-label">Subject</label><select className="form-select"><option>Mathematics</option></select></div>
            <div className="form-row"><label className="form-label">Exam Type</label><select className="form-select"><option>Unit Test</option><option>Mid Term</option><option>Final</option></select></div>
            <div className="form-row"><label className="form-label">Max Marks</label><input className="form-input" type="number" defaultValue={100}/></div>
          </div>
          {cls.map(s=>(
            <div key={s.id} style={{display:'flex',alignItems:'center',gap:12,marginBottom:9}}>
              <div style={{flex:1,fontSize:13}}>{s.name}</div>
              <input type="number" min={0} max={100} className="form-input" style={{width:90}} placeholder="0-100"/>
            </div>
          ))}
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>{setModal(false);showToast('Marks saved!','success')}}>Save Marks</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── ANNOUNCEMENTS ─────────────────────────────────────────────
function Announcements() {
  const [modal, setModal] = useState(false)
  return (
    <>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:14}}><button className="btn btn-primary" onClick={()=>setModal(true)}>+ New</button></div>
      {DEMO_ANNOUNCEMENTS.map(a=>(
        <div key={a.id} className={`ann-card ${a.important?'important':''}`}>
          {a.important && <span style={{fontSize:10,fontWeight:700,background:'var(--accent)',color:'var(--primary)',padding:'2px 8px',borderRadius:20,display:'inline-block',marginBottom:7}}>📌 IMPORTANT</span>}
          <div style={{fontWeight:700,marginBottom:5}}>{a.title}</div>
          <div style={{fontSize:12.5,color:'var(--text2)',lineHeight:1.6,marginBottom:9}}>{a.body}</div>
          <div style={{display:'flex',alignItems:'center',gap:10,fontSize:11,color:'var(--text3)'}}>
            <span>📅 {a.date}</span><span>👤 {a.author}</span><Badge type="blue">{a.target}</Badge>
          </div>
        </div>
      ))}
      {modal && (
        <Modal title="📣 New Announcement" onClose={()=>setModal(false)}>
          <div className="form-row"><label className="form-label">Title</label><input className="form-input"/></div>
          <div className="form-row"><label className="form-label">Message</label><textarea className="form-textarea" placeholder="Write your announcement..."/></div>
          <div className="grid-2">
            <div className="form-row"><label className="form-label">Target</label><select className="form-select"><option>all</option><option>students</option><option>parents</option><option>teachers</option></select></div>
            <div className="form-row"><label className="form-label">Priority</label><select className="form-select"><option>Normal</option><option>Important</option></select></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>{setModal(false);showToast('Announcement posted! All notified.','success')}}>Post</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── PTM ───────────────────────────────────────────────────────
function PTM() {
  const [modal, setModal] = useState(false)
  const conf = DEMO_PTM.filter(p=>p.status==='confirmed').length
  return (
    <>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,flexWrap:'wrap',gap:10}}>
        <div><div style={{fontSize:17,fontWeight:700}}>📅 May 30, 2026 — PTM Day</div><div style={{fontSize:12.5,color:'var(--text3)'}}>9:00 AM – 1:00 PM · School Hall</div></div>
        <button className="btn btn-primary" onClick={()=>setModal(true)}>+ Schedule PTM</button>
      </div>
      <div className="three-col" style={{marginBottom:18}}>
        {[[conf,'Confirmed','var(--accent2)'],[DEMO_PTM.length-conf,'Pending','var(--warning)'],[DEMO_PTM.length,'Total','var(--primary)']].map(([v,lb,c])=>(
          <div key={lb} className="card" style={{textAlign:'center',padding:16,margin:0}}><div style={{fontSize:26,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:12,color:'var(--text3)'}}>{lb}</div></div>
        ))}
      </div>
      {DEMO_PTM.map(p=>(
        <div key={p.id} className="ptm-card">
          <div style={{textAlign:'center',minWidth:48}}><div className="ptm-day">30</div><div className="ptm-mon">May</div></div>
          <div style={{flex:1}}><div style={{fontWeight:600}}>👨‍👩‍👦 {p.parent} → 👨‍🏫 {p.teacher}</div><div style={{fontSize:11.5,color:'var(--text3)',marginTop:3}}>Re: {p.student} · Class {p.class}</div></div>
          <div style={{textAlign:'right'}}><div style={{fontWeight:600,color:'var(--primary)',marginBottom:4}}>{p.time}</div><Badge type={p.status==='confirmed'?'green':'yellow'}>{p.status}</Badge></div>
        </div>
      ))}
      {modal && (
        <Modal title="🤝 Schedule PTM" onClose={()=>setModal(false)}>
          <div className="form-row"><label className="form-label">Date</label><input className="form-input" type="date" defaultValue="2026-05-30"/></div>
          <div className="grid-2">
            <div className="form-row"><label className="form-label">Start</label><input className="form-input" type="time" defaultValue="09:00"/></div>
            <div className="form-row"><label className="form-label">End</label><input className="form-input" type="time" defaultValue="13:00"/></div>
            <div className="form-row"><label className="form-label">Slot Duration</label><select className="form-select"><option>15 min</option><option>20 min</option><option>30 min</option></select></div>
            <div className="form-row"><label className="form-label">Venue</label><input className="form-input" defaultValue="School Hall"/></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>{setModal(false);showToast('PTM scheduled! Parents notified.','success')}}>Schedule & Notify</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── COMPLAINTS ────────────────────────────────────────────────
function Complaints() {
  const [list, setList] = useState(DEMO_COMPLAINTS)
  const upd = (id,status) => { setList(c=>c.map(x=>x.id===id?{...x,status}:x)); showToast(`Complaint ${status==='resolved'?'resolved':'updated'}!`,'success') }
  return (
    <>
      {list.map(c=>(
        <div key={c.id} className="complaint-card">
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:10,marginBottom:7}}>
            <div style={{fontWeight:700}}>{c.title}</div>
            <div style={{display:'flex',gap:6,flexShrink:0}}>
              <Badge type={c.priority==='high'?'red':c.priority==='medium'?'yellow':'gray'}>{c.priority}</Badge>
              <Badge type={c.status==='resolved'?'green':c.status==='in-progress'?'yellow':'red'}>{c.status}</Badge>
            </div>
          </div>
          <div style={{fontSize:12.5,color:'var(--text2)',lineHeight:1.6,marginBottom:9}}>{c.body}</div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:7}}>
            <div style={{fontSize:11,color:'var(--text3)'}}>By {c.raisedBy} · {c.date}</div>
            {c.status!=='resolved' && (
              <div style={{display:'flex',gap:7}}>
                {c.status==='open'&&<button className="btn btn-sm btn-yellow" onClick={()=>upd(c.id,'in-progress')}>Start Review</button>}
                <button className="btn btn-sm btn-green" onClick={()=>upd(c.id,'resolved')}>✓ Resolve</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  )
}

// ── HOLIDAYS ──────────────────────────────────────────────────
function Holidays() {
  const [modal, setModal] = useState(false)
  return (
    <>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:14,gap:9}}>
        <button className="btn btn-outline" onClick={()=>showToast('Downloaded!','success')}>⬇️ Download</button>
        <button className="btn btn-primary" onClick={()=>setModal(true)}>+ Add Holiday</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Holiday</th><th>Date</th><th>Day</th><th>Type</th></tr></thead>
          <tbody>{DEMO_HOLIDAYS.map(h=>{
            const d=new Date(h.date),day=d.toLocaleString('default',{weekday:'long'})
            return (<tr key={h.id} style={{opacity:d<new Date()?0.5:1}}><td><strong>{h.name}</strong></td><td>{h.date}</td><td>{day}</td><td><Badge type={PLAN_BADGE[h.type]||'gray'}>{h.type}</Badge></td></tr>)
          })}</tbody>
        </table>
      </div>
      {modal && (
        <Modal title="🏖️ Add Holiday" onClose={()=>setModal(false)}>
          <div className="form-row"><label className="form-label">Holiday Name</label><input className="form-input" placeholder="e.g. Diwali"/></div>
          <div className="grid-2">
            <div className="form-row"><label className="form-label">Date</label><input className="form-input" type="date"/></div>
            <div className="form-row"><label className="form-label">Type</label><select className="form-select"><option>National</option><option>Festival</option><option>School</option></select></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>{setModal(false);showToast('Holiday added!','success')}}>Add</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ── BIRTHDAYS ─────────────────────────────────────────────────
function Birthdays() {
  const [wishing, setWishing] = useState(null)
  const today = new Date()
  return (
    <>
      <BirthdayBanner students={todayBdays()} />
      <div className="table-wrap">
        <div className="table-header"><div className="table-title">🎂 All Birthdays</div></div>
        <table>
          <thead><tr><th>Student</th><th>Class</th><th>Birthday</th><th>Days Away</th><th>Action</th></tr></thead>
          <tbody>{DEMO_STUDENTS.sort((a,b)=>new Date(a.dob)-new Date(b.dob)).map(s=>{
            const d=new Date(s.dob),next=new Date(today.getFullYear(),d.getMonth(),d.getDate())
            if(next<today) next.setFullYear(today.getFullYear()+1)
            const days=Math.ceil((next-today)/864e5)
            return (
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td><td>{s.class}</td>
                <td>{d.toLocaleDateString('en-IN',{day:'numeric',month:'long'})}</td>
                <td><Badge type={days===0?'yellow':days<=7?'blue':'gray'}>{days===0?'Today!':days+' days'}</Badge></td>
                <td><button className="btn btn-sm btn-yellow" onClick={()=>setWishing(s)}>🎉 Send Wish</button></td>
              </tr>
            )
          })}</tbody>
        </table>
      </div>
      {wishing && (
        <Modal title={`🎂 Birthday Wish — ${wishing.name}`} onClose={()=>setWishing(null)}>
          <div style={{textAlign:'center',padding:'14px 0'}}><div style={{fontSize:46}}>🎉</div><div style={{fontWeight:700,marginTop:7}}>Happy Birthday, {wishing.name}!</div></div>
          <div className="form-row"><label className="form-label">Message</label><textarea className="form-textarea" defaultValue={`🎂 Wishing you a very Happy Birthday ${wishing.name}! May this special day bring lots of joy! 🎉`}/></div>
          <div className="form-row"><label className="form-label">Send Via</label><select className="form-select"><option>📧 Email</option><option>📱 SMS</option><option>Both</option></select></div>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setWishing(null)}>Cancel</button>
            <button className="btn btn-yellow" onClick={()=>{setWishing(null);showToast(`Birthday wish sent to ${wishing.name}! 🎂`,'success')}}>Send Wish 🎉</button>
          </div>
        </Modal>
      )}
    </>
  )
}
