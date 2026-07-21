import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PredictionPage from './pages/PredictionPage'
import PredictionHistory from './pages/PredictionHistory'
import Patients from './pages/Patients'
import Analytics from './pages/Analytics'
import Hospitals from './pages/Hospitals'
import OrganRecords from './pages/OrganRecords'
import Insights from './pages/Insights'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predict" element={<PredictionPage />} />
            <Route path="/history" element={<PredictionHistory />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/organs" element={<OrganRecords />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
