import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/dashboard',   icon: '📊', label: 'Dashboard' },
  { path: '/predict',     icon: '🤖', label: 'AI Prediction' },
  { path: '/history',     icon: '📋', label: 'Prediction History' },
  { path: '/patients',    icon: '🏥', label: 'Waiting List' },
  { path: '/analytics',   icon: '📈', label: 'Demand Analytics' },
  { path: '/hospitals',   icon: '🏨', label: 'Hospitals' },
  { path: '/organs',      icon: '💊', label: 'Organ Records' },
  { path: '/insights',    icon: '💡', label: 'AI Insights' },
  { path: '/profile',     icon: '👤', label: 'My Profile' },
]

const adminItems = [
  { path: '/admin',       icon: '⚙️', label: 'Admin Dashboard' },
]

export default function Sidebar({ open, onClose }) {
  const location = useLocation()
  const { user, logout, isAdmin } = useAuth()

  const items = isAdmin ? [...navItems, ...adminItems] : navItems

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:99 }} />}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, background:'rgba(255,255,255,0.15)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🏥</div>
            <div>
              <div style={{ fontWeight:700, fontSize:14, lineHeight:1.2 }}>AI Organ</div>
              <div style={{ fontWeight:700, fontSize:14, lineHeight:1.2, color:'#93c5fd' }}>Availability</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:2 }}>IBM AI Builders</div>
            </div>
          </div>
        </div>

        {/* User info */}
        {user && (
          <div style={{ padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div style={{ overflow:'hidden' }}>
                <div style={{ fontSize:13, fontWeight:600, color:'white', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.name}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.role}</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex:1, padding:'12px 10px', overflowY:'auto' }}>
          {items.map(item => {
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'10px 12px', borderRadius:8, marginBottom:2,
                  color: active ? 'white' : 'rgba(255,255,255,0.65)',
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  fontWeight: active ? 600 : 400, fontSize:14,
                  textDecoration:'none', transition:'all 0.15s'
                }}
              >
                <span style={{ fontSize:16 }}>{item.icon}</span>
                {item.label}
                {active && <span style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'#93c5fd' }} />}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding:'14px 10px', borderTop:'1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={logout} className="btn btn-ghost btn-sm" style={{ width:'100%', color:'rgba(255,255,255,0.65)', borderColor:'rgba(255,255,255,0.2)', justifyContent:'center' }}>
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  )
}
