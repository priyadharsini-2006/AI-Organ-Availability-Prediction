import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    // In a real app, this would call the API
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">👤 My Profile</h1>
        <p className="page-subtitle">Manage your account information</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:24, maxWidth:900 }}>
        {/* Profile Card */}
        <div className="card" style={{ textAlign:'center' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:'var(--primary)', color:'white', fontSize:32, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h2 style={{ fontSize:18, fontWeight:700 }}>{user?.name}</h2>
          <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>{user?.email}</p>
          <div style={{ marginTop:12 }}>
            <span className="badge badge-info" style={{ fontSize:13 }}>{user?.role}</span>
          </div>
          <hr style={{ margin:'20px 0', border:'none', borderTop:'1px solid var(--border)' }} />
          <div style={{ fontSize:13, color:'var(--text-muted)' }}>
            <div style={{ marginBottom:8 }}>🏥 AI Organ Availability Prediction</div>
            <div>📅 IBM AI Builders Challenge</div>
          </div>
          <button className="btn btn-danger" style={{ width:'100%', marginTop:20, justifyContent:'center' }} onClick={logout}>
            🚪 Logout
          </button>
        </div>

        {/* Edit Form */}
        <div className="card">
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Account Information</h3>
          {saved && <div className="alert alert-success">Profile updated successfully!</div>}
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={form.email} onChange={e => setForm({...form, email:e.target.value})} disabled style={{ background:'#f8fafc', cursor:'not-allowed' }} />
              <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>Email cannot be changed here. Contact admin.</p>
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <input className="form-input" value={user?.role} disabled style={{ background:'#f8fafc', cursor:'not-allowed' }} />
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </form>

          <hr style={{ margin:'24px 0', border:'none', borderTop:'1px solid var(--border)' }} />

          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>🔒 Security</h3>
          <div style={{ background:'#f8fafc', borderRadius:'var(--radius)', padding:'16px', fontSize:13, color:'var(--text-muted)' }}>
            <p>🛡️ Your account is secured with Supabase Authentication and JWT tokens.</p>
            <p style={{ marginTop:8 }}>🔑 Password changes must be done through your email account settings.</p>
          </div>

          <hr style={{ margin:'24px 0', border:'none', borderTop:'1px solid var(--border)' }} />

          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>📊 Activity Summary</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            {[
              { icon:'🤖', label:'Predictions Made', val:'—' },
              { icon:'👥', label:'Patients Added', val:'—' },
              { icon:'🏥', label:'Hospitals Managed', val:'—' },
            ].map(a => (
              <div key={a.label} style={{ textAlign:'center', padding:'14px', background:'var(--bg)', borderRadius:'var(--radius)' }}>
                <div style={{ fontSize:24, marginBottom:4 }}>{a.icon}</div>
                <div style={{ fontSize:20, fontWeight:800, color:'var(--primary)' }}>{a.val}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{a.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
