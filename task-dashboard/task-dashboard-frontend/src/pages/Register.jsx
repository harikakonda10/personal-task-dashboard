"use client"

import { useState, useContext } from "react"
import { Container, Paper, Typography, TextField, Button, Box, Link, Alert } from "@mui/material"
import { Link as RouterLink, Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import "./Auth.css"

const Register = () => {
  const { register, isAuthenticated, error } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      await register(formData.name, formData.email, formData.password)
    }
  }

  return (
    <Container maxWidth="sm" className="auth-container">
      <Paper elevation={3} className="auth-paper">
        <Typography variant="h4" component="h1" className="auth-title">
          Register
        </Typography>

        {error && (
          <Alert severity="error" className="auth-alert">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <TextField
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!formErrors.name}
            helperText={formErrors.name}
            required
          />

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

          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
            required
          />

          <Button type="submit" variant="contained" color="primary" fullWidth size="large" className="auth-button">
            Register
          </Button>

          <Box className="auth-links">
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account? Login
            </Link>
          </Box>
        </form>
      </Paper>
    </Container>
  )
}

export default Register
