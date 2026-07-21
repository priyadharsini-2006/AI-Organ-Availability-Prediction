import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('organ_user')
    const token = localStorage.getItem('organ_token')
    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    localStorage.setItem('organ_token', res.data.token)
    localStorage.setItem('organ_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  const register = async (name, email, password, role) => {
    const res = await authAPI.register({ name, email, password, role })
    localStorage.setItem('organ_token', res.data.token)
    localStorage.setItem('organ_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  const logout = () => {
    localStorage.removeItem('organ_token')
    localStorage.removeItem('organ_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'Admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
