import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { StatCard, Modal, Badge } from '../../components/ui/UI'
import { DEMO_SCHOOLS, DEMO_REVENUE, DEMO_PLAN_DIST } from '../../data/demo'
import { showToast } from '../../App'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const NAV = [
  { section:'Overview'    },
  { id:'dashboard', icon:'📊', label:'Dashboard'       },
  { id:'schools',   icon:'🏫', label:'All Schools'     },
  { id:'revenue',   icon:'💰', label:'Revenue & MRR'  },
  { id:'users',     icon:'👥', label:'All Users'       },
  { section:'Management' },
  { id:'plans',     icon:'📦', label:'Plan Management' },
  { id:'support',   icon:'🎫', label:'Support Tickets' },
]
const PLAN_BADGE  = { basic:'blue', pro:'green', premium:'orange', enterprise:'purple' }

export default function SuperAdminShell() {
  const titles = { dashboard:'Super Admin Dashboard', schools:'All Schools', revenue:'Revenue & MRR', users:'All Users', plans:'Plan Management', support:'Support Tickets' }
  const [page, setPage] = useState('dashboard')
  const cur = window.location.pathname.split('/').pop() || 'dashboard'
  return (
    <AppLayout nav={NAV} schoolName="EduSync HQ" plan="Owner" base="/superadmin" title={titles[cur] || 'Dashboard'}>
      <Routes>
        <Route path="dashboard" element={<SADash />}    />
        <Route path="schools"   element={<SASchools />} />
        <Route path="revenue"   element={<SARevenue />} />
        <Route path="users"     element={<SAUsers />}   />
        <Route path="plans"     element={<SAPlans />}   />
        <Route path="support"   element={<SASupport />} />
        <Route path="*"         element={<SADash />}    />
      </Routes>
    </AppLayout>
  )
}

