import React, { useState, useEffect } from 'react'
import { predictionsAPI } from '../lib/api'

const ORGAN_FILTER = ['All', 'Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Cornea']
const LEVEL_FILTER = ['All', 'High', 'Medium', 'Low']

export default function PredictionHistory() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [organFilter, setOrganFilter] = useState('All')
  const [levelFilter, setLevelFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const res = await predictionsAPI.getAll()
      setPredictions(res.data.data || [])
    } catch (err) {
      setError('Failed to load prediction history')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this prediction record?')) return
    try {
      await predictionsAPI.delete(id)
      setPredictions(prev => prev.filter(p => p.id !== id))
      setSelected(null)
    } catch {
      alert('Failed to delete prediction')
    }
  }

  const exportCSV = () => {
    const headers = ['ID', 'Organ', 'Blood Group', 'Score', 'Level', 'Confidence', 'Est. Time', 'Date']
    const rows = filtered.map(p => [
      p.id, p.organ_type, p.blood_group, p.prediction_score,
      p.availability_level, p.confidence_score, p.estimated_time,
      new Date(p.created_at).toLocaleString()
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'prediction_history.csv'
    a.click()
  }

  let filtered = predictions
  if (organFilter !== 'All') filtered = filtered.filter(p => p.organ_type === organFilter)
  if (levelFilter !== 'All') filtered = filtered.filter(p => p.availability_level === levelFilter)
  if (search) filtered = filtered.filter(p => p.organ_type.toLowerCase().includes(search.toLowerCase()) || p.blood_group.includes(search))

  const levelColor = { High: '#059669', Medium: '#d97706', Low: '#dc2626' }
  const levelBg = { High: '#d1fae5', Medium: '#fef3c7', Low: '#fee2e2' }

  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading history...</p></div>

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 className="page-title">📋 Prediction History</h1>
          <p className="page-subtitle">{filtered.length} prediction records</p>
        </div>
        <button className="btn btn-outline" onClick={exportCSV}>⬇ Export CSV</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div className="search-bar" style={{ maxWidth:280 }}>
          <span>🔍</span>
          <input placeholder="Search organ or blood group..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width:'auto' }} value={organFilter} onChange={e => setOrganFilter(e.target.value)}>
          {ORGAN_FILTER.map(o => <option key={o}>{o}</option>)}
        </select>
        <select className="form-select" style={{ width:'auto' }} value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
          {LEVEL_FILTER.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap:20 }}>
        {/* Table */}
        <div>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🔮</div>
              <h3>No Predictions Found</h3>
              <p>Run an AI prediction to see results here.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Organ</th>
                    <th>Blood Group</th>
                    <th>Score</th>
                    <th>Level</th>
                    <th>Confidence</th>
                    <th>Est. Time</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} style={{ cursor:'pointer' }}>
                      <td style={{ fontWeight:600 }}>{p.organ_type}</td>
                      <td><span className="badge badge-info">{p.blood_group}</span></td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <span style={{ fontWeight:700, color:levelColor[p.availability_level] }}>{p.prediction_score}%</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ background:levelBg[p.availability_level], color:levelColor[p.availability_level], padding:'2px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>
                          {p.availability_level}
                        </span>
                      </td>
                      <td>{p.confidence_score}%</td>
                      <td style={{ fontSize:12 }}>{p.estimated_time}</td>
                      <td style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display:'flex', gap:6 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => setSelected(selected?.id === p.id ? null : p)}>👁</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="card fade-in" style={{ position:'sticky', top:24, maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ fontSize:16, fontWeight:700 }}>Prediction Details</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div style={{ textAlign:'center', padding:'16px 0', marginBottom:16 }}>
              <div style={{ fontSize:48, fontWeight:800, color:levelColor[selected.availability_level] }}>{selected.prediction_score}%</div>
              <div style={{ fontSize:18, fontWeight:700 }}>{selected.organ_type} · {selected.blood_group}</div>
              <div style={{ marginTop:8 }}>
                <span style={{ background:levelBg[selected.availability_level], color:levelColor[selected.availability_level], padding:'4px 14px', borderRadius:20, fontWeight:700 }}>
                  {selected.availability_level} Availability
                </span>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
              {[
                ['Confidence', `${selected.confidence_score}%`],
                ['Est. Time', selected.estimated_time],
                ['Date', new Date(selected.created_at).toLocaleDateString()],
              ].map(([k,v]) => (
                <div key={k} style={{ background:'var(--bg)', padding:'10px', borderRadius:'var(--radius)' }}>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>{k}</div>
                  <div style={{ fontSize:13, fontWeight:700 }}>{v}</div>
                </div>
              ))}
            </div>

            {selected.prediction_factors?.positiveFactors?.length > 0 && (
              <div style={{ marginBottom:12 }}>
                <h4 style={{ fontSize:13, fontWeight:700, color:'#059669', marginBottom:8 }}>✅ Positive Factors</h4>
                {selected.prediction_factors.positiveFactors.map((f,i) => (
                  <div key={i} style={{ fontSize:12, padding:'6px 10px', background:'#f0fdf4', borderRadius:6, marginBottom:4 }}>✔ {f}</div>
                ))}
              </div>
            )}

            {selected.prediction_factors?.negativeFactors?.length > 0 && (
              <div>
                <h4 style={{ fontSize:13, fontWeight:700, color:'#dc2626', marginBottom:8 }}>⚠ Negative Factors</h4>
                {selected.prediction_factors.negativeFactors.map((f,i) => (
                  <div key={i} style={{ fontSize:12, padding:'6px 10px', background:'#fef2f2', borderRadius:6, marginBottom:4 }}>⚠ {f}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
