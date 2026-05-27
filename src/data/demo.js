export const DEMO_SCHOOLS = [
  { id:'s1', name:"St. Mary's School",    city:'Mumbai',    plan:'pro',        students:342, teachers:28, parents:310, status:'active',  mrr:4499,  joined:'2025-09-01', logo:'🏫' },
  { id:'s2', name:'Delhi Public School',  city:'Delhi',     plan:'basic',      students:218, teachers:18, parents:200, status:'active',  mrr:1999,  joined:'2025-10-15', logo:'🎓' },
  { id:'s3', name:'Ryan International',   city:'Pune',      plan:'premium',    students:580, teachers:45, parents:540, status:'active',  mrr:7999,  joined:'2025-08-20', logo:'📚' },
  { id:'s4', name:'Kendriya Vidyalaya',   city:'Bangalore', plan:'basic',      students:156, teachers:14, parents:148, status:'active',  mrr:1999,  joined:'2025-11-01', logo:'🏛️' },
  { id:'s5', name:'The Heritage School',  city:'Kolkata',   plan:'pro',        students:290, teachers:22, parents:275, status:'active',  mrr:4499,  joined:'2025-12-10', logo:'🌟' },
  { id:'s6', name:'Narayana e-Techno',    city:'Hyderabad', plan:'enterprise', students:920, teachers:72, parents:890, status:'active',  mrr:15000, joined:'2025-07-05', logo:'⚡' },
  { id:'s7', name:'Podar International',  city:'Mumbai',    plan:'basic',      students:124, teachers:11, parents:120, status:'trial',   mrr:0,     joined:'2026-05-01', logo:'🎯' },
  { id:'s8', name:'Vidya Niketan',        city:'Chennai',   plan:'pro',        students:198, teachers:16, parents:185, status:'expired', mrr:0,     joined:'2025-06-10', logo:'📖' },
]
export const DEMO_STUDENTS = [
  { id:1, name:'Aarav Sharma',  class:'8A', roll:'001', dob:'2026-05-27', parent:'Rajesh Sharma', attendance:92, marks:{math:88,sci:82,eng:91,his:76,geo:85} },
  { id:2, name:'Priya Patel',   class:'8A', roll:'002', dob:'2026-06-10', parent:'Sunil Patel',   attendance:97, marks:{math:95,sci:91,eng:88,his:82,geo:79} },
  { id:3, name:'Rohan Gupta',   class:'8B', roll:'003', dob:'2026-05-30', parent:'Amit Gupta',    attendance:78, marks:{math:65,sci:72,eng:69,his:71,geo:68} },
  { id:4, name:'Ananya Singh',  class:'7A', roll:'004', dob:'2026-07-04', parent:'Vikram Singh',  attendance:88, marks:{math:79,sci:85,eng:92,his:88,geo:91} },
  { id:5, name:'Kiran Mehta',   class:'7B', roll:'005', dob:'2026-05-27', parent:'Pradeep Mehta', attendance:95, marks:{math:91,sci:87,eng:94,his:85,geo:88} },
  { id:6, name:'Arjun Verma',   class:'9A', roll:'006', dob:'2026-08-15', parent:'Sanjay Verma',  attendance:83, marks:{math:74,sci:78,eng:71,his:69,geo:73} },
]
export const DEMO_TEACHERS = [
  { id:1, name:'Mrs. Kavitha Rao',  subject:'Mathematics', classes:'8A,8B', email:'kavitha@stmarys.edu', phone:'9876543210' },
  { id:2, name:'Mr. Deepak Nair',   subject:'Science',     classes:'7A,7B', email:'deepak@stmarys.edu',  phone:'9876543211' },
  { id:3, name:'Ms. Preethi Kumar', subject:'English',     classes:'9A,9B', email:'preethi@stmarys.edu', phone:'9876543212' },
  { id:4, name:'Mr. Suresh Babu',   subject:'History',     classes:'8A,9A', email:'suresh@stmarys.edu',  phone:'9876543213' },
]
export const DEMO_HOMEWORK = [
  { id:1, title:'Algebra Ch.5 — Exercises 1-20',      subject:'Mathematics', class:'8A', dueDate:'2026-05-29', teacher:'Mrs. Kavitha Rao',  status:'pending',   icon:'🔢', color:'#4299e1' },
  { id:2, title:'Essay on Climate Change (500 words)', subject:'English',     class:'8A', dueDate:'2026-05-31', teacher:'Ms. Preethi Kumar', status:'pending',   icon:'📖', color:'#48bb78' },
  { id:3, title:'Periodic Table Quiz Prep',            subject:'Science',     class:'8B', dueDate:'2026-05-28', teacher:'Mr. Deepak Nair',   status:'submitted', icon:'🔬', color:'#ed8936' },
  { id:4, title:'Map Work — Rivers of India',          subject:'Geography',   class:'7A', dueDate:'2026-06-02', teacher:'Mr. Suresh Babu',   status:'pending',   icon:'🌍', color:'#9f7aea' },
]
export const DEMO_ANNOUNCEMENTS = [
  { id:1, title:'Annual Sports Day — June 15',    body:'All students must register for at least one event. Forms available at reception. Deadline: June 5.',  target:'all',     date:'2026-05-25', author:'Principal', important:true  },
  { id:2, title:'Unit Test Schedule Released',    body:'Unit Test 2 from June 8–12. Detailed timetable on the portal.',                                       target:'students',date:'2026-05-24', author:'Admin',     important:false },
  { id:3, title:'Parent-Teacher Meeting May 30',  body:'PTM on May 30, 9 AM–1 PM. All parents requested to attend.',                                          target:'parents', date:'2026-05-23', author:'Admin',     important:true  },
  { id:4, title:'Holiday — Eid Al-Adha (June 7)', body:'School closed June 7. Classes resume June 8.',                                                        target:'all',     date:'2026-05-22', author:'Admin',     important:false },
]
export const DEMO_PTM = [
  { id:1, teacher:'Mrs. Kavitha Rao',  parent:'Rajesh Sharma', student:'Aarav Sharma', date:'2026-05-30', time:'09:00 AM', status:'confirmed', class:'8A' },
  { id:2, teacher:'Mr. Deepak Nair',   parent:'Sunil Patel',   student:'Priya Patel',  date:'2026-05-30', time:'09:30 AM', status:'confirmed', class:'8A' },
  { id:3, teacher:'Ms. Preethi Kumar', parent:'Amit Gupta',    student:'Rohan Gupta',  date:'2026-05-30', time:'10:00 AM', status:'pending',   class:'8B' },
]
export const DEMO_HOLIDAYS = [
  { id:1, date:'2026-06-07', name:'Eid Al-Adha',     type:'National' },
  { id:2, date:'2026-06-15', name:'Sports Day',      type:'School'   },
  { id:3, date:'2026-08-15', name:'Independence Day',type:'National' },
  { id:4, date:'2026-10-20', name:'Diwali',          type:'Festival' },
  { id:5, date:'2026-12-25', name:'Christmas',       type:'Festival' },
]
export const DEMO_COMPLAINTS = [
  { id:1, title:'Broken benches in Room 8A',    body:'3 benches need urgent repair.',              raisedBy:'Rajesh Sharma', date:'2026-05-24', status:'open',        priority:'high'   },
  { id:2, title:'Canteen food quality concern', body:'Quality has declined. Requesting improvement.', raisedBy:'Sunil Patel', date:'2026-05-22', status:'in-progress', priority:'medium' },
  { id:3, title:'Library books outdated',       body:'Many science books are 2018 editions.',      raisedBy:'Amit Gupta',    date:'2026-05-20', status:'resolved',    priority:'low'    },
]
export const DEMO_TODAY_ATT = {
  '001':{status:'present'},'002':{status:'present'},
  '003':{status:'absent'}, '004':{status:'present'},
  '005':{status:'present'},'006':{status:'late'},
}
export const DEMO_REVENUE = [
  {month:'Oct 25',mrr:8000, schools:3},{month:'Nov 25',mrr:14000,schools:5},
  {month:'Dec 25',mrr:18500,schools:6},{month:'Jan 26',mrr:26000,schools:8},
  {month:'Feb 26',mrr:31000,schools:10},{month:'Mar 26',mrr:38000,schools:12},
  {month:'Apr 26',mrr:43500,schools:14},{month:'May 26',mrr:51494,schools:16},
]
export const DEMO_PLAN_DIST = [
  {plan:'Basic',count:3,color:'#4299e1'},{plan:'Pro',count:3,color:'#48bb78'},
  {plan:'Premium',count:1,color:'#ed8936'},{plan:'Enterprise',count:1,color:'#9f7aea'},
]
