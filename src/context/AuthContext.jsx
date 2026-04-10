import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Try to restore user from localStorage cache first, then verify with backend
  const initAuth = useCallback(async () => {
    const token = localStorage.getItem('authToken')
    const cachedUser = localStorage.getItem('authUser')

    if (!token) {
      setLoading(false)
      return
    }

    // Instantly show cached user while we verify in background
    if (cachedUser) {
      try { setUser(JSON.parse(cachedUser)) } catch {}
    }

    try {
      const { data } = await authService.getCurrentUser()
      setUser(data)
      localStorage.setItem('authUser', JSON.stringify(data))
    } catch {
      // Token invalid — clear everything
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    initAuth()
  }, [initAuth])

  // Called by AuthCallbackPage after OAuth redirect with token + user info
  const loginWithToken = useCallback((token, userInfo) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('authUser', JSON.stringify(userInfo))
    setUser(userInfo)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setUser(null)
    authService.logout()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, loginWithToken, initAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
