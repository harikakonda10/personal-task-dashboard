"use client"

import { createContext, useState, useEffect } from "react"
import api from "../utils/api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setLoading(false)
        return
      }

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`
        const response = await api.get("/api/users/me")
        setUser(response.data)
        setIsAuthenticated(true)
      } catch (err) {
        localStorage.removeItem("token")
        delete api.defaults.headers.common["Authorization"]
        setError(err.response?.data?.message || "Authentication failed")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await api.post("/api/auth/login", { email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(user)
      setIsAuthenticated(true)
      setError(null)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    try {
      setLoading(true)
      const response = await api.post("/api/auth/register", { name, email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(user)
      setIsAuthenticated(true)
      setError(null)
      return true
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
