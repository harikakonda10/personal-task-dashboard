"use client"

import { createContext, useState, useEffect, useContext } from "react"
import api from "../utils/api"
import { AuthContext } from "./AuthContext"

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { isAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks()
    }
  }, [isAuthenticated])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/tasks")
      setTasks(response.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (taskData) => {
    try {
      setLoading(true)
      const response = await api.post("/api/tasks", taskData)
      setTasks([...tasks, response.data])
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async (id, taskData) => {
    try {
      setLoading(true)
      const response = await api.put(`/api/tasks/${id}`, taskData)
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)))
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id) => {
    try {
      setLoading(true)
      await api.delete(`/api/tasks/${id}`)
      setTasks(tasks.filter((task) => task.id !== id))
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
