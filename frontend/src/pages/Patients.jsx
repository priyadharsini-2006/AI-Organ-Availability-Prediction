import React, { useState, useEffect } from 'react'
import { patientsAPI } from '../lib/api'

const ORGAN_OPTIONS = ['All', 'Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Cornea']
const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low']
const STATUSES = ['Active', 'Matched', 'Transplant Completed', 'Removed']
const ORGANS_ONLY = ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Cornea']
const BLOOD_ONLY = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const emptyForm = {
  patient_name: '', age: '', blood_group: 'O+', required_organ: 'Kidney',
  medical_priority: 'High', waiting_duration: '', hospital: '',
  location: '', status: 'Active'
}

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [organFilter, setOrganFilter] = useState('All')
  const [bloodFilter, setBloodFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('priority')
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [organFilter, bloodFilter, statusFilter, sortBy])

  const load = async () => {
    try {
      const params = { sort_by: sortBy }
      if (organFilter !== 'All') params.required_organ = organFilter
      if (bloodFilter !== 'All') params.blood_group = bloodFilter
      if (statusFilter !== 'All') params.status = statusFilter
      const res = await patientsAPI.getAll(params)
      setPatients(res.data.data || [])
    } catch { setError('Failed to load patients') }
    finally { setLoading(false) }
  }

  const openAdd = () => { setForm(emptyForm); setModal('add') }
  const openEdit = (p) => { setForm({ ...p }); setModal('edit') }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal === 'add') {
        const res = await patientsAPI.create(form)
        setPatients(prev => [res.data, ...prev])
      } else {
        const res = await patientsAPI.update(form.id, form)
        setPatients(prev => prev.map(p => p.id === form.id ? res.data : p))
      }
      setModal(null)
    } catch (err) { alert(err.response?.data?.error || err.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this patient from the waiting list?')) return
    try {
      await patientsAPI.delete(id)
      setPatients(prev => prev.filter(p => p.id !== id))
    } catch (err) { alert(err.response?.data?.error || err.message || 'Delete failed') }
  }

  let filtered = patients
  if (search) filtered = filtered.filter(p => p.patient_name.toLowerCase().includes(search.toLowerCase()) || p.hospital?.toLowerCase().includes(search.toLowerCase()))

  const priorityColor = { Critical:'var(--danger)', High:'#d97706', Medium:'#2563eb', Low:'#059669' }
  const statusBadge = { Active:'badge-info', Matched:'badge-warning', 'Transplant Completed':'badge-success', Removed:'badge-gray' }

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 className="page-title">🏥 Patient Waiting List</h1>
          <p className="page-subtitle">{filtered.length} patients · Sorted by AI priority score</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>➕ Add Patient</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <div className="search-bar" style={{ maxWidth:260 }}>
          <span>🔍</span>
          <input placeholder="Search patient or hospital..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width:'auto' }} value={organFilter} onChange={e => setOrganFilter(e.target.value)}>
          {ORGAN_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
        <select className="form-select" style={{ width:'auto' }} value={bloodFilter} onChange={e => setBloodFilter(e.target.value)}>
          {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
        </select>
        <select className="form-select" style={{ width:'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {['All', ...STATUSES].map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="form-select" style={{ width:'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="priority">Sort: AI Priority</option>
          <option value="waiting">Sort: Waiting Duration</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      {/* Summary cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:20 }}>
        {[
          { label:'Total Active', val: patients.filter(p => p.status === 'Active').length, color:'#1e40af' },
          { label:'Critical Priority', val: patients.filter(p => p.medical_priority === 'Critical').length, color:'#dc2626' },
          { label:'Matched', val: patients.filter(p => p.status === 'Matched').length, color:'#d97706' },
          { label:'Transplant Completed', val: patients.filter(p => p.status === 'Transplant Completed').length, color:'#059669' },
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
          <div className="icon">🏥</div>
          <h3>No Patients Found</h3>
          <p>Add a patient to the waiting list to get started.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Blood Group</th>
                <th>Organ Needed</th>
                <th>Hospital</th>
                <th>Waiting (months)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:priorityColor[p.medical_priority] }}>{p.medical_priority}</span>
                      <div style={{ width:40, height:4, background:'var(--border)', borderRadius:2 }}>
                        <div style={{ width:`${p.priority_score ?? 0}%`, height:'100%', background:priorityColor[p.medical_priority], borderRadius:2 }} />
                      </div>
                      <span style={{ fontSize:10, color:'var(--text-light)' }}>{p.priority_score ?? 0}/100</span>
                    </div>
                  </td>
                  <td style={{ fontWeight:600 }}>{p.patient_name}</td>
                  <td>{p.age}</td>
                  <td><span className="badge badge-info">{p.blood_group}</span></td>
                  <td>{p.required_organ}</td>
                  <td style={{ fontSize:13 }}>{p.hospital}</td>
                  <td style={{ fontWeight:600 }}>{p.waiting_duration}</td>
                  <td><span className={`badge ${statusBadge[p.status] || 'badge-gray'}`}>{p.status}</span></td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth:560 }}>
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'add' ? '➕ Add Patient' : '✏️ Edit Patient'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Patient Name *</label>
                    <input className="form-input" required value={form.patient_name} onChange={e => setForm({...form, patient_name:e.target.value})} placeholder="Full name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input type="number" className="form-input" value={form.age} onChange={e => setForm({...form, age:e.target.value})} min={0} max={120} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select className="form-select" value={form.blood_group} onChange={e => setForm({...form, blood_group:e.target.value})}>
                      {BLOOD_ONLY.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Required Organ</label>
                    <select className="form-select" value={form.required_organ} onChange={e => setForm({...form, required_organ:e.target.value})}>
                      {ORGANS_ONLY.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Medical Priority</label>
                    <select className="form-select" value={form.medical_priority} onChange={e => setForm({...form, medical_priority:e.target.value})}>
                      {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Waiting Duration (months)</label>
                    <input type="number" className="form-input" value={form.waiting_duration} onChange={e => setForm({...form, waiting_duration:e.target.value})} min={0} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hospital</label>
                    <input className="form-input" value={form.hospital} onChange={e => setForm({...form, hospital:e.target.value})} placeholder="Hospital name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input className="form-input" value={form.location} onChange={e => setForm({...form, location:e.target.value})} placeholder="City/Region" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm({...form, status:e.target.value})}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : modal === 'add' ? 'Add Patient' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
