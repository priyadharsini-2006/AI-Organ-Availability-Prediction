import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = async (email, password) => {
    setForm({ email, password })
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Demo login failed: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #1e3a8a, #2563eb)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        {/* Card */}
        <div className="card" style={{ padding:36 }}>
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>🏥</div>
            <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text)', marginBottom:4 }}>Welcome Back</h1>
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>Sign in to AI Organ Availability Prediction</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ width:'100%', justifyContent:'center', marginTop:8 }}>
              {loading ? '⏳ Signing in...' : '🔑 Sign In'}
            </button>
          </form>

          <div style={{ marginTop:20 }}>
            <p style={{ fontSize:12, color:'var(--text-muted)', textAlign:'center', marginBottom:10, fontWeight:600 }}>DEMO ACCOUNTS</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {[
                { label:'Admin', email:'admin@organpredict.com', password:'Admin@123' },
                { label:'Staff', email:'staff@organpredict.com', password:'Staff@123' },
                { label:'Coordinator', email:'coordinator@organpredict.com', password:'Coord@123' },
              ].map(d => (
                <button key={d.label} className="btn btn-ghost btn-sm" onClick={() => demoLogin(d.email, d.password)} style={{ fontSize:12, justifyContent:'center' }}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <p style={{ textAlign:'center', fontSize:13, marginTop:20, color:'var(--text-muted)' }}>
            Don't have an account? <Link to="/register" style={{ color:'var(--primary)', fontWeight:600 }}>Register</Link>
          </p>
          <p style={{ textAlign:'center', fontSize:13, marginTop:6 }}>
            <Link to="/" style={{ color:'var(--text-muted)' }}>← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