function SADash() {
  const active = DEMO_SCHOOLS.filter(s=>s.status==='active')
  const mrr    = active.reduce((a,s)=>a+s.mrr,0)
  const students = DEMO_SCHOOLS.reduce((a,s)=>a+s.students,0)
  return (
    <>
      <div className="stat-grid">
        <StatCard icon="🏫" label="Total Schools"      value={DEMO_SCHOOLS.length} sub={`${active.length} active`} subType="up" color="#4299e1" />
        <StatCard icon="👦" label="Total Students"     value={students.toLocaleString()} sub="Across all schools"       color="#48bb78" />
        <StatCard icon="💰" label="Monthly Revenue"    value={`₹${mrr.toLocaleString()}`} sub="↑ 18% vs last month" subType="up" color="#ed8936" />
        <StatCard icon="🆕" label="Trial Schools"      value={DEMO_SCHOOLS.filter(s=>s.status==='trial').length} sub="Convert to paid" subType="down" color="#9f7aea" />
        <StatCard icon="📈" label="Annual Run Rate"    value={`₹${(mrr*12/100000).toFixed(1)}L`} sub="Projected ARR"    color="#f56565" />
        <StatCard icon="🏦" label="Avg MRR/School"     value={`₹${Math.round(mrr/active.length).toLocaleString()}`} sub="Per active school" color="#4fd1c5" />
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-title">📈 MRR Growth</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={DEMO_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{fontSize:10}} />
              <YAxis tick={{fontSize:10}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v=>[`₹${v.toLocaleString()}`,'MRR']} />
              <Line type="monotone" dataKey="mrr" stroke="var(--primary)" strokeWidth={2.5} dot={{r:3}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title">📦 Schools by Plan</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={DEMO_PLAN_DIST} cx="50%" cy="50%" outerRadius={75} dataKey="count" label={({plan,count})=>`${plan}(${count})`} labelLine={false}>
                {DEMO_PLAN_DIST.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="table-wrap">
        <div className="table-header"><div className="table-title">🏫 Recent Schools</div></div>
        <table>
          <thead><tr><th>School</th><th>City</th><th>Plan</th><th>Students</th><th>MRR</th><th>Status</th></tr></thead>
          <tbody>
            {DEMO_SCHOOLS.slice(0,5).map(s=>(
              <tr key={s.id}>
                <td><div style={{display:'flex',alignItems:'center',gap:9}}><div className="school-row-logo">{s.logo}</div><strong>{s.name}</strong></div></td>
                <td>{s.city}</td>
                <td><Badge type={PLAN_BADGE[s.plan]}>{s.plan}</Badge></td>
                <td>{s.students}</td>
                <td style={{fontWeight:700,color:'var(--accent2)'}}>₹{s.mrr.toLocaleString()}</td>
                <td><Badge type={s.status==='active'?'green':s.status==='trial'?'yellow':'red'}>{s.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function SASchools() {
  const [search, setSearch] = useState('')
  const [modal, setModal]   = useState(null)
  const filtered = DEMO_SCHOOLS.filter(s=>s.name.toLowerCase().includes(search.toLowerCase())||s.city.toLowerCase().includes(search.toLowerCase()))
  return (
    <>
      <div className="table-wrap">
        <div className="table-header">
          <div className="table-title">🏫 All Schools ({DEMO_SCHOOLS.length})</div>
          <div className="table-actions">
            <div className="search-wrap"><span className="search-icon">🔍</span><input className="form-input" style={{width:200}} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
            <button className="btn btn-primary" onClick={()=>setModal('add')}>+ Add School</button>
          </div>
        </div>
        <table>
          <thead><tr><th>School</th><th>City</th><th>Plan</th><th>Students</th><th>Teachers</th><th>MRR</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(s=>(
              <tr key={s.id}>
                <td><div style={{display:'flex',alignItems:'center',gap:9}}><div className="school-row-logo">{s.logo}</div><strong>{s.name}</strong></div></td>
                <td>{s.city}</td>
                <td><Badge type={PLAN_BADGE[s.plan]}>{s.plan}</Badge></td>
                <td>{s.students}</td><td>{s.teachers}</td>
                <td style={{fontWeight:700,color:'var(--accent2)'}}>₹{s.mrr.toLocaleString()}</td>
                <td><Badge type={s.status==='active'?'green':s.status==='trial'?'yellow':'red'}>{s.status}</Badge></td>
                <td>
                  <div style={{display:'flex',gap:5}}>
                    <button className="btn btn-sm btn-outline" onClick={()=>setModal({t:'view',s})}>View</button>
                    <button className="btn btn-sm btn-primary" onClick={()=>setModal({t:'plan',s})}>Plan</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal==='add' && (
        <Modal title="🏫 Add School" onClose={()=>setModal(null)}>
          <div className="grid-2">
            <div className="form-row"><label className="form-label">School Name</label><input className="form-input" placeholder="School name"/></div>
            <div className="form-row"><label className="form-label">City</label><input className="form-input" placeholder="Mumbai"/></div>
            <div className="form-row"><label className="form-label">Admin Email</label><input className="form-input" type="email"/></div>
            <div className="form-row"><label className="form-label">Plan</label><select className="form-select"><option>basic</option><option>pro</option><option>premium</option></select></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>{setModal(null);showToast('School added! Welcome email sent.','success')}}>Add School</button>
          </div>
        </Modal>
      )}
      {modal?.t==='view' && (
        <Modal title={`🏫 ${modal.s.name}`} onClose={()=>setModal(null)} wide>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:18}}>
            {[['Plan',modal.s.plan],['City',modal.s.city],['Status',modal.s.status],['Students',modal.s.students],['Teachers',modal.s.teachers],['MRR',`₹${modal.s.mrr.toLocaleString()}`]].map(([k,v])=>(
              <div key={k} style={{background:'var(--surface2)',padding:12,borderRadius:9}}>
                <div style={{fontSize:10,color:'var(--text3)'}}>{k}</div><div style={{fontWeight:700}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>
            <button className="btn btn-primary" onClick={()=>showToast('Logged in as school admin','info')}>Login as Admin</button>
            <button className="btn btn-green"   onClick={()=>showToast('Email sent!','success')}>Send Email</button>
            <button className="btn btn-danger"  onClick={()=>{setModal(null);showToast('School suspended!','error')}}>Suspend</button>
          </div>
          <div className="modal-actions"><button className="btn btn-outline" onClick={()=>setModal(null)}>Close</button></div>
        </Modal>
      )}
      {modal?.t==='plan' && (
        <Modal title={`📦 Change Plan — ${modal.s.name}`} onClose={()=>setModal(null)}>
          <div className="form-row"><label className="form-label">Current Plan</label><Badge type={PLAN_BADGE[modal.s.plan]}>{modal.s.plan}</Badge></div>
          <div className="form-row"><label className="form-label">New Plan</label><select className="form-select">{['basic','pro','premium','enterprise'].map(p=><option key={p}>{p}</option>)}</select></div>
          <div className="form-row"><label className="form-label">Notes</label><textarea className="form-textarea" placeholder="Reason for change..."/></div>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>{setModal(null);showToast('Plan updated!','success')}}>Update Plan</button>
          </div>
        </Modal>
      )}
    </>
  )
}

function SARevenue() {
  const mrr = DEMO_SCHOOLS.filter(s=>s.status==='active').reduce((a,s)=>a+s.mrr,0)
  return (
    <>
      <div className="stat-grid">
        <StatCard icon="💰" label="Current MRR"       value={`₹${mrr.toLocaleString()}`}           sub="Monthly Recurring Revenue" color="#48bb78" />
        <StatCard icon="📅" label="Annual Run Rate"   value={`₹${(mrr*12/100000).toFixed(1)}L`}    sub="Projected ARR"             color="#4299e1" />
        <StatCard icon="📉" label="Churn This Month"  value="1"    sub="₹1,999 lost"   subType="down" color="#eb3b5a" />
        <StatCard icon="📈" label="New MRR This Month" value="₹4,499" sub="1 new school" subType="up"  color="#ed8936" />
      </div>
      <div className="card">
        <div className="card-title">📈 MRR Growth</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={DEMO_REVENUE}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{fontSize:11}} />
            <YAxis tick={{fontSize:11}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={v=>[`₹${v.toLocaleString()}`,'MRR']} />
            <Bar dataKey="mrr" fill="var(--primary)" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="table-wrap">
        <div className="table-header"><div className="table-title">💰 Revenue by School</div></div>
        <table>
          <thead><tr><th>School</th><th>Plan</th><th>MRR</th><th>Status</th></tr></thead>
          <tbody>{DEMO_SCHOOLS.sort((a,b)=>b.mrr-a.mrr).map(s=>(
            <tr key={s.id}>
              <td><strong>{s.name}</strong></td>
              <td><Badge type={PLAN_BADGE[s.plan]}>{s.plan}</Badge></td>
              <td style={{fontWeight:700,color:'var(--accent2)'}}>₹{s.mrr.toLocaleString()}/mo</td>
              <td><Badge type={s.status==='active'?'green':s.status==='trial'?'yellow':'red'}>{s.status}</Badge></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  )
}

function SAUsers() {
  const ts=DEMO_SCHOOLS.reduce((a,s)=>a+s.students,0)
  const tt=DEMO_SCHOOLS.reduce((a,s)=>a+s.teachers,0)
  const tp=DEMO_SCHOOLS.reduce((a,s)=>a+s.parents,0)
  return (
    <>
      <div className="stat-grid">
        <StatCard icon="👦"   label="Total Students" value={ts.toLocaleString()} color="#4299e1" />
        <StatCard icon="👨‍🏫"  label="Total Teachers" value={tt.toLocaleString()} color="#48bb78" />
        <StatCard icon="👨‍👩‍👦" label="Total Parents"  value={tp.toLocaleString()} color="#ed8936" />
        <StatCard icon="👥"   label="Total Users"    value={(ts+tt+tp).toLocaleString()} color="#9f7aea" />
      </div>
      <div className="table-wrap">
        <div className="table-header"><div className="table-title">👥 Users by School</div></div>
        <table>
          <thead><tr><th>School</th><th>Plan</th><th>Students</th><th>Teachers</th><th>Parents</th><th>Total</th></tr></thead>
          <tbody>{DEMO_SCHOOLS.map(s=>(
            <tr key={s.id}>
              <td><strong>{s.name}</strong></td>
              <td><Badge type={PLAN_BADGE[s.plan]}>{s.plan}</Badge></td>
              <td>{s.students}</td><td>{s.teachers}</td><td>{s.parents}</td>
              <td style={{fontWeight:700}}>{s.students+s.teachers+s.parents}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  )
}

function SAPlans() {
  const plans = [
    { name:'Basic',      price:1999,  color:'#4299e1', schools:3, features:['Attendance','Homework','Marksheet','Announcements','PTM','Birthdays','Holidays','Complaints'] },
    { name:'Pro',        price:4499,  color:'#48bb78', schools:3, features:['All Basic +','Fee Management','AI Question Papers','AI Lesson Plans','WhatsApp Alerts','Parent-Teacher Chat','Leaderboard & Badges'] },
    { name:'Premium',    price:7999,  color:'#ed8936', schools:1, features:['All Pro +','Face Recognition','Bus GPS Tracking','Health Records','Video PTM','AI Performance Predictor','Custom Branding'] },
    { name:'Enterprise', price:null,  color:'#9f7aea', schools:1, features:['All Premium +','White-label App','Own Server','API Access','Custom Dev','Dedicated Manager','SLA 99.9%'] },
  ]
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:18}}>
      {plans.map(p=>(
        <div key={p.name} className="card" style={{borderTop:`4px solid ${p.color}`,margin:0}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <div style={{fontSize:17,fontWeight:800}}>{p.name}</div>
            <div style={{fontWeight:800,color:p.color}}>{p.price?`₹${p.price.toLocaleString()}/mo`:'Custom'}</div>
          </div>
          <div style={{fontSize:12,color:'var(--text3)',marginBottom:14}}>{p.schools} school{p.schools>1?'s':''} currently</div>
          {p.features.map(f=>(
            <div key={f} style={{display:'flex',alignItems:'center',gap:7,fontSize:12,marginBottom:7}}>
              <span style={{color:p.color}}>✓</span>{f}
            </div>
          ))}
          <div style={{display:'flex',gap:7,marginTop:16}}>
            <button className="btn btn-sm btn-outline" style={{flex:1}} onClick={()=>showToast('Plan updated!','success')}>Edit</button>
            <button className="btn btn-sm btn-primary" style={{flex:1}} onClick={()=>showToast('Link copied!','info')}>Share</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function SASupport() {
  const tickets = [
    { id:1, school:"St. Mary's",  subject:'Login issue for teachers',      priority:'high',   status:'open',        date:'2026-05-26' },
    { id:2, school:'DPS Delhi',   subject:'Attendance report not loading',  priority:'medium', status:'in-progress', date:'2026-05-25' },
    { id:3, school:'Ryan Intl',   subject:'How to bulk import students?',   priority:'low',    status:'resolved',    date:'2026-05-24' },
  ]
  return (
    <div className="table-wrap">
      <div className="table-header"><div className="table-title">🎫 Support Tickets</div></div>
      <table>
        <thead><tr><th>School</th><th>Issue</th><th>Priority</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
        <tbody>{tickets.map(t=>(
          <tr key={t.id}>
            <td><strong>{t.school}</strong></td><td>{t.subject}</td>
            <td><Badge type={t.priority==='high'?'red':t.priority==='medium'?'yellow':'gray'}>{t.priority}</Badge></td>
            <td><Badge type={t.status==='resolved'?'green':t.status==='in-progress'?'yellow':'red'}>{t.status}</Badge></td>
            <td style={{fontSize:12}}>{t.date}</td>
            <td><button className="btn btn-sm btn-primary" onClick={()=>showToast('Ticket opened','info')}>Respond</button></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  )
}
