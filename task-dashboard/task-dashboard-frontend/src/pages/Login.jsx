"use client"

import { useState, useContext } from "react"
import { Container, Paper, Typography, TextField, Button, Box, Link, Alert } from "@mui/material"
import { Link as RouterLink, Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import "./Auth.css"

const Login = () => {
  const { login, isAuthenticated, error } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [formErrors, setFormErrors] = useState({})

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      })
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      await login(formData.email, formData.password)
    }
  }

  return (
    <Container maxWidth="sm" className="auth-container">
      <Paper elevation={3} className="auth-paper">
        <Typography variant="h4" component="h1" className="auth-title">
          Login
        </Typography>

        {error && (
          <Alert severity="error" className="auth-alert">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!formErrors.email}
            helperText={formErrors.email}
            required
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!formErrors.password}
            helperText={formErrors.password}
            required
          />

          <Button type="submit" variant="contained" color="primary" fullWidth size="large" className="auth-button">
            Login
          </Button>

          <Box className="auth-links">
            <Link component={RouterLink} to="/register" variant="body2">
              Don't have an account? Register
            </Link>
          </Box>
        </form>
      </Paper>
    </Container>
  )
}

export default Login
