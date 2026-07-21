import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon:'🤖', title:'AI-Powered Prediction', desc:'Weighted scoring algorithm analyzes 8+ factors to predict organ availability with confidence scores.' },
  { icon:'📊', title:'Real-Time Analytics', desc:'Interactive dashboards with live charts showing organ demand, availability trends, and waiting list growth.' },
  { icon:'💡', title:'Explainable AI', desc:'Every prediction comes with a clear explanation of positive and negative factors that influenced the result.' },
  { icon:'🏥', title:'Hospital Management', desc:'Track hospital demands, organ requests, and coordinate across multiple healthcare facilities.' },
  { icon:'📋', title:'Patient Waiting List', desc:'Manage and prioritize transplant candidates with AI-calculated priority scores based on medical urgency.' },
  { icon:'🔒', title:'Secure & Compliant', desc:'Role-based access control with Supabase authentication ensures patient data is protected at all times.' },
]

const steps = [
  { num:'01', title:'Input Patient Data', desc:'Enter organ type, blood group, donor details, and regional availability data.' },
  { num:'02', title:'AI Analyzes Factors', desc:'The prediction engine calculates weighted scores across historical data, trends, and demand indicators.' },
  { num:'03', title:'Get Predictions', desc:'Receive availability probability, confidence score, estimated timeframe, and full explanation.' },
  { num:'04', title:'Make Decisions', desc:'Use AI insights to support critical medical decisions, resource allocation, and transplant planning.' },
]

