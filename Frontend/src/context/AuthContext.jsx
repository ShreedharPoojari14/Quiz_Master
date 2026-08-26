import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api, { getErrorMessage } from '../api/axios.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('quizmaster_token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
    } catch (err) {
      localStorage.removeItem('quizmaster_token')
      localStorage.removeItem('quizmaster_user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  async function login(email, password) {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('quizmaster_token', data.token)
      localStorage.setItem('quizmaster_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true, user: data.user }
    } catch (err) {
      return { success: false, error: getErrorMessage(err) }
    }
  }

  async function register(name, email, password) {
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      localStorage.setItem('quizmaster_token', data.token)
      localStorage.setItem('quizmaster_user', JSON.stringify(data.user))
      setUser(data.user)
      return { success: true, user: data.user }
    } catch (err) {
      return { success: false, error: getErrorMessage(err) }
    }
  }

  function logout() {
    localStorage.removeItem('quizmaster_token')
    localStorage.removeItem('quizmaster_user')
    setUser(null)
  }

  function updateUserPoints(points) {
    setUser((prev) => (prev ? { ...prev, points } : prev))
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUserPoints, refreshUser: loadUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
