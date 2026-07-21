import React, { useState, useEffect } from 'react'
import { analyticsAPI } from '../lib/api'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#1e40af', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#64748b', '#f59e0b']
const ORGAN_OPTIONS = ['All', 'Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Cornea']
const BG_OPTIONS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function Analytics() {
  const [demandData, setDemandData] = useState(null)
  const [availData, setAvailData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [organFilter, setOrganFilter] = useState('All')
  const [bgFilter, setBgFilter] = useState('All')
  const [activeTab, setActiveTab] = useState('demand')

  useEffect(() => { load() }, [organFilter, bgFilter])

  const load = async () => {
    try {
      const params = {}
      if (organFilter !== 'All') params.organ_type = organFilter
      if (bgFilter !== 'All') params.blood_group = bgFilter
      const [d, a] = await Promise.all([analyticsAPI.demand(params), analyticsAPI.availability()])
      setDemandData(d.data)
      setAvailData(a.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const tabs = ['demand', 'availability', 'priority', 'hospital']

  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading analytics...</p></div>

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">📈 Organ Demand Analytics</h1>
        <p className="page-subtitle">Comprehensive analysis of organ demand, availability, and waiting-list trends</p>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <select className="form-select" style={{ width:'auto' }} value={organFilter} onChange={e => setOrganFilter(e.target.value)}>
          {ORGAN_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
        <select className="form-select" style={{ width:'auto' }} value={bgFilter} onChange={e => setBgFilter(e.target.value)}>
          {BG_OPTIONS.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>

      {/* Summary stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        {[
          { label:'Total Patients', val: demandData?.totalPatients ?? 0, icon:'👥', color:'#1e40af' },
          { label:'Active Patients', val: demandData?.activePatients ?? 0, icon:'⏳', color:'#d97706' },
          { label:'Avg Prediction Score', val: `${availData?.averagePredictionScore ?? 0}%`, icon:'🤖', color:'#7c3aed' },
        ].map(s => (
          <div key={s.label} style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'18px', borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:28, marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:13, color:'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:0, marginBottom:20, borderBottom:'2px solid var(--border)' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding:'10px 20px', background:'none', border:'none', cursor:'pointer',
            fontWeight: activeTab===t ? 700 : 400, fontSize:14,
            color: activeTab===t ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab===t ? '2px solid var(--primary)' : '2px solid transparent',
            marginBottom:-2, textTransform:'capitalize'
          }}>
            {t === 'demand' ? '📊 Organ Demand' : t === 'availability' ? '✅ Availability' : t === 'priority' ? '🔴 Priority' : '🏨 Hospital'}
          </button>
        ))}
      </div>

      {/* Demand Tab */}
      {activeTab === 'demand' && demandData && (
        <div style={{ display:'grid', gap:20 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <div className="chart-container">
              <h3 className="chart-title">Organ Demand Distribution</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={demandData.organDemand} margin={{ left:-10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="organ" tick={{ fontSize:12 }} />
                  <YAxis tick={{ fontSize:12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1e40af" name="Patients" radius={[4,4,0,0]}>
                    {demandData.organDemand.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-container">
              <h3 className="chart-title">Blood Group Demand</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={demandData.bloodGroupDemand} dataKey="count" nameKey="bloodGroup" cx="50%" cy="50%" outerRadius={90}
                    label={({ bloodGroup, percent }) => `${bloodGroup} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                    {demandData.bloodGroupDemand.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Demand list */}
          <div className="card">
            <h3 className="chart-title">Organ Demand Ranking</h3>
            <div style={{ display:'grid', gap:8 }}>
              {demandData.organDemand.map((item, i) => (
                <div key={item.organ} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ width:24, height:24, borderRadius:'50%', background:COLORS[i%COLORS.length], color:'white', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{i+1}</span>
                  <span style={{ width:80, fontWeight:600 }}>{item.organ}</span>
                  <div style={{ flex:1, height:8, background:'var(--border)', borderRadius:4 }}>
                    <div style={{ height:'100%', width:`${(item.count / Math.max(...demandData.organDemand.map(d => d.count)))*100}%`, background:COLORS[i%COLORS.length], borderRadius:4 }} />
                  </div>
                  <span style={{ fontWeight:700, fontSize:15 }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Availability Tab */}
      {activeTab === 'availability' && availData && (
        <div style={{ display:'grid', gap:20 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <div className="chart-container">
              <h3 className="chart-title">Organ Availability Rate</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={availData.byOrganType} margin={{ left:-10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="organ" tick={{ fontSize:12 }} />
                  <YAxis tick={{ fontSize:12 }} unit="%" />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="availabilityRate" fill="#059669" name="Availability Rate %" radius={[4,4,0,0]}>
                    {availData.byOrganType.map((item, i) => (
                      <Cell key={i} fill={item.availabilityRate >= 60 ? '#059669' : item.availabilityRate >= 40 ? '#d97706' : '#dc2626'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-container">
              <h3 className="chart-title">Availability Status Distribution</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={availData.availabilityStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90}
                    label={({ status, percent }) => `${status} ${(percent*100).toFixed(0)}%`}>
                    <Cell fill="#059669" />
                    <Cell fill="#d97706" />
                    <Cell fill="#7c3aed" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="chart-container">
            <h3 className="chart-title">Blood Group Availability vs Total Records</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={availData.byBloodGroup} margin={{ left:-10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bloodGroup" tick={{ fontSize:12 }} />
                <YAxis tick={{ fontSize:12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#dbeafe" name="Total Records" radius={[4,4,0,0]} />
                <Bar dataKey="available" fill="#059669" name="Available" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Priority Tab */}
      {activeTab === 'priority' && demandData && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <div className="chart-container">
            <h3 className="chart-title">Medical Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={demandData.priorityDistribution} dataKey="count" nameKey="priority" cx="50%" cy="50%" outerRadius={110}
                  label={({ priority, percent }) => `${priority} ${(percent*100).toFixed(0)}%`}>
                  <Cell fill="#dc2626" />
                  <Cell fill="#d97706" />
                  <Cell fill="#2563eb" />
                  <Cell fill="#059669" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 className="chart-title">Priority Breakdown</h3>
            <div style={{ display:'grid', gap:12 }}>
              {demandData.priorityDistribution.map((item, i) => {
                const colors = ['#dc2626','#d97706','#2563eb','#059669']
                return (
                  <div key={item.priority} style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ width:12, height:12, borderRadius:'50%', background:colors[i], flexShrink:0 }} />
                    <span style={{ flex:1, fontSize:14 }}>{item.priority} Priority</span>
                    <span style={{ fontWeight:700 }}>{item.count} patients</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Hospital Tab */}
      {activeTab === 'hospital' && demandData && (
        <div className="chart-container">
          <h3 className="chart-title">Hospital Demand (Top Requesting Facilities)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={demandData.hospitalDemand.slice(0,8)} layout="vertical" margin={{ left:20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize:12 }} />
              <YAxis dataKey="hospital" type="category" tick={{ fontSize:11 }} width={160} />
              <Tooltip />
              <Bar dataKey="count" fill="#1e40af" name="Patients" radius={[0,4,4,0]}>
                {demandData.hospitalDemand.slice(0,8).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
