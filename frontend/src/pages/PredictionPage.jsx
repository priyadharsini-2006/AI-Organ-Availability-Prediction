import React, { useState } from 'react'
import { predictionsAPI } from '../lib/api'
import { useNavigate } from 'react-router-dom'

const ORGANS = ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Cornea']
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const AGE_GROUPS = ['Under 18', '18-35', '36-50', '51-65', '65+']
const GENDERS = ['Male', 'Female', 'Other']
const HEALTH_STATUS = ['Excellent', 'Good', 'Fair', 'Poor']
const ORGAN_CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor']
const AVAILABILITY_TRENDS = ['Increasing', 'Stable', 'Decreasing', 'Unknown']
const SEASONAL_FACTORS = ['High', 'Normal', 'Low']

const initialForm = {
  organType: 'Kidney', bloodGroup: 'O+', donorAgeGroup: '36-50',
  donorGender: 'Male', donorHealthStatus: 'Good', donorLocation: 'North Urban',
  organCondition: 'Good', historicalDonationCount: '25',
  currentWaitingListDemand: '45', hospitalsRequesting: '8',
  previousAvailabilityTrend: 'Stable', seasonalFactor: 'Normal'
}

export default function PredictionPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const f = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await predictionsAPI.create(form)
      setResult(res.data)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setResult(null); setForm(initialForm) }

  return (
    <div className="fade-in">
      {result ? (
        <PredictionResult result={result} onReset={reset} onHistory={() => navigate('/history')} />
      ) : (
        <>
          <div className="page-header">
            <h1 className="page-title">🤖 AI Organ Availability Prediction</h1>
            <p className="page-subtitle">Fill in the form below to generate an AI-powered organ availability prediction</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20, alignItems:'start' }}>
              {/* Main form */}
              <div style={{ display:'grid', gap:20 }}>
                {/* Organ Info */}
                <div className="card">
                  <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>🫀 Organ Information</h3>
                  <div className="grid-2">
                    <FormSelect label="Organ Type *" value={form.organType} onChange={v => f('organType', v)} options={ORGANS} />
                    <FormSelect label="Blood Group *" value={form.bloodGroup} onChange={v => f('bloodGroup', v)} options={BLOOD_GROUPS} />
                    <FormSelect label="Organ Condition *" value={form.organCondition} onChange={v => f('organCondition', v)} options={ORGAN_CONDITIONS} />
                    <FormSelect label="Donor Location" value={form.donorLocation} onChange={v => f('donorLocation', v)} options={['North Urban','South Urban','East Rural','West Urban','Central Urban','North Central','North Rural','South Rural']} />
                  </div>
                </div>

                {/* Donor Info */}
                <div className="card">
                  <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>👤 Donor Information</h3>
                  <div className="grid-2">
                    <FormSelect label="Donor Age Group" value={form.donorAgeGroup} onChange={v => f('donorAgeGroup', v)} options={AGE_GROUPS} />
                    <FormSelect label="Donor Gender" value={form.donorGender} onChange={v => f('donorGender', v)} options={GENDERS} />
                    <FormSelect label="Donor Health Status" value={form.donorHealthStatus} onChange={v => f('donorHealthStatus', v)} options={HEALTH_STATUS} />
                  </div>
                </div>

                {/* Historical & Demand */}
                <div className="card">
                  <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>📊 Historical Data & Demand</h3>
                  <div className="grid-2">
                    <FormInput label="Historical Donation Count" type="number" min={0} max={500} value={form.historicalDonationCount} onChange={v => f('historicalDonationCount', v)} placeholder="e.g. 25" />
                    <FormInput label="Current Waiting List Demand" type="number" min={0} max={1000} value={form.currentWaitingListDemand} onChange={v => f('currentWaitingListDemand', v)} placeholder="e.g. 45" />
                    <FormInput label="Hospitals Requesting Organ" type="number" min={0} max={100} value={form.hospitalsRequesting} onChange={v => f('hospitalsRequesting', v)} placeholder="e.g. 8" />
                    <FormSelect label="Previous Availability Trend" value={form.previousAvailabilityTrend} onChange={v => f('previousAvailabilityTrend', v)} options={AVAILABILITY_TRENDS} />
                    <FormSelect label="Seasonal Factor" value={form.seasonalFactor} onChange={v => f('seasonalFactor', v)} options={SEASONAL_FACTORS} />
                  </div>
                </div>
              </div>

              {/* Summary sidebar */}
              <div>
                <div className="card" style={{ position:'sticky', top:24 }}>
                  <h3 style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>Prediction Summary</h3>
                  <SummaryItem label="Organ" value={form.organType} emoji="💊" />
                  <SummaryItem label="Blood Group" value={form.bloodGroup} emoji="🩸" />
                  <SummaryItem label="Donor Age" value={form.donorAgeGroup} emoji="👤" />
                  <SummaryItem label="Organ Condition" value={form.organCondition} emoji="✅" />
                  <SummaryItem label="Waiting List" value={`${form.currentWaitingListDemand} patients`} emoji="⏳" />
                  <SummaryItem label="Historical Donations" value={form.historicalDonationCount} emoji="📋" />
                  <SummaryItem label="Trend" value={form.previousAvailabilityTrend} emoji="📈" />
                  <hr style={{ margin:'16px 0', border:'none', borderTop:'1px solid var(--border)' }} />
                  <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', padding:'14px' }} disabled={loading}>
                    {loading ? '⏳ Analyzing...' : '🤖 Generate AI Prediction'}
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" style={{ width:'100%', justifyContent:'center', marginTop:8 }} onClick={() => setForm(initialForm)}>
                    ↺ Reset Form
                  </button>
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

function PredictionResult({ result, onReset, onHistory }) {
  const levelColor = result.availabilityLevel === 'High' ? '#059669' : result.availabilityLevel === 'Medium' ? '#d97706' : '#dc2626'
  const levelBg = result.availabilityLevel === 'High' ? '#d1fae5' : result.availabilityLevel === 'Medium' ? '#fef3c7' : '#fee2e2'
  const scoreClass = result.availabilityLevel === 'High' ? 'score-high' : result.availabilityLevel === 'Medium' ? 'score-medium' : 'score-low'

  const breakdown = result.breakdown || {}

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <h1 className="page-title">🤖 Prediction Result</h1>
          <p className="page-subtitle">AI analysis completed — {new Date().toLocaleString()}</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-ghost" onClick={onReset}>↺ New Prediction</button>
          <button className="btn btn-outline" onClick={onHistory}>📋 View History</button>
        </div>
      </div>

      {/* Main Result Card */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        {/* Score card */}
        <div className="card" style={{ borderTop:`4px solid ${levelColor}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
            <div>
              <h2 style={{ fontSize:20, fontWeight:800 }}>{result.organType}</h2>
              <span className="badge badge-info" style={{ marginTop:4 }}>{result.bloodGroup}</span>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ background:levelBg, color:levelColor, padding:'6px 16px', borderRadius:20, fontWeight:700, fontSize:15 }}>
                {result.availabilityLevel} Availability
              </div>
            </div>
          </div>

          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:64, fontWeight:800, color:levelColor, lineHeight:1 }}>{result.predictionScore}</div>
            <div style={{ fontSize:16, color:'var(--text-muted)', marginTop:4 }}>Availability Probability</div>
            <div style={{ marginTop:12 }}>
              <div className="score-bar"><div className={`score-fill ${scoreClass}`} style={{ width:`${result.predictionScore}%` }} /></div>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:8 }}>
            <ResultStat label="Confidence Score" value={`${result.confidenceScore}%`} />
            <ResultStat label="Demand Level" value={result.demandLevel} />
            <ResultStat label="Estimated Time" value={result.estimatedAvailabilityTime} full />
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="card">
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>📊 Score Breakdown</h3>
          {[
            { label:'Historical Availability', val: breakdown.historicalScore, weight:'30%' },
            { label:'Donation Trend', val: breakdown.donationTrendScore, weight:'20%' },
            { label:'Regional Availability', val: breakdown.regionalScore, weight:'15%' },
            { label:'Organ Demand (Inverse)', val: breakdown.organDemandScore, weight:'15%' },
            { label:'Blood Group Availability', val: breakdown.bloodAvailScore, weight:'10%' },
            { label:'Seasonal Trend', val: breakdown.seasonalScore, weight:'10%' },
          ].map(item => (
            <div key={item.label} style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:3 }}>
                <span style={{ color:'var(--text-muted)' }}>{item.label} <span style={{ color:'var(--text-light)' }}>({item.weight})</span></span>
                <span style={{ fontWeight:700 }}>{item.val ?? '—'}</span>
              </div>
              <div className="score-bar" style={{ height:6 }}>
                <div className={`score-fill ${item.val >= 70 ? 'score-high' : item.val >= 45 ? 'score-medium' : 'score-low'}`} style={{ width:`${item.val ?? 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="card" style={{ marginBottom:20 }}>
        <h3 style={{ fontSize:16, fontWeight:700, marginBottom:12 }}>🧠 AI Prediction Explanation</h3>
        <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.8, background:'#f8fafc', padding:16, borderRadius:'var(--radius)', borderLeft:'4px solid var(--primary)' }}>
          {result.explanation}
        </p>
      </div>

      {/* Factors */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div className="card">
          <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12, color:'#059669' }}>✅ Positive Factors</h3>
          {(result.positiveFactors || []).map((f,i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:10, padding:'8px 12px', background:'#f0fdf4', borderRadius:'var(--radius)', fontSize:13 }}>
              <span>✔</span> <span>{f}</span>
            </div>
          ))}
          {(!result.positiveFactors || result.positiveFactors.length === 0) && <p style={{ fontSize:13, color:'var(--text-muted)' }}>No significant positive factors identified.</p>}
        </div>
        <div className="card">
          <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12, color:'#dc2626' }}>⚠️ Negative Factors</h3>
          {(result.negativeFactors || []).map((f,i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:10, padding:'8px 12px', background:'#fef2f2', borderRadius:'var(--radius)', fontSize:13 }}>
              <span>⚠</span> <span>{f}</span>
            </div>
          ))}
          {(!result.negativeFactors || result.negativeFactors.length === 0) && <p style={{ fontSize:13, color:'var(--text-muted)' }}>No significant negative factors identified.</p>}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="alert alert-warning" style={{ marginTop:20 }}>
        ⚠️ <strong>Medical Disclaimer:</strong> This prediction is a decision-support tool only. It must not replace medical professionals or official organ allocation authorities. Always consult qualified healthcare professionals.
      </div>
    </div>
  )
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-select" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function FormInput({ label, type='text', value, onChange, placeholder, min, max }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input type={type} className="form-input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} min={min} max={max} />
    </div>
  )
}

function SummaryItem({ label, value, emoji }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
      <span style={{ color:'var(--text-muted)' }}>{emoji} {label}</span>
      <span style={{ fontWeight:600 }}>{value}</span>
    </div>
  )
}

function ResultStat({ label, value, full }) {
  return (
    <div style={{ background:'var(--bg)', padding:'10px 12px', borderRadius:'var(--radius)', gridColumn: full ? '1 / -1' : undefined }}>
      <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:2 }}>{label}</div>
      <div style={{ fontSize:14, fontWeight:700 }}>{value}</div>
    </div>
  )
}
