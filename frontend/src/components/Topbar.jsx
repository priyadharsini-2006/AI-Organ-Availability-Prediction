import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const routeLabels = {
  '/dashboard': 'Dashboard',
  '/predict': 'AI Prediction',
  '/history': 'Prediction History',
  '/patients': 'Patient Waiting List',
  '/analytics': 'Demand Analytics',
  '/hospitals': 'Hospital Management',
  '/organs': 'Organ Records',
  '/insights': 'AI Insights',
  '/profile': 'My Profile',
  '/admin': 'Admin Dashboard',
}

export default function Topbar({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const title = routeLabels[location.pathname] || 'AI Organ Availability Prediction'
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="topbar">
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={onMenuToggle}
          style={{ display:'none', padding:'6px 10px' }}
          id="menu-toggle"
        >
          ☰
        </button>
        <h1 style={{ fontSize:18, fontWeight:700, color:'var(--text)' }}>{title}</h1>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative' }}>
        <span className="badge badge-info" style={{ fontSize:11 }}>IBM AI Builders</span>

        {user && (
          <div style={{ position:'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', cursor:'pointer', padding:'6px 8px', borderRadius:'var(--radius)' }}
            >
              <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--primary)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14 }}>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{user.name?.split(' ')[0]}</span>
              <span style={{ fontSize:10, color:'var(--text-muted)' }}>▼</span>
            </button>

            {showMenu && (
              <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, background:'white', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-lg)', minWidth:180, zIndex:200 }}>
                <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ fontWeight:600, fontSize:14 }}>{user.name}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{user.role}</div>
                </div>
                <button
                  onClick={() => { setShowMenu(false); logout() }}
                  style={{ width:'100%', padding:'10px 16px', background:'none', border:'none', cursor:'pointer', textAlign:'left', fontSize:14, color:'var(--danger)', fontWeight:600 }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          #menu-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