const stats = [
  { val:'6+', label:'Organ Types Covered' },
  { val:'8', label:'AI Prediction Factors' },
  { val:'8', label:'Blood Groups' },
  { val:'100%', label:'Free to Use' },
]

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ minHeight:'100vh', background:'white' }}>
      {/* Nav */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 40px', background:'white', borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:26 }}>🏥</span>
          <div>
            <div style={{ fontWeight:800, fontSize:16, color:'var(--primary)', lineHeight:1.1 }}>AI Organ Availability</div>
            <div style={{ fontSize:11, color:'var(--text-muted)' }}>IBM AI Builders Challenge</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          {user ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard →</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background:'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)', color:'white', padding:'80px 40px', textAlign:'center' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <div style={{ display:'inline-block', background:'rgba(255,255,255,0.15)', padding:'6px 18px', borderRadius:20, fontSize:13, marginBottom:20, fontWeight:600 }}>
            🏆 IBM AI Builders Challenge — July 2025
          </div>
          <h1 style={{ fontSize:48, fontWeight:800, lineHeight:1.15, marginBottom:20 }}>
            Predict Organ Availability
            <span style={{ display:'block', color:'#93c5fd' }}>with Artificial Intelligence</span>
          </h1>
          <p style={{ fontSize:18, opacity:0.85, maxWidth:600, margin:'0 auto 36px', lineHeight:1.7 }}>
            An AI-powered decision-support platform that analyzes historical data, donation trends, and demand patterns to predict organ availability and assist healthcare professionals.
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/register" className="btn btn-lg" style={{ background:'white', color:'var(--primary)', fontWeight:700 }}>
              🚀 Get Started — It's Free
            </Link>
            <Link to="/login" className="btn btn-lg" style={{ background:'rgba(255,255,255,0.15)', color:'white', border:'2px solid rgba(255,255,255,0.4)' }}>
              Login →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background:'#f8fafc', padding:'40px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ maxWidth:800, margin:'0 auto', display:'flex', justifyContent:'center', gap:60, flexWrap:'wrap', textAlign:'center' }}>
          {stats.map(s => (
            <div key={s.val}>
              <div style={{ fontSize:36, fontWeight:800, color:'var(--primary)' }}>{s.val}</div>
              <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section style={{ padding:'72px 40px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <h2 style={{ fontSize:34, fontWeight:800, marginBottom:12 }}>About the System</h2>
          <p style={{ fontSize:16, color:'var(--text-muted)', maxWidth:600, margin:'0 auto', lineHeight:1.7 }}>
            AI Organ Availability Prediction uses an explainable AI model with weighted scoring to analyze complex medical and demographic data — providing meaningful predictions that support real-world decision-making.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>
          {features.map(f => (
            <div key={f.title} className="card" style={{ borderLeft:'4px solid var(--primary)' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>{f.icon}</div>
              <h3 style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>{f.title}</h3>
              <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background:'#f8fafc', padding:'72px 40px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <h2 style={{ fontSize:34, fontWeight:800, marginBottom:12 }}>How It Works</h2>
            <p style={{ fontSize:16, color:'var(--text-muted)' }}>Four simple steps to AI-powered organ availability insights</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:24 }}>
            {steps.map(s => (
              <div key={s.num} className="card" style={{ textAlign:'center' }}>
                <div style={{ fontSize:36, fontWeight:800, color:'var(--primary)', opacity:0.3, marginBottom:8 }}>{s.num}</div>
                <h3 style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>{s.title}</h3>
                <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Prediction Explained */}
      <section style={{ padding:'72px 40px', maxWidth:900, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <h2 style={{ fontSize:34, fontWeight:800, marginBottom:12 }}>AI Prediction Model</h2>
          <p style={{ fontSize:16, color:'var(--text-muted)' }}>Transparent, explainable weighted scoring — no black box</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize:17, fontWeight:700, marginBottom:16 }}>Prediction Score Formula</h3>
          <div style={{ display:'grid', gap:10 }}>
            {[
              ['Historical Availability Score', '30%', '#1e40af'],
              ['Donation Trend Score', '20%', '#059669'],
              ['Regional Availability Score', '15%', '#7c3aed'],
              ['Organ Demand Score', '15%', '#d97706'],
              ['Blood Group Availability Score', '10%', '#dc2626'],
              ['Seasonal Trend Score', '10%', '#0891b2'],
            ].map(([label, pct, color]) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:180, fontSize:13, fontWeight:600 }}>{label}</div>
                <div style={{ flex:1, height:8, background:'var(--border)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:pct, background:color, borderRadius:4 }} />
                </div>
                <div style={{ width:36, fontSize:13, fontWeight:700, color, textAlign:'right' }}>{pct}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:20, padding:16, background:'#f8fafc', borderRadius:'var(--radius)', fontSize:13, color:'var(--text-muted)' }}>
            Final score 0–100: <strong style={{color:'#166534'}}>71–100 = High</strong> · <strong style={{color:'#713f12'}}>41–70 = Medium</strong> · <strong style={{color:'#991b1b'}}>0–40 = Low</strong> availability
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'linear-gradient(135deg, #1e3a8a, #2563eb)', color:'white', padding:'60px 40px', textAlign:'center' }}>
        <h2 style={{ fontSize:32, fontWeight:800, marginBottom:12 }}>Ready to Get Started?</h2>
        <p style={{ fontSize:16, opacity:0.8, marginBottom:32 }}>Join healthcare professionals using AI to improve organ allocation decisions.</p>
        <Link to="/register" className="btn btn-lg" style={{ background:'white', color:'var(--primary)', fontWeight:700 }}>
          Create Free Account →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding:'32px 40px', textAlign:'center', fontSize:13, color:'var(--text-muted)', borderTop:'1px solid var(--border)' }}>
        <p style={{ marginBottom:8 }}>
          <strong style={{ color:'var(--primary)' }}>AI Organ Availability Prediction</strong> — IBM AI Builders Challenge, July 2025
        </p>
        <p>⚠️ This system is a <strong>decision-support tool only</strong> and must not replace medical professionals or official organ allocation authorities.</p>
        <p style={{ marginTop:8 }}>Built with React · Node.js · Supabase · Free Open-Source Technologies Only</p>
      </footer>
    </div>
  )
}
