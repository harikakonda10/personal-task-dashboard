"use client"

import { createContext, useState, useEffect, useContext } from "react"
import api from "../utils/api"
import { AuthContext } from "./AuthContext"

export const TimeEntryContext = createContext()

export const TimeEntryProvider = ({ children }) => {
  const [timeEntries, setTimeEntries] = useState([])
  const [activeEntry, setActiveEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    if (isAuthenticated) {
      fetchTimeEntries()
      checkActiveTimeEntry()
    }
  }, [isAuthenticated])

  const fetchTimeEntries = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/time-entries")
      setTimeEntries(response.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch time entries")
    } finally {
      setLoading(false)
    }
  }

  const checkActiveTimeEntry = async () => {
    try {
      const response = await api.get("/api/time-entries/active")
      setActiveEntry(response.data || null)
    } catch (err) {
      console.error("Failed to check active time entry:", err)
      setActiveEntry(null)
    }
  }

  const startTimeEntry = async (taskId) => {
    try {
      setLoading(true)
      const response = await api.post("/api/time-entries/start", { taskId })
      setActiveEntry(response.data)
      setTimeEntries([...timeEntries, response.data])
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start time entry")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const stopTimeEntry = async (id) => {
    try {
      setLoading(true)
      const response = await api.put(`/api/time-entries/${id}/stop`)
      setActiveEntry(null)
      setTimeEntries(timeEntries.map((entry) => (entry.id === id ? response.data : entry)))
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to stop time entry")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTimeEntry = async (id, data) => {
    try {
      setLoading(true)
      const response = await api.put(`/api/time-entries/${id}`, data)
      setTimeEntries(timeEntries.map((entry) => (entry.id === id ? response.data : entry)))
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update time entry")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTimeEntry = async (id) => {
    try {
      setLoading(true)
      await api.delete(`/api/time-entries/${id}`)
      setTimeEntries(timeEntries.filter((entry) => entry.id !== id))
      if (activeEntry && activeEntry.id === id) {
        setActiveEntry(null)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete time entry")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <TimeEntryContext.Provider
      value={{
        timeEntries,
        activeEntry,
        loading,
        error,
        fetchTimeEntries,
        startTimeEntry,
        stopTimeEntry,
        updateTimeEntry,
        deleteTimeEntry,
      }}
    >
      {children}
    </TimeEntryContext.Provider>
  )
}
