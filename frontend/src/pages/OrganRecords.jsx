import React, { useState, useEffect } from 'react'
import { organsAPI } from '../lib/api'

const ORGANS = ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Cornea']
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const AGE_GROUPS = ['Under 18', '18-35', '36-50', '51-65', '65+']
const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor']
const STATUSES = ['Available', 'Matched', 'Transplanted', 'Expired']

const emptyForm = {
  organ_type: 'Kidney', blood_group: 'O+', donor_age: '36-50',
  donor_gender: 'Male', organ_condition: 'Good', location: '',
  availability_status: 'Available', donation_date: ''
}

export default function OrganRecords() {
  const [organs, setOrgans] = useState([])
  const [loading, setLoading] = useState(true)
  const [organFilter, setOrganFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [bgFilter, setBgFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [organFilter, statusFilter, bgFilter])

  const load = async () => {
    try {
      const params = {}
      if (organFilter !== 'All') params.organ_type = organFilter
      if (statusFilter !== 'All') params.status = statusFilter
      if (bgFilter !== 'All') params.blood_group = bgFilter
      const res = await organsAPI.getAll(params)
      setOrgans(res.data.data || [])
    } catch { }
    finally { setLoading(false) }
  }

  const openAdd = () => { setForm({...emptyForm, donation_date: new Date().toISOString().split('T')[0]}); setModal('add') }
  const openEdit = (o) => { setForm({...o}); setModal('edit') }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal === 'add') {
        const res = await organsAPI.create(form)
        setOrgans(prev => [res.data, ...prev])
      } else {
        const res = await organsAPI.update(form.id, form)
        setOrgans(prev => prev.map(o => o.id === form.id ? res.data : o))
      }
      setModal(null)
    } catch (err) { alert(err.response?.data?.error || err.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this organ record?')) return
    try {
      await organsAPI.delete(id)
      setOrgans(prev => prev.filter(o => o.id !== id))
    } catch (err) { alert(err.response?.data?.error || err.message || 'Delete failed') }
  }

  let filtered = organs
  if (search) filtered = filtered.filter(o => o.organ_type.toLowerCase().includes(search.toLowerCase()) || o.location?.toLowerCase().includes(search.toLowerCase()))

  const statusBg = { Available:'#d1fae5', Matched:'#fef3c7', Transplanted:'#dbeafe', Expired:'#f1f5f9' }
  const statusColor = { Available:'#059669', Matched:'#d97706', Transplanted:'#1e40af', Expired:'#64748b' }
  const conditionBg = { Excellent:'#d1fae5', Good:'#dbeafe', Fair:'#fef3c7', Poor:'#fee2e2' }

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <h1 className="page-title">💊 Organ Records</h1>
          <p className="page-subtitle">{filtered.length} organ records</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>➕ Add Record</button>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
        <div className="search-bar" style={{ maxWidth:260 }}>
          <span>🔍</span>
          <input placeholder="Search organ or location..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {[
          { label:'All Organs', options:['All',...ORGANS], value:organFilter, onChange:setOrganFilter },
          { label:'All Status', options:['All',...STATUSES], value:statusFilter, onChange:setStatusFilter },
          { label:'All Blood Groups', options:['All',...BLOOD_GROUPS], value:bgFilter, onChange:setBgFilter },
        ].map(f => (
          <select key={f.label} className="form-select" style={{ width:'auto' }} value={f.value} onChange={e => f.onChange(e.target.value)}>
            {f.options.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Quick Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Available', val: organs.filter(o => o.availability_status === 'Available').length, color:'#059669' },
          { label:'Matched', val: organs.filter(o => o.availability_status === 'Matched').length, color:'#d97706' },
          { label:'Transplanted', val: organs.filter(o => o.availability_status === 'Transplanted').length, color:'#1e40af' },
          { label:'Total Records', val: organs.length, color:'#7c3aed' },
        ].map(s => (
          <div key={s.label} style={{ background:'white', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'12px', borderLeft:`3px solid ${s.color}` }}>
            <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">💊</div>
          <h3>No Records Found</h3>
          <p>Add organ records to begin tracking availability.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Organ Type</th>
                <th>Blood Group</th>
                <th>Donor Age</th>
                <th>Gender</th>
                <th>Condition</th>
                <th>Location</th>
                <th>Status</th>
                <th>Donation Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight:700 }}>{o.organ_type}</td>
                  <td><span className="badge badge-info">{o.blood_group}</span></td>
                  <td style={{ fontSize:13 }}>{o.donor_age}</td>
                  <td style={{ fontSize:13 }}>{o.donor_gender}</td>
                  <td>
                    <span style={{ background:conditionBg[o.organ_condition]||'#f1f5f9', padding:'2px 8px', borderRadius:12, fontSize:12, fontWeight:600 }}>
                      {o.organ_condition}
                    </span>
                  </td>
                  <td style={{ fontSize:13 }}>{o.location}</td>
                  <td>
                    <span style={{ background:statusBg[o.availability_status]||'#f1f5f9', color:statusColor[o.availability_status]||'#64748b', padding:'2px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>
                      {o.availability_status}
                    </span>
                  </td>
                  <td style={{ fontSize:12, color:'var(--text-muted)' }}>{o.donation_date || '—'}</td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(o)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth:520 }}>
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'add' ? '➕ Add Organ Record' : '✏️ Edit Record'}</h2>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Organ Type</label>
                    <select className="form-select" value={form.organ_type} onChange={e => setForm({...form, organ_type:e.target.value})}>
                      {ORGANS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select className="form-select" value={form.blood_group} onChange={e => setForm({...form, blood_group:e.target.value})}>
                      {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Donor Age Group</label>
                    <select className="form-select" value={form.donor_age} onChange={e => setForm({...form, donor_age:e.target.value})}>
                      {AGE_GROUPS.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Donor Gender</label>
                    <select className="form-select" value={form.donor_gender} onChange={e => setForm({...form, donor_gender:e.target.value})}>
                      {['Male','Female','Other'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Organ Condition</label>
                    <select className="form-select" value={form.organ_condition} onChange={e => setForm({...form, organ_condition:e.target.value})}>
                      {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Availability Status</label>
                    <select className="form-select" value={form.availability_status} onChange={e => setForm({...form, availability_status:e.target.value})}>
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input className="form-input" value={form.location} onChange={e => setForm({...form, location:e.target.value})} placeholder="City/Region" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Donation Date</label>
                    <input type="date" className="form-input" value={form.donation_date} onChange={e => setForm({...form, donation_date:e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
