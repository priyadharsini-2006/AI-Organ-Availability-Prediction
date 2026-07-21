import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'Hospital Staff' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.role)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #1e3a8a, #2563eb)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:460 }}>
        <div className="card" style={{ padding:36 }}>
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🏥</div>
            <h1 style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>Create Account</h1>
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>Join AI Organ Availability Prediction</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Dr. Jane Smith" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="you@hospital.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="Hospital Staff">Hospital Staff</option>
                <option value="Organ Coordinator">Organ Coordinator</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="••••••••" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-input" placeholder="••••••••" value={form.confirm}
                onChange={e => setForm({...form, confirm: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center' }}>
              {loading ? '⏳ Creating account...' : '✅ Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:13, marginTop:20, color:'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color:'var(--primary)', fontWeight:600 }}>Sign In</Link>
          </p>
          <p style={{ textAlign:'center', fontSize:13, marginTop:6 }}>
            <Link to="/" style={{ color:'var(--text-muted)' }}>← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
