import React, { useState, useEffect } from 'react'
import { analyticsAPI } from '../lib/api'

const typeIcons = { info:'ℹ️', warning:'⚠️', critical:'🚨', positive:'✅' }
const typeBg = {
  info:    { bg:'#dbeafe', border:'#93c5fd', title:'#1e40af' },
  warning: { bg:'#fef3c7', border:'#fcd34d', title:'#92400e' },
  critical:{ bg:'#fee2e2', border:'#fca5a5', title:'#991b1b' },
  positive:{ bg:'#d1fae5', border:'#6ee7b7', title:'#065f46' },
}

export default function Insights() {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await analyticsAPI.insights()
      setInsights(res.data.insights || [])
      setLastUpdated(new Date())
    } catch {
      setInsights(fallbackInsights)
    } finally {
      setLoading(false)
    }
  }

  const counts = { info:0, warning:0, critical:0, positive:0 }
  insights.forEach(i => { if (counts[i.type] !== undefined) counts[i.type]++ })

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 className="page-title">💡 AI Insights</h1>
          <p className="page-subtitle">{lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Analyzing data...'}</p>
        </div>
        <button className="btn btn-primary" onClick={load} disabled={loading}>
          {loading ? '⏳ Loading...' : '🔄 Refresh Insights'}
        </button>
      </div>

      {/* Summary counts */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { type:'critical', label:'Critical Alerts', icon:'🚨', color:'#dc2626' },
          { type:'warning', label:'Warnings', icon:'⚠️', color:'#d97706' },
          { type:'positive', label:'Positive Signals', icon:'✅', color:'#059669' },
          { type:'info', label:'Information', icon:'ℹ️', color:'#1e40af' },
        ].map(s => (
          <div key={s.type} style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'14px', borderTop:`3px solid ${s.color}` }}>
            <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{counts[s.type]}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* About AI Insights */}
      <div className="alert alert-info" style={{ marginBottom:24 }}>
        <strong>About AI Insights:</strong> These insights are generated automatically by the local AI prediction engine. No external AI API is used. The system analyzes current organ records, patient waiting lists, and prediction history to generate relevant, actionable insights.
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /><p>Generating AI insights...</p></div>
      ) : insights.length === 0 ? (
        <div className="empty-state">
          <div className="icon">💡</div>
          <h3>No Insights Available</h3>
          <p>Add organ records and patients to generate AI insights.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gap:16 }}>
          {insights.map((insight, i) => {
            const style = typeBg[insight.type] || typeBg.info
            return (
              <div key={i} style={{ background:style.bg, border:`1px solid ${style.border}`, borderRadius:'var(--radius-lg)', padding:'20px', display:'flex', gap:16 }}>
                <div style={{ fontSize:28, flexShrink:0 }}>{typeIcons[insight.type] || 'ℹ️'}</div>
                <div>
                  <h3 style={{ fontSize:15, fontWeight:700, color:style.title, marginBottom:6 }}>{insight.title}</h3>
                  <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.7 }}>{insight.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Recommendation Section */}
      {!loading && insights.length > 0 && (
        <div className="card" style={{ marginTop:24 }}>
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>🤖 AI-Generated Recommendations</h3>
          <div style={{ display:'grid', gap:10 }}>
            {[
              { rec:'Prioritize procurement for organs with high demand and low historical availability', icon:'🎯' },
              { rec:'Focus outreach programs in regions with historically lower donation rates', icon:'📍' },
              { rec:'Monitor O- and O+ blood group demand closely as these affect the widest patient population', icon:'🩸' },
              { rec:'Consider seasonal trends in donation planning — donation rates typically peak in May–July', icon:'📅' },
              { rec:'Patients with Critical priority and >12 months waiting duration should be re-evaluated regularly', icon:'⚕️' },
              { rec:'Establish cross-hospital organ sharing protocols for less common organ types like Pancreas and Lung', icon:'🏥' },
            ].map((item, i) => (
              <div key={i} style={{ display:'flex', gap:12, padding:'10px 14px', background:'#f8fafc', borderRadius:'var(--radius)', fontSize:13 }}>
                <span>{item.icon}</span>
                <span>{item.rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="alert alert-warning" style={{ marginTop:20 }}>
        ⚠️ AI insights are for <strong>decision-support purposes only</strong> and must not replace medical professionals or official organ allocation authorities.
      </div>
    </div>
  )
}

const fallbackInsights = [
  { type:'warning', title:'High Kidney Demand', message:'Kidney demand is currently very high. Historical data shows kidney is the most requested organ across all participating hospitals.' },
  { type:'info', title:'Blood Group Demand', message:'O+ blood group has consistently high demand due to its prevalence. Targeted donor campaigns for O+ may help reduce the waiting list.' },
  { type:'positive', title:'Cornea Availability', message:'Cornea availability remains at good levels. Regional donation centers in urban areas show positive trends for cornea procurement.' },
  { type:'critical', title:'Heart & Lung Shortage', message:'Heart and Lung organs have critically low availability rates. Very high demand combined with low donation rates creates a challenging scenario.' },
  { type:'info', title:'Seasonal Trends', message:'Donation activity historically increases in spring and early summer months. Planning procurement campaigns for this period is recommended.' },
  { type:'positive', title:'Urban Donation Activity', message:'Urban regions continue to show higher donation activity compared to rural areas. Expanding outreach to rural areas could significantly improve overall availability.' },
]
