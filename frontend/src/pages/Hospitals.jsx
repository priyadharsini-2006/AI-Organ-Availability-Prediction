import React, { useState, useEffect } from 'react'
import { hospitalsAPI } from '../lib/api'

const emptyForm = {
  name: '', location: '', contact: '',
  organ_types: [], current_demand: 'Medium', number_of_patients: ''
}

const ORGAN_OPTIONS = ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Cornea']
const DEMAND_LEVELS = ['Low', 'Medium', 'High', 'Very High']

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  const load = async () => {
    try {
      const res = await hospitalsAPI.getAll()
      setHospitals(res.data.data || [])
    } catch { }
    finally { setLoading(false) }
  }

  const openAdd = () => { setForm(emptyForm); setModal('add') }
  const openEdit = (h) => { setForm({ ...h, organ_types: h.organ_types || [] }); setModal('edit') }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal === 'add') {
        const res = await hospitalsAPI.create(form)
        setHospitals(prev => [res.data, ...prev])
      } else {
        const res = await hospitalsAPI.update(form.id, form)
        setHospitals(prev => prev.map(h => h.id === form.id ? res.data : h))
      }
      setModal(null)
    } catch (err) { alert(err.response?.data?.error || err.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this hospital?')) return
    try {
      await hospitalsAPI.delete(id)
      setHospitals(prev => prev.filter(h => h.id !== id))
    } catch (err) { alert(err.response?.data?.error || err.message || 'Delete failed') }
  }

  const toggleOrgan = (organ) => {
    setForm(prev => ({
      ...prev,
      organ_types: prev.organ_types.includes(organ)
        ? prev.organ_types.filter(o => o !== organ)
        : [...prev.organ_types, organ]
    }))
  }

  const filtered = hospitals.filter(h =>
    !search || h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.location?.toLowerCase().includes(search.toLowerCase())
  )

  const demandColor = { Low:'#059669', Medium:'#d97706', High:'#dc2626', 'Very High':'#7c3aed' }
  const demandBg = { Low:'#d1fae5', Medium:'#fef3c7', High:'#fee2e2', 'Very High':'#ede9fe' }

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 className="page-title">🏨 Hospital Management</h1>
          <p className="page-subtitle">{filtered.length} hospitals registered</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>➕ Add Hospital</button>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        <div className="search-bar" style={{ maxWidth:320 }}>
          <span>🔍</span>
          <input placeholder="Search by name or location..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'Total Hospitals', val: hospitals.length, color:'#1e40af' },
          { label:'Very High Demand', val: hospitals.filter(h => h.current_demand === 'Very High').length, color:'#7c3aed' },
          { label:'High Demand', val: hospitals.filter(h => h.current_demand === 'High').length, color:'#dc2626' },
          { label:'Total Patients', val: hospitals.reduce((a,h) => a + (parseInt(h.number_of_patients)||0), 0), color:'#d97706' },
        ].map(s => (
          <div key={s.label} style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'14px', borderTop:`3px solid ${s.color}` }}>
            <div style={{ fontSize:24, fontWeight:800, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🏨</div>
          <h3>No Hospitals Found</h3>
          <p>Add a hospital to get started.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:16 }}>
          {filtered.map(h => (
            <div key={h.id} className="card" style={{ borderTop:`3px solid ${demandColor[h.current_demand] || '#888'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div>
                  <h3 style={{ fontSize:15, fontWeight:700 }}>{h.name}</h3>
                  <p style={{ fontSize:13, color:'var(--text-muted)', marginTop:2 }}>📍 {h.location}</p>
                </div>
                <span style={{ background:demandBg[h.current_demand], color:demandColor[h.current_demand], padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700, flexShrink:0 }}>
                  {h.current_demand}
                </span>
              </div>
              <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:8 }}>📞 {h.contact}</div>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', marginBottom:4 }}>ORGAN TYPES</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                  {(h.organ_types || []).map(o => (
                    <span key={o} style={{ background:'#dbeafe', color:'#1e40af', padding:'2px 8px', borderRadius:12, fontSize:11, fontWeight:600 }}>{o}</span>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:'var(--text-muted)' }}>👥 {h.number_of_patients} patients</span>
                <div style={{ display:'flex', gap:8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(h)}>✏️ Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(h.id)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth:520 }}>
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'add' ? '➕ Add Hospital' : '✏️ Edit Hospital'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group" style={{ gridColumn:'1/-1' }}>
                    <label className="form-label">Hospital Name *</label>
                    <input className="form-input" required value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input className="form-input" value={form.location} onChange={e => setForm({...form, location:e.target.value})} placeholder="City/Region" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact</label>
                    <input className="form-input" value={form.contact} onChange={e => setForm({...form, contact:e.target.value})} placeholder="+1-555-0100" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current Demand</label>
                    <select className="form-select" value={form.current_demand} onChange={e => setForm({...form, current_demand:e.target.value})}>
                      {DEMAND_LEVELS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Number of Patients</label>
                    <input type="number" className="form-input" value={form.number_of_patients} onChange={e => setForm({...form, number_of_patients:e.target.value})} min={0} />
                  </div>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}>
                    <label className="form-label">Available Organ Types</label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:4 }}>
                      {ORGAN_OPTIONS.map(o => (
                        <label key={o} style={{ display:'flex', alignItems:'center', gap:4, cursor:'pointer', fontSize:13, padding:'4px 10px', border:`1px solid ${form.organ_types.includes(o) ? 'var(--primary)' : 'var(--border)'}`, borderRadius:20, background: form.organ_types.includes(o) ? '#dbeafe' : 'transparent' }}>
                          <input type="checkbox" checked={form.organ_types.includes(o)} onChange={() => toggleOrgan(o)} style={{ display:'none' }} />
                          {o}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Hospital'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
