"use client"

import { useContext } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
} from "@mui/material"
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material"
import { TimeEntryContext } from "../../context/TimeEntryContext"
import { TaskContext } from "../../context/TaskContext"
import "./TimeEntryList.css"

const TimeEntryList = ({ onEditEntry }) => {
  const { timeEntries, deleteTimeEntry } = useContext(TimeEntryContext)
  const { tasks } = useContext(TaskContext)

  const getTaskTitle = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    return task ? task.title : "Unknown Task"
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const formatDuration = (startTime, endTime) => {
    if (!endTime) return "In progress"

    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    const durationMs = end - start

    const seconds = Math.floor(durationMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    return `${hours}h ${minutes % 60}m ${seconds % 60}s`
  }

  const handleDelete = async (id) => {
    try {
      await deleteTimeEntry(id)
    } catch (error) {
      console.error("Failed to delete time entry:", error)
    }
  }

  if (timeEntries.length === 0) {
    return (
      <div className="empty-entries">
        <Typography variant="body1">No time entries recorded yet.</Typography>
      </div>
    )
  }

  return (
    <TableContainer component={Paper} className="time-entry-table fade-in">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell>Start Time</TableCell>
            <TableCell>End Time</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {timeEntries.map((entry) => (
            <TableRow key={entry.id} className={!entry.endTime ? "active-entry" : ""}>
              <TableCell>{getTaskTitle(entry.taskId)}</TableCell>
              <TableCell>{formatDate(entry.startTime)}</TableCell>
              <TableCell>
                {entry.endTime ? (
                  formatDate(entry.endTime)
                ) : (
                  <Chip label="In Progress" color="primary" size="small" className="in-progress-chip" />
                )}
              </TableCell>
              <TableCell>{formatDuration(entry.startTime, entry.endTime)}</TableCell>
              <TableCell>
                <div className="entry-actions">
                  {entry.endTime && (
                    <IconButton size="small" onClick={() => onEditEntry(entry)} className="edit-button">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton size="small" onClick={() => handleDelete(entry.id)} className="delete-button">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TimeEntryList
