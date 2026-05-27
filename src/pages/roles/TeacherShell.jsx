import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { StatCard, Modal, Badge, BirthdayBanner, ProgressBar } from '../../components/ui/UI'
import { DEMO_STUDENTS, DEMO_HOMEWORK, DEMO_ANNOUNCEMENTS, DEMO_PTM, DEMO_HOLIDAYS, DEMO_COMPLAINTS, DEMO_TODAY_ATT } from '../../data/demo'
import { showToast } from '../../App'

// ── SHARED HELPERS ────────────────────────────────────────────
const todayBdays = () => DEMO_STUDENTS.filter(s=>{const d=new Date(s.dob),t=new Date();return d.getMonth()===t.getMonth()&&d.getDate()===t.getDate()})
const avg = s => Math.round(Object.values(s.marks).reduce((a,b)=>a+b,0)/5)
const PLAN_BADGE = {National:'blue',Festival:'yellow',School:'green'}

// ═══════════════════════════════════════════════════════════════
//  TEACHER SHELL
// ═══════════════════════════════════════════════════════════════
const T_NAV = [
  {section:'Overview'},{id:'dashboard',icon:'📊',label:'Dashboard'},
  {section:'Academics'},{id:'attendance',icon:'✅',label:'Mark Attendance'},{id:'homework',icon:'📝',label:'Homework'},{id:'marksheet',icon:'📋',label:'Marksheet'},
  {section:'Communication'},{id:'announcements',icon:'📣',label:'Announcements'},{id:'ptm',icon:'🤝',label:'PTM Schedule'},{id:'birthdays',icon:'🎂',label:'Birthdays'},
]
export function TeacherShell() {
  const cur = window.location.pathname.split('/').pop()||'dashboard'
  const titles = {dashboard:'Teacher Dashboard',attendance:'Mark Attendance',homework:'Homework',marksheet:'Marksheet',announcements:'Announcements',ptm:'PTM Schedule',birthdays:'Birthdays'}
  return (
    <AppLayout nav={T_NAV} schoolName="St. Mary's School" plan="Basic" base="/teacher" title={titles[cur]||'Dashboard'}>
      <Routes>
        <Route path="dashboard"     element={<TDash />}   />
        <Route path="attendance"    element={<TAttendance />}/>
        <Route path="homework"      element={<THomework />}/>
        <Route path="marksheet"     element={<TMarksheet />}/>
        <Route path="announcements" element={<SharedAnn role="teacher"/>}/>
        <Route path="ptm"           element={<TPTM />}    />
        <Route path="birthdays"     element={<SharedBdays />}/>
        <Route path="*"             element={<TDash />}   />
      </Routes>
    </AppLayout>
  )
}
function TDash() {
  const mine = DEMO_STUDENTS.filter(s=>s.class.startsWith('8'))
  return (
    <>
      <BirthdayBanner students={todayBdays()} />
      <div className="stat-grid">
        <StatCard icon="👦"  label="My Students"      value={mine.length} sub="Classes 8A & 8B"  color="#4299e1"/>
        <StatCard icon="✅"  label="Today Attendance" value="89%"          sub="Class 8A"         color="#48bb78"/>
        <StatCard icon="📝"  label="HW Pending"       value="2"            sub="Assigned by you"  color="#ed8936"/>
        <StatCard icon="🤝"  label="PTM Slots"        value="3"            sub="May 30 confirmed" color="#9f7aea"/>
      </div>
      <div className="card">
        <div className="card-title">👦 My Students</div>
        <table><thead><tr><th>Name</th><th>Class</th><th>Attendance</th><th>Avg</th><th>Status</th></tr></thead>
        <tbody>{mine.map(s=>{const a=avg(s);return(
          <tr key={s.id}><td><strong>{s.name}</strong></td><td>{s.class}</td>
          <td><div style={{display:'flex',alignItems:'center',gap:7}}><ProgressBar value={s.attendance}/><span style={{fontSize:12,fontWeight:600}}>{s.attendance}%</span></div></td>
          <td style={{fontWeight:700,color:a>=80?'var(--accent2)':a>=60?'var(--warning)':'var(--danger)'}}>{a}%</td>
          <td><Badge type={s.attendance>90?'green':s.attendance>75?'yellow':'red'}>{s.attendance>90?'Good':s.attendance>75?'Avg':'At Risk'}</Badge></td>
          </tr>)})}</tbody></table>
      </div>
    </>
  )
}
function TAttendance() {
  const [att, setAtt] = useState({...DEMO_TODAY_ATT})
  const cls = DEMO_STUDENTS.filter(s=>s.class==='8A')
  return (
    <>
      <div style={{display:'flex',gap:10,marginBottom:18,flexWrap:'wrap'}}>
        <select className="form-select" style={{width:'auto'}}><option>Class 8A</option><option>Class 8B</option></select>
        <input type="date" className="form-input" style={{width:'auto'}} defaultValue="2026-05-27"/>
        <button className="btn btn-green" onClick={()=>showToast('Attendance saved! Parents notified.','success')}>💾 Save</button>
      </div>
      <div className="att-grid">
        {cls.map(s=>{const st=att[s.roll]?.status||'';return(
          <div key={s.id} className="att-card">
            <div><div className="att-name">{s.name}</div><div className="att-roll">Roll: {s.roll}</div></div>
            <div className="att-btns">{['present','absent','late'].map(status=>(
              <div key={status} className={`att-btn ${st===status?status:''}`} onClick={()=>setAtt(a=>({...a,[s.roll]:{status}}))}>{status[0].toUpperCase()}</div>
            ))}</div>
          </div>
        )})}
      </div>
    </>
  )
}
function THomework() {
  const [modal, setModal] = useState(false)
  return (
    <>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:14}}><button className="btn btn-primary" onClick={()=>setModal(true)}>+ Assign</button></div>
      {DEMO_HOMEWORK.map(h=>(
        <div key={h.id} style={{background:'#fff',borderRadius:'var(--radius)',padding:'16px 18px',boxShadow:'var(--shadow)',marginBottom:9,display:'flex',gap:12,alignItems:'flex-start'}}>
          <div style={{width:42,height:42,borderRadius:9,background:h.color+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0}}>{h.icon}</div>
          <div style={{flex:1}}><div style={{fontWeight:600}}>{h.title}</div><div style={{fontSize:11.5,color:'var(--text3)'}}>{h.subject} · Class {h.class}</div></div>
          <div style={{textAlign:'right'}}><div style={{fontSize:11,fontWeight:600,marginBottom:5}}>Due {h.dueDate}</div><Badge type={h.status==='submitted'?'green':'yellow'}>{h.status}</Badge></div>
        </div>
      ))}
      {modal && (
        <Modal title="📝 Assign Homework" onClose={()=>setModal(false)}>
          <div className="form-row"><label className="form-label">Title</label><input className="form-input"/></div>
          <div className="grid-2">
            <div className="form-row"><label className="form-label">Subject</label><select className="form-select"><option>Mathematics</option><option>Science</option></select></div>
            <div className="form-row"><label className="form-label">Due Date</label><input className="form-input" type="date"/></div>
          </div>
          <div className="form-row"><label className="form-label">Description</label><textarea className="form-textarea"/></div>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>{setModal(false);showToast('Homework assigned!','success')}}>Assign</button>
          </div>
        </Modal>
      )}
    </>
  )
}
function TMarksheet() {
  const [modal, setModal] = useState(false)
  const cls = DEMO_STUDENTS.filter(s=>s.class==='8A')
  return (
    <>
      <div style={{display:'flex',gap:9,marginBottom:14}}>
        <button className="btn btn-primary" onClick={()=>setModal(true)}>+ Enter Marks</button>
        <button className="btn btn-outline" onClick={()=>showToast('Exported!','success')}>📊 Export</button>
      </div>
      <div className="table-wrap"><table>
        <thead><tr><th>Student</th><th>Math</th><th>Sci</th><th>Eng</th><th>His</th><th>Geo</th><th>Avg</th></tr></thead>
        <tbody>{cls.map(s=>{const a=avg(s);return(<tr key={s.id}><td><strong>{s.name}</strong></td>{Object.values(s.marks).map((m,i)=><td key={i} style={{fontWeight:600,color:m>=80?'var(--accent2)':m>=60?'var(--warning)':'var(--danger)'}}>{m}</td>)}<td><strong>{a}%</strong></td></tr>)})}</tbody>
      </table></div>
      {modal && (
        <Modal title="📋 Enter Marks" onClose={()=>setModal(false)} wide>
          {cls.map(s=>(
            <div key={s.id} style={{display:'flex',alignItems:'center',gap:12,marginBottom:9}}>
              <div style={{flex:1,fontSize:13}}>{s.name}</div>
              <input type="number" min={0} max={100} className="form-input" style={{width:90}} placeholder="0-100"/>
            </div>
          ))}
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>{setModal(false);showToast('Marks saved!','success')}}>Save</button>
          </div>
        </Modal>
      )}
    </>
  )
}
function TPTM() {
  const mine = DEMO_PTM.filter(p=>p.teacher==='Mrs. Kavitha Rao')
  return (
    <>
      <div style={{marginBottom:16}}><div style={{fontSize:17,fontWeight:700}}>📅 May 30 — Your PTM Schedule</div></div>
      {mine.length ? mine.map(p=>(
        <div key={p.id} className="ptm-card">
          <div style={{textAlign:'center',minWidth:48}}><div className="ptm-day">30</div><div className="ptm-mon">May</div></div>
          <div style={{flex:1}}><div style={{fontWeight:600}}>👨‍👩‍👦 {p.parent}</div><div style={{fontSize:11.5,color:'var(--text3)'}}>Re: {p.student}</div></div>
          <div style={{textAlign:'right'}}><div style={{fontWeight:600,color:'var(--primary)'}}>{p.time}</div><Badge type={p.status==='confirmed'?'green':'yellow'}>{p.status}</Badge></div>
        </div>
      )) : <div style={{textAlign:'center',padding:32,color:'var(--text3)'}}>No PTM slots assigned yet.</div>}
    </>
  )
}
function SharedAnn() {
  return <>{DEMO_ANNOUNCEMENTS.map(a=>(<div key={a.id} className={`ann-card ${a.important?'important':''}`}>{a.important&&<span style={{fontSize:10,fontWeight:700,background:'var(--accent)',color:'var(--primary)',padding:'2px 8px',borderRadius:20,display:'inline-block',marginBottom:7}}>📌 IMPORTANT</span>}<div style={{fontWeight:700,marginBottom:5}}>{a.title}</div><div style={{fontSize:12.5,color:'var(--text2)',lineHeight:1.6,marginBottom:8}}>{a.body}</div><div style={{fontSize:11,color:'var(--text3)'}}>{a.date} · <Badge type="blue">{a.target}</Badge></div></div>))}</>
}
function SharedBdays() {
  const today = new Date()
  return (
    <>
      <BirthdayBanner students={todayBdays()} />
      <div className="table-wrap"><table>
        <thead><tr><th>Student</th><th>Class</th><th>Birthday</th><th>Action</th></tr></thead>
        <tbody>{DEMO_STUDENTS.map(s=>{const d=new Date(s.dob);return(<tr key={s.id}><td><strong>{s.name}</strong></td><td>{s.class}</td><td>{d.toLocaleDateString('en-IN',{day:'numeric',month:'long'})}</td><td><button className="btn btn-sm btn-yellow" onClick={()=>showToast(`Wish sent to ${s.name}! 🎂`,'success')}>🎉 Wish</button></td></tr>)})}</tbody>
      </table></div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
//  PARENT SHELL
// ═══════════════════════════════════════════════════════════════
const P_NAV = [
  {section:'My Child'},{id:'dashboard',icon:'📊',label:'Dashboard'},{id:'attendance',icon:'✅',label:'Attendance'},{id:'homework',icon:'📝',label:'Homework'},{id:'marksheet',icon:'📋',label:'Progress Report'},
  {section:'School'},{id:'announcements',icon:'📣',label:'Announcements'},{id:'ptm',icon:'🤝',label:'PTM Booking'},{id:'holidays',icon:'🏖️',label:'Holidays'},{id:'birthdays',icon:'🎂',label:'Birthday'},{id:'complaints',icon:'🎫',label:'Raise Complaint'},
]
export function ParentShell() {
  const cur = window.location.pathname.split('/').pop()||'dashboard'
  const titles = {dashboard:'Parent Dashboard',attendance:'Attendance',homework:'Homework',marksheet:'Progress Report',announcements:'Announcements',ptm:'PTM Booking',holidays:'Holidays',birthdays:'Birthday',complaints:'Complaints'}
  return (
    <AppLayout nav={P_NAV} schoolName="St. Mary's School" plan="Basic" base="/parent" title={titles[cur]||'Dashboard'}>
      <Routes>
        <Route path="dashboard"     element={<PDash />}       />
        <Route path="attendance"    element={<PAttendance />}  />
        <Route path="homework"      element={<SharedHW />}     />
        <Route path="marksheet"     element={<PMarksheet />}   />
        <Route path="announcements" element={<SharedAnn />}    />
        <Route path="ptm"           element={<PPTM />}         />
        <Route path="holidays"      element={<SharedHolidays />}/>
        <Route path="birthdays"     element={<PBirthday />}    />
        <Route path="complaints"    element={<PComplaints />}  />
        <Route path="*"             element={<PDash />}        />
      </Routes>
    </AppLayout>
  )
}
function PDash() {
  const child = DEMO_STUDENTS[0], a=avg(child)
  return (
    <>
      <div style={{background:'linear-gradient(135deg,var(--primary),var(--primary-light))',borderRadius:'var(--radius)',padding:22,color:'#fff',marginBottom:20}}>
        <div style={{fontSize:12,opacity:.7,marginBottom:3}}>My Child</div>
        <div style={{fontSize:22,fontWeight:800}}>{child.name}</div>
        <div style={{fontSize:13,opacity:.8}}>Class {child.class} · Roll No. {child.roll}</div>
      </div>
      <div className="stat-grid">
        <StatCard icon="✅" label="Attendance" value={`${child.attendance}%`} sub={child.attendance>90?'Excellent':'Needs improvement'} subType={child.attendance>90?'up':'down'} color="#4299e1"/>
        <StatCard icon="📊" label="Avg Marks"  value={`${a}%`} sub="Grade A" subType="up" color="#48bb78"/>
        <StatCard icon="📝" label="Pending HW" value="2" sub="Due this week" color="#ed8936"/>
        <StatCard icon="🤝" label="Next PTM"   value="May 30" sub="09:00 AM" color="#9f7aea"/>
      </div>
      <div className="card">
        <div className="card-title">📊 Subject Performance</div>
        {Object.entries(child.marks).map(([sub,mark])=>(
          <div key={sub} style={{marginBottom:12}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
              <span style={{fontSize:13,fontWeight:600,textTransform:'capitalize'}}>{sub}</span>
              <span style={{fontSize:13,fontWeight:700,color:mark>=80?'var(--accent2)':mark>=60?'var(--warning)':'var(--danger)'}}>{mark}/100</span>
            </div>
            <ProgressBar value={mark}/>
          </div>
        ))}
      </div>
    </>
  )
}
function PAttendance() {
  const child=DEMO_STUDENTS[0],today=new Date(),year=today.getFullYear(),month=today.getMonth()
  const firstDay=new Date(year,month,1).getDay(),daysInMonth=new Date(year,month+1,0).getDate()
  return (
    <>
      <div className="two-col" style={{marginBottom:18}}>
        <div className="card" style={{margin:0,textAlign:'center'}}><div style={{fontSize:34,fontWeight:800,color:'var(--accent2)'}}>{child.attendance}%</div><div style={{fontSize:12,color:'var(--text3)'}}>Overall Attendance</div></div>
        <div className="card" style={{margin:0,textAlign:'center'}}><div style={{fontSize:34,fontWeight:800,color:'var(--danger)'}}>3</div><div style={{fontSize:12,color:'var(--text3)'}}>Absent This Month</div></div>
      </div>
      <div className="cal-wrap">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <div style={{fontWeight:700}}>{today.toLocaleString('default',{month:'long'})} {year}</div>
          <div style={{display:'flex',gap:10,fontSize:11,alignItems:'center'}}>
            <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:9,height:9,borderRadius:'50%',background:'var(--accent2)',display:'inline-block'}}/>Present</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><span style={{width:9,height:9,borderRadius:'50%',background:'var(--danger)',display:'inline-block'}}/>Absent</span>
          </div>
        </div>
        <div className="cal-grid-wrap">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=><div key={d} className="cal-day-name">{d}</div>)}
          {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`} className="cal-day other-month"/>)}
          {Array.from({length:daysInMonth}).map((_,i)=>{
            const d=i+1,isToday=d===today.getDate(),isWk=(firstDay+d-1)%7===0||(firstDay+d-1)%7===6
            const st=d%3===0?'absent':d%7===0?'':'present'
            return <div key={d} className={`cal-day ${isToday?'today':''} ${!isToday&&!isWk?st:''}`}>{d}</div>
          })}
        </div>
      </div>
    </>
  )
}
function SharedHW() {
  const [hw, setHw] = useState(DEMO_HOMEWORK)
  const isStudent = window.location.pathname.includes('/student/')
  return (
    <>
      {hw.map(h=>(
        <div key={h.id} style={{background:'#fff',borderRadius:'var(--radius)',padding:'16px 18px',boxShadow:'var(--shadow)',marginBottom:9,display:'flex',gap:12,alignItems:'flex-start'}}>
          <div style={{width:42,height:42,borderRadius:9,background:h.color+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0}}>{h.icon}</div>
          <div style={{flex:1}}><div style={{fontWeight:600}}>{h.title}</div><div style={{fontSize:11.5,color:'var(--text3)'}}>{h.subject} · Due {h.dueDate}</div></div>
          <div style={{textAlign:'right',flexShrink:0}}>
            <Badge type={h.status==='submitted'?'green':'yellow'}>{h.status}</Badge>
            {isStudent&&h.status==='pending'&&<div style={{marginTop:7}}><button className="btn btn-sm btn-green" onClick={()=>{setHw(hws=>hws.map(x=>x.id===h.id?{...x,status:'submitted'}:x));showToast('Submitted!','success')}}>Submit</button></div>}
          </div>
        </div>
      ))}
    </>
  )
}
function PMarksheet() {
  const s=DEMO_STUDENTS[0],a=avg(s),g=a>=90?'A+':a>=80?'A':a>=70?'B+':'B'
  return (
    <>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:14}}><button className="btn btn-primary" onClick={()=>showToast('Marksheet downloaded!','success')}>⬇️ Download PDF</button></div>
      <div className="card">
        <div style={{textAlign:'center',paddingBottom:18,borderBottom:'2px solid var(--border)',marginBottom:20}}>
          <div style={{fontSize:19,fontWeight:800,color:'var(--primary)'}}>ST. MARY'S SCHOOL</div>
          <div style={{fontSize:12.5,color:'var(--text3)'}}>Progress Report — Term 1 (2025–26)</div>
        </div>
        <div className="grid-2" style={{marginBottom:18}}>
          {[['Student Name',s.name],['Class',s.class],['Roll No.',s.roll],['Attendance',s.attendance+'%']].map(([k,v])=>(
            <div key={k}><span style={{fontSize:10.5,color:'var(--text3)'}}>{k}</span><div style={{fontWeight:700}}>{v}</div></div>
          ))}
        </div>
        <table>
          <thead><tr><th>Subject</th><th>Marks</th><th>Max</th><th>Grade</th><th>Remarks</th></tr></thead>
          <tbody>{Object.entries(s.marks).map(([sub,mark])=>{const gr=mark>=90?'A+':mark>=80?'A':mark>=70?'B+':mark>=60?'B':'C';return(
            <tr key={sub}><td style={{textTransform:'capitalize',fontWeight:600}}>{sub}</td><td style={{fontWeight:700}}>{mark}</td><td>100</td><td><Badge type={mark>=80?'green':mark>=60?'yellow':'red'}>{gr}</Badge></td><td style={{fontSize:11.5,color:'var(--text3)'}}>{mark>=80?'Excellent':mark>=60?'Good':'Needs improvement'}</td></tr>
          )})}
          </tbody>
        </table>
        <div className="three-col" style={{marginTop:20,paddingTop:20,borderTop:'2px solid var(--border)',textAlign:'center'}}>
          <div><div style={{fontSize:26,fontWeight:800,color:'var(--primary)'}}>{Object.values(s.marks).reduce((a,b)=>a+b,0)}</div><div style={{fontSize:11,color:'var(--text3)'}}>Total Marks</div></div>
          <div><div style={{fontSize:26,fontWeight:800,color:'var(--primary)'}}>{a}%</div><div style={{fontSize:11,color:'var(--text3)'}}>Percentage</div></div>
          <div><div style={{fontSize:26,fontWeight:800,color:'var(--accent2)'}}>{g}</div><div style={{fontSize:11,color:'var(--text3)'}}>Grade</div></div>
        </div>
      </div>
    </>
  )
}
function PPTM() {
  const [modal, setModal] = useState(false)
  const mine = DEMO_PTM.filter(p=>p.parent==='Rajesh Sharma')
  return (
    <>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:14}}><button className="btn btn-primary" onClick={()=>setModal(true)}>📅 Book Slot</button></div>
      {mine.map(p=>(
        <div key={p.id} className="ptm-card">
          <div style={{textAlign:'center',minWidth:48}}><div className="ptm-day">30</div><div className="ptm-mon">May</div></div>
          <div style={{flex:1}}><div style={{fontWeight:600}}>👨‍🏫 {p.teacher}</div><div style={{fontSize:11.5,color:'var(--text3)'}}>Re: {p.student}</div></div>
          <div style={{textAlign:'right'}}><div style={{fontWeight:600,color:'var(--primary)'}}>{p.time}</div><Badge type={p.status==='confirmed'?'green':'yellow'}>{p.status}</Badge></div>
        </div>
      ))}
      {modal && (
        <Modal title="📅 Book PTM Slot" onClose={()=>setModal(false)}>
          <div className="form-row"><label className="form-label">Teacher</label><select className="form-select"><option>Mrs. Kavitha Rao — Mathematics</option><option>Mr. Deepak Nair — Science</option></select></div>
          <div className="form-row"><label className="form-label">Time Slot</label><select className="form-select"><option>09:00 AM</option><option>09:30 AM</option><option>10:00 AM</option></select></div>
          <div className="form-row"><label className="form-label">Message</label><textarea className="form-textarea" placeholder="Topics to discuss..."/></div>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>{setModal(false);showToast('Slot booked! Confirmation sent.','success')}}>Book</button>
          </div>
        </Modal>
      )}
    </>
  )
}
function SharedHolidays() {
  const PLAN_BADGE={National:'blue',Festival:'yellow',School:'green'}
  return <div className="table-wrap"><div className="table-header"><div className="table-title">🏖️ Holiday List 2026</div></div><table><thead><tr><th>Holiday</th><th>Date</th><th>Type</th></tr></thead><tbody>{DEMO_HOLIDAYS.map(h=>(<tr key={h.id}><td><strong>{h.name}</strong></td><td>{h.date}</td><td><Badge type={PLAN_BADGE[h.type]||'gray'}>{h.type}</Badge></td></tr>))}</tbody></table></div>
}
function PBirthday() {
  const child=DEMO_STUDENTS[0],dob=new Date(child.dob),today=new Date()
  const isToday=dob.getMonth()===today.getMonth()&&dob.getDate()===today.getDate()
  return (
    <div className="card" style={{textAlign:'center',padding:40}}>
      <div style={{fontSize:56,marginBottom:12}}>{isToday?'🎂':'🎉'}</div>
      <div style={{fontSize:20,fontWeight:800,marginBottom:6}}>{isToday?`Happy Birthday, ${child.name}! 🎂`:`${child.name}'s Birthday`}</div>
      <div style={{fontSize:13.5,color:'var(--text3)'}}>{dob.toLocaleDateString('en-IN',{day:'numeric',month:'long'})}</div>
      {isToday&&<div style={{marginTop:14,fontSize:13,color:'var(--text2)',lineHeight:1.7,maxWidth:340,margin:'14px auto 0'}}>Wishing your child a wonderful birthday from the entire school family! 🌟</div>}
    </div>
  )
}
function PComplaints() {
  const [modal, setModal] = useState(false)
  const mine = DEMO_COMPLAINTS.filter(c=>c.raisedBy==='Rajesh Sharma')
  return (
    <>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:14}}><button className="btn btn-primary" onClick={()=>setModal(true)}>🎫 Raise Complaint</button></div>
      {mine.map(c=>(
        <div key={c.id} className="complaint-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}><div style={{fontWeight:700}}>{c.title}</div><Badge type={c.status==='resolved'?'green':c.status==='in-progress'?'yellow':'red'}>{c.status}</Badge></div>
          <div style={{fontSize:12.5,color:'var(--text2)',marginBottom:7}}>{c.body}</div>
          <div style={{fontSize:11,color:'var(--text3)'}}>{c.date}</div>
        </div>
      ))}
      {modal && (
        <Modal title="🎫 Raise a Complaint" onClose={()=>setModal(false)}>
          <div className="form-row"><label className="form-label">Subject</label><input className="form-input" placeholder="Brief title"/></div>
          <div className="form-row"><label className="form-label">Description</label><textarea className="form-textarea" placeholder="Describe the issue..."/></div>
          <div className="grid-2">
            <div className="form-row"><label className="form-label">Category</label><select className="form-select"><option>Infrastructure</option><option>Academic</option><option>Other</option></select></div>
            <div className="form-row"><label className="form-label">Priority</label><select className="form-select"><option>Low</option><option>Medium</option><option>High</option></select></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={()=>{setModal(false);showToast('Complaint submitted! Admin will review.','success')}}>Submit</button>
          </div>
        </Modal>
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════
//  STUDENT SHELL
// ═══════════════════════════════════════════════════════════════
const S_NAV = [
  {section:'My School'},{id:'dashboard',icon:'📊',label:'Dashboard'},{id:'attendance',icon:'✅',label:'My Attendance'},{id:'homework',icon:'📝',label:'Homework'},{id:'marksheet',icon:'📋',label:'My Marks'},{id:'announcements',icon:'📣',label:'Announcements'},{id:'holidays',icon:'🏖️',label:'Holidays'},{id:'birthdays',icon:'🎂',label:'Birthday'},
]
export function StudentShell() {
  const cur = window.location.pathname.split('/').pop()||'dashboard'
  const titles = {dashboard:'Student Dashboard',attendance:'My Attendance',homework:'Homework',marksheet:'My Marks',announcements:'Announcements',holidays:'Holidays',birthdays:'Birthday'}
  return (
    <AppLayout nav={S_NAV} schoolName="St. Mary's School" plan="Basic" base="/student" title={titles[cur]||'Dashboard'}>
      <Routes>
        <Route path="dashboard"     element={<SDash />}         />
        <Route path="attendance"    element={<PAttendance />}    />
        <Route path="homework"      element={<SharedHW />}       />
        <Route path="marksheet"     element={<PMarksheet />}     />
        <Route path="announcements" element={<SharedAnn />}      />
        <Route path="holidays"      element={<SharedHolidays />} />
        <Route path="birthdays"     element={<SBirthday />}      />
        <Route path="*"             element={<SDash />}          />
      </Routes>
    </AppLayout>
  )
}
function SDash() {
  const me=DEMO_STUDENTS[0],a=avg(me),today=new Date(),dob=new Date(me.dob)
  const isBday=dob.getMonth()===today.getMonth()&&dob.getDate()===today.getDate()
  return (
    <>
      {isBday&&<BirthdayBanner students={[me]}/>}
      <div className="stat-grid">
        <StatCard icon="✅" label="My Attendance" value={`${me.attendance}%`} sub="This term"    subType="up"  color="#4299e1"/>
        <StatCard icon="📊" label="Avg Score"     value={`${a}%`}             sub="Grade A"      subType="up"  color="#48bb78"/>
        <StatCard icon="📝" label="HW Due"        value="2"                   sub="This week"               color="#ed8936"/>
        <StatCard icon="🏆" label="Class Rank"    value="#1"                  sub="Top of class!" subType="up" color="#9f7aea"/>
      </div>
      <div className="two-col">
        <div className="card">
          <div className="card-title">📝 Pending Homework</div>
          {DEMO_HOMEWORK.filter(h=>h.status==='pending').map(h=>(
            <div key={h.id} style={{display:'flex',gap:9,padding:'9px 0',borderBottom:'1px solid var(--border)',alignItems:'center'}}>
              <div style={{width:32,height:32,borderRadius:7,background:h.color+'22',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{h.icon}</div>
              <div><div style={{fontSize:12,fontWeight:600}}>{h.title}</div><div style={{fontSize:11,color:'var(--text3)'}}>Due {h.dueDate}</div></div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">📣 Announcements</div>
          {DEMO_ANNOUNCEMENTS.slice(0,3).map(a=>(
            <div key={a.id} style={{padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
              <div style={{fontSize:12,fontWeight:600}}>{a.title}</div>
              <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>{a.date}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
function SBirthday() {
  const me=DEMO_STUDENTS[0],dob=new Date(me.dob),today=new Date()
  const isToday=dob.getMonth()===today.getMonth()&&dob.getDate()===today.getDate()
  return (
    <div className="card" style={{textAlign:'center',padding:40}}>
      <div style={{fontSize:60,marginBottom:12}}>{isToday?'🎂':'🎈'}</div>
      <div style={{fontSize:22,fontWeight:800,marginBottom:8}}>{isToday?'Happy Birthday to You! 🎉':'Your Birthday'}</div>
      <div style={{fontSize:14,color:'var(--text3)'}}>{dob.toLocaleDateString('en-IN',{day:'numeric',month:'long'})}</div>
      {isToday&&<div style={{marginTop:14,fontSize:13,color:'var(--text2)',lineHeight:1.7,maxWidth:340,margin:'14px auto 0'}}>🎉 Wishing you a fantastic birthday from your teachers, friends, and the entire school family! May this day be filled with joy! 🌟</div>}
    </div>
  )
}
