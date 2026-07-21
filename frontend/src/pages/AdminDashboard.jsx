import React, { useState, useEffect } from 'react'
import { analyticsAPI, patientsAPI, organsAPI, hospitalsAPI, predictionsAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      const res = await analyticsAPI.dashboard()
      setStats(res.data)
    } catch { }
    finally { setLoading(false) }
  }

  const s = stats?.summary || {}

  const systemModules = [
    { title:'Manage Patients', desc:'Add, edit, delete waiting-list patients', icon:'🏥', link:'/patients', color:'#1e40af' },
    { title:'Manage Organs', desc:'Track organ records and availability', icon:'💊', link:'/organs', color:'#059669' },
    { title:'Manage Hospitals', desc:'Manage hospital network and demand', icon:'🏨', link:'/hospitals', color:'#7c3aed' },
    { title:'Run Predictions', desc:'Generate AI organ availability predictions', icon:'🤖', link:'/predict', color:'#d97706' },
    { title:'View Analytics', desc:'Deep analytics and demand reports', icon:'📈', link:'/analytics', color:'#dc2626' },
    { title:'AI Insights', desc:'Automated AI-generated insights', icon:'💡', link:'/insights', color:'#0891b2' },
  ]

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">⚙️ Admin Dashboard</h1>
        <p className="page-subtitle">System overview and administration — Welcome, {user?.name}</p>
      </div>

      {/* Admin Badge */}
      <div style={{ background:'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius:'var(--radius-lg)', padding:'20px 24px', marginBottom:24, color:'white' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <h2 style={{ fontSize:18, fontWeight:700 }}>🏆 IBM AI Builders Challenge</h2>
            <p style={{ fontSize:13, opacity:0.8, marginTop:4 }}>AI Organ Availability Prediction · July 2025 Challenge</p>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:13, opacity:0.8 }}>Admin Role</div>
            <div style={{ fontWeight:700, fontSize:15 }}>{user?.name}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:24 }}>
            {[
              { label:'Organ Records', val: s.totalOrganRecords??0, icon:'💊', color:'#1e40af' },
              { label:'Active Patients', val: s.totalActivePatients??0, icon:'🏥', color:'#d97706' },
              { label:'Hospitals', val: s.totalHospitals??0, icon:'🏨', color:'#7c3aed' },
              { label:'Predictions Run', val: s.totalPredictions??0, icon:'🤖', color:'#059669' },
              { label:'High Availability', val: s.highAvailabilityPredictions??0, icon:'📈', color:'#059669' },
              { label:'Low Availability', val: s.lowAvailabilityPredictions??0, icon:'📉', color:'#dc2626' },
            ].map(c => (
              <div key={c.label} style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'16px', borderLeft:`3px solid ${c.color}` }}>
                <div style={{ fontSize:22, marginBottom:6 }}>{c.icon}</div>
                <div style={{ fontSize:24, fontWeight:800, color:c.color }}>{c.val}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* Module Cards */}
          <h3 style={{ fontSize:17, fontWeight:700, marginBottom:14 }}>System Modules</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16, marginBottom:24 }}>
            {systemModules.map(m => (
              <Link key={m.title} to={m.link} style={{ textDecoration:'none' }}>
                <div className="card" style={{ cursor:'pointer', borderLeft:`4px solid ${m.color}`, transition:'transform 0.15s, box-shadow 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform='none'}>
                  <div style={{ fontSize:28, marginBottom:10 }}>{m.icon}</div>
                  <h4 style={{ fontSize:14, fontWeight:700, color:m.color }}>{m.title}</h4>
                  <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>{m.desc}</p>
                  <div style={{ marginTop:12, fontSize:12, color:m.color, fontWeight:600 }}>Open Module →</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Demo Accounts */}
          <div className="card">
            <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>🔑 Demo Login Credentials</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
              {[
                { role:'Admin', email:'admin@organpredict.com', password:'Admin@123', color:'#dc2626' },
                { role:'Hospital Staff', email:'staff@organpredict.com', password:'Staff@123', color:'#1e40af' },
                { role:'Organ Coordinator', email:'coordinator@organpredict.com', password:'Coord@123', color:'#7c3aed' },
              ].map(d => (
                <div key={d.role} style={{ background:'#f8fafc', borderRadius:'var(--radius)', padding:'14px', borderLeft:`3px solid ${d.color}` }}>
                  <div style={{ fontWeight:700, color:d.color, marginBottom:8 }}>{d.role}</div>
                  <div style={{ fontSize:12, marginBottom:4 }}>📧 {d.email}</div>
                  <div style={{ fontSize:12 }}>🔑 {d.password}</div>
                </div>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className="card" style={{ marginTop:20 }}>
            <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>🛠 System Information</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
              {[
                ['Application', 'AI Organ Availability Prediction'],
                ['Challenge', 'IBM AI Builders Challenge — July 2025'],
                ['Frontend', 'React + Vite + Recharts'],
                ['Backend', 'Node.js + Express.js'],
                ['Database', 'Supabase (Free Tier)'],
                ['AI Engine', 'Local Weighted Scoring Algorithm'],
                ['Authentication', 'Supabase Auth + JWT'],
                ['Maps', 'OpenStreetMap / Nominatim (Optional)'],
              ].map(([k, v]) => (
                <div key={k} style={{ display:'flex', gap:8, fontSize:13, padding:'8px 12px', background:'#f8fafc', borderRadius:'var(--radius)' }}>
                  <span style={{ fontWeight:700, color:'var(--text-muted)', minWidth:110 }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
