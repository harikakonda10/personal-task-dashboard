"use client"

import { useState, useContext } from "react"
import {
  Typography,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material"
import TimeTracker from "../components/time/TimeTracker"
import TimeEntryList from "../components/time/TimeEntryList"
import { TimeEntryContext } from "../context/TimeEntryContext"
import "./TimeTracking.css"

const TimeTracking = () => {
  const { timeEntries, updateTimeEntry, loading, error } = useContext(TimeEntryContext)
  const [editingEntry, setEditingEntry] = useState(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [notes, setNotes] = useState("")

  const handleEditEntry = (entry) => {
    setEditingEntry(entry)
    setNotes(entry.notes || "")
    setEditDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setEditDialogOpen(false)
    setEditingEntry(null)
  }

  const handleSaveNotes = async () => {
    try {
      await updateTimeEntry(editingEntry.id, { notes })
      setEditDialogOpen(false)
      setEditingEntry(null)
    } catch (error) {
      console.error("Failed to update time entry:", error)
    }
  }

  const getTotalTimeSpent = () => {
    let totalSeconds = 0

    timeEntries.forEach((entry) => {
      if (entry.startTime && entry.endTime) {
        const start = new Date(entry.startTime).getTime()
        const end = new Date(entry.endTime).getTime()
        totalSeconds += Math.floor((end - start) / 1000)
      }
    })

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)

    return { hours, minutes }
  }

  const { hours, minutes } = getTotalTimeSpent()

  if (loading) {
    return <div className="loading">Loading time entries...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="time-tracking fade-in">
      <Typography variant="h4" component="h1" className="page-title">
        Time Tracking
      </Typography>

      <TimeTracker />

      <Grid container spacing={3} className="time-summary">
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="summary-paper">
            <Typography variant="h6" className="summary-label">
              Total Time
            </Typography>
            <Typography variant="h4" className="summary-value">
              {hours}h {minutes}m
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="summary-paper">
            <Typography variant="h6" className="summary-label">
              Entries
            </Typography>
            <Typography variant="h4" className="summary-value">
              {timeEntries.length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="summary-paper">
            <Typography variant="h6" className="summary-label">
              Today
            </Typography>
            <Typography variant="h4" className="summary-value">
              {getTodayEntries()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className="summary-paper">
            <Typography variant="h6" className="summary-label">
              This Week
            </Typography>
            <Typography variant="h4" className="summary-value">
              {getWeekEntries()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" className="section-title">
        Time Entry History
      </Typography>

      <TimeEntryList onEditEntry={handleEditEntry} />

      <Dialog open={editDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Edit Time Entry</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveNotes} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )

  function getTodayEntries() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return timeEntries.filter((entry) => {
      const entryDate = new Date(entry.startTime)
      entryDate.setHours(0, 0, 0, 0)
      return entryDate.getTime() === today.getTime()
    }).length
  }

  function getWeekEntries() {
    const today = new Date()
    const firstDayOfWeek = new Date(today)
    const day = today.getDay() || 7 // Convert Sunday from 0 to 7
    firstDayOfWeek.setDate(today.getDate() - day + 1) // Monday
    firstDayOfWeek.setHours(0, 0, 0, 0)

    return timeEntries.filter((entry) => {
      const entryDate = new Date(entry.startTime)
      return entryDate >= firstDayOfWeek
    }).length
  }
}

export default TimeTracking
