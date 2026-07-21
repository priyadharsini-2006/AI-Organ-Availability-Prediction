import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { analyticsAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#1e40af', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2']

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsAPI.dashboard()
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="loading-container">
      <div className="spinner" />
      <p>Loading dashboard...</p>
    </div>
  )

  const s = data?.summary || {}

  const statCards = [
    { icon:'💊', label:'Total Organ Records', value: s.totalOrganRecords ?? 0, color:'#dbeafe', iconBg:'#1e40af' },
    { icon:'✅', label:'Available Organs', value: s.availableOrgans ?? 0, color:'#d1fae5', iconBg:'#059669' },
    { icon:'🏥', label:'Active Patients', value: s.totalActivePatients ?? 0, color:'#fef3c7', iconBg:'#d97706' },
    { icon:'🏨', label:'Hospitals', value: s.totalHospitals ?? 0, color:'#ede9fe', iconBg:'#7c3aed' },
    { icon:'📈', label:'High Availability', value: s.highAvailabilityPredictions ?? 0, color:'#d1fae5', iconBg:'#059669' },
    { icon:'📊', label:'Medium Availability', value: s.mediumAvailabilityPredictions ?? 0, color:'#fef3c7', iconBg:'#d97706' },
    { icon:'📉', label:'Low Availability', value: s.lowAvailabilityPredictions ?? 0, color:'#fee2e2', iconBg:'#dc2626' },
    { icon:'🔮', label:'Total Predictions', value: s.totalPredictions ?? 0, color:'#dbeafe', iconBg:'#1e40af' },
  ]

  return (
    <div className="fade-in">
      {/* Welcome */}
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋</h2>
        <p style={{ color:'var(--text-muted)', fontSize:14 }}>Here's your AI Organ Availability Prediction overview.</p>
      </div>

      {data?.isDemoData && (
        <div className="alert alert-warning" style={{ marginBottom:20 }}>
          This dashboard is showing built-in sample data for the demo account.
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ display:'flex', gap:12, marginBottom:28, flexWrap:'wrap' }}>
        <Link to="/predict" className="btn btn-primary">🤖 New AI Prediction</Link>
        <Link to="/patients" className="btn btn-secondary">➕ Add Patient</Link>
        <Link to="/analytics" className="btn btn-outline">📊 View Analytics</Link>
        <Link to="/insights" className="btn btn-ghost">💡 AI Insights</Link>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, marginBottom:28 }}>
        {statCards.map(c => (
          <div key={c.label} className="stat-card" style={{ borderTop:`3px solid ${c.iconBg}` }}>
            <div className="stat-icon" style={{ background:c.color }}>
              <span style={{ fontSize:22 }}>{c.icon}</span>
            </div>
            <div className="stat-content">
              <div className="stat-value">{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20, marginBottom:20 }}>
        {/* Monthly Trend */}
        <div className="chart-container">
          <h3 className="chart-title">Organ Availability vs Demand Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data?.monthlyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize:12 }} />
              <YAxis tick={{ fontSize:12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="available" stroke="#059669" strokeWidth={2} dot={{ r:4 }} name="Available" />
              <Line type="monotone" dataKey="demand" stroke="#dc2626" strokeWidth={2} dot={{ r:4 }} name="Demand" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Blood Group Demand */}
        <div className="chart-container">
          <h3 className="chart-title">Blood Group Demand</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data?.bloodGroupData || []} dataKey="count" nameKey="bloodGroup" cx="50%" cy="50%" outerRadius={80} label={({ bloodGroup, percent }) => `${bloodGroup} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                {(data?.bloodGroupData || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        {/* Organ Type Distribution */}
        <div className="chart-container">
          <h3 className="chart-title">Organ Type Demand vs Availability</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.organTypeData || []} margin={{ left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="organ" tick={{ fontSize:11 }} />
              <YAxis tick={{ fontSize:11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="demand" fill="#dc2626" name="Demand" radius={[4,4,0,0]} />
              <Bar dataKey="available" fill="#059669" name="Available" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Prediction Level Distribution */}
        <div className="chart-container">
          <h3 className="chart-title">Prediction Availability Levels</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[
              { level:'High', count: s.highAvailabilityPredictions ?? 0 },
              { level:'Medium', count: s.mediumAvailabilityPredictions ?? 0 },
              { level:'Low', count: s.lowAvailabilityPredictions ?? 0 },
            ]} margin={{ left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="level" tick={{ fontSize:12 }} />
              <YAxis tick={{ fontSize:12 }} />
              <Tooltip />
              <Bar dataKey="count" name="Predictions" radius={[4,4,0,0]}>
                <Cell fill="#059669" />
                <Cell fill="#d97706" />
                <Cell fill="#dc2626" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Most Demanded/Available */}
        <div className="card">
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>Key Statistics</h3>
          <div style={{ display:'grid', gap:12 }}>
            <StatItem label="Most Demanded Organ" value={s.mostDemandedOrgan || 'N/A'} icon="🔴" />
            <StatItem label="Most Available Organ" value={s.mostAvailableOrgan || 'N/A'} icon="🟢" />
            <StatItem label="Total Predictions Run" value={s.totalPredictions || 0} icon="🤖" />
            <StatItem label="Active Waiting List" value={s.totalActivePatients || 0} icon="⏳" />
          </div>
        </div>

        {/* Recent Predictions */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ fontSize:16, fontWeight:700 }}>Recent Predictions</h3>
            <Link to="/history" style={{ fontSize:12, color:'var(--primary)', fontWeight:600 }}>View All →</Link>
          </div>
          <div style={{ display:'grid', gap:10 }}>
            {(data?.recentPredictions || []).slice(0,4).map(p => (
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px', background:'var(--bg)', borderRadius:'var(--radius)' }}>
                <div style={{ fontSize:20 }}>{organEmoji(p.organ_type)}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{p.organ_type} · {p.blood_group}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>{new Date(p.created_at).toLocaleDateString()}</div>
                </div>
                <span className={`badge badge-${p.availability_level?.toLowerCase()}`}>{p.availability_level}</span>
                <span style={{ fontWeight:700, fontSize:13, color:'var(--primary)' }}>{p.prediction_score}%</span>
              </div>
            ))}
            {(!data?.recentPredictions || data.recentPredictions.length === 0) && (
              <p style={{ fontSize:13, color:'var(--text-muted)', textAlign:'center', padding:'20px 0' }}>No predictions yet. <Link to="/predict">Run your first prediction →</Link></p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value, icon }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background:'var(--bg)', borderRadius:'var(--radius)' }}>
      <span>{icon}</span>
      <span style={{ flex:1, fontSize:13, color:'var(--text-muted)' }}>{label}</span>
      <span style={{ fontWeight:700, fontSize:14 }}>{value}</span>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function organEmoji(type) {
  const map = { Kidney:'🫘', Liver:'🟤', Heart:'❤️', Lung:'🫁', Pancreas:'🟡', Cornea:'👁️' }
  return map[type] || '💊'
}
