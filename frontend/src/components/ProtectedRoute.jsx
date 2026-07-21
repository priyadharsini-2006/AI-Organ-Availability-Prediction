import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (requiredRole && user.role !== requiredRole && user.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
