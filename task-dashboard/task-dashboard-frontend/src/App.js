"use client"

import React, { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { ErrorBoundary } from "react-error-boundary"
import { AuthContext } from "./context/AuthContext" // Import AuthContext

// Components
import Navbar from "./components/layout/Navbar"
import Sidebar from "./components/layout/Sidebar"
import Dashboard from "./pages/Dashboard"
import TimeTracking from "./pages/TimeTracking"
import Statistics from "./pages/Statistics"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ErrorFallback from "./components/common/ErrorFallback"

// Context
import { AuthProvider } from "./context/AuthContext"
import { TaskProvider } from "./context/TaskContext"
import { TimeEntryProvider } from "./context/TimeEntryContext"
import { ThemeContext } from "./context/ThemeContext"

// CSS
import "./App.css"

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true")

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#3f51b5",
      },
      secondary: {
        main: "#f50057",
      },
    },
  })

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("darkMode", newDarkMode)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AuthProvider>
            <TaskProvider>
              <TimeEntryProvider>
                <Router>
                  <div className="app">
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route
                        path="/*"
                        element={
                          <ProtectedLayout>
                            <Routes>
                              <Route path="/" element={<Dashboard />} />
                              <Route path="/time-tracking" element={<TimeTracking />} />
                              <Route path="/statistics" element={<Statistics />} />
                              <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                          </ProtectedLayout>
                        }
                      />
                    </Routes>
                  </div>
                </Router>
              </TimeEntryProvider>
            </TaskProvider>
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

function ProtectedLayout({ children }) {
  const { isAuthenticated, loading } = React.useContext(AuthContext)

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Navbar />
      <div className="content-container">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </>
  )
}

export default App
