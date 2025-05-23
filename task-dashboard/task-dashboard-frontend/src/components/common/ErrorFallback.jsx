"use client"
import { Button, Typography, Container, Paper } from "@mui/material"
import { Error } from "@mui/icons-material"
import "./ErrorFallback.css"

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <Container className="error-container">
      <Paper className="error-paper">
        <Error className="error-icon" />
        <Typography variant="h5" component="h2" className="error-title">
          Something went wrong
        </Typography>
        <Typography variant="body1" className="error-message">
          {error.message || "An unexpected error occurred"}
        </Typography>
        <Button variant="contained" color="primary" onClick={resetErrorBoundary} className="error-button">
          Try again
        </Button>
      </Paper>
    </Container>
  )
}

export default ErrorFallback
