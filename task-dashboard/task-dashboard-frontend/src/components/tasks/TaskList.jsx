"use client"

import { useContext, useState } from "react"
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material"
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material"
import { TaskContext } from "../../context/TaskContext"
import { TimeEntryContext } from "../../context/TimeEntryContext"
import "./TaskList.css"

const TaskList = ({ onEditTask }) => {
  const { tasks, deleteTask } = useContext(TaskContext)
  const { activeEntry, startTimeEntry, stopTimeEntry } = useContext(TimeEntryContext)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)

  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget)
    setSelectedTask(task)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedTask(null)
  }

  const handleStartTimer = async (taskId) => {
    try {
      await startTimeEntry(taskId)
      handleMenuClose()
    } catch (error) {
      console.error("Failed to start timer:", error)
    }
  }

  const handleStopTimer = async () => {
    try {
      await stopTimeEntry(activeEntry.id)
      handleMenuClose()
    } catch (error) {
      console.error("Failed to stop timer:", error)
    }
  }

  const handleEdit = (task) => {
    onEditTask(task)
    handleMenuClose()
  }

  const handleDelete = async (id) => {
    try {
      await deleteTask(id)
      handleMenuClose()
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error"
      case "medium":
        return "warning"
      case "low":
        return "success"
      default:
        return "default"
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-list">
        <Typography variant="body1">No tasks found. Create your first task!</Typography>
      </div>
    )
  }

  return (
    <List className="task-list fade-in">
      {tasks.map((task) => {
        const isActive = activeEntry && activeEntry.taskId === task.id

        return (
          <ListItem key={task.id} className={`task-item ${isActive ? "active-task" : ""}`}>
            <ListItemText
              primary={task.title}
              secondary={
                <>
                  <span>{task.description}</span>
                  <div className="task-meta">
                    <Chip size="small" label={task.status} className="status-chip" />
                    <Chip
                      size="small"
                      color={getPriorityColor(task.priority)}
                      label={task.priority}
                      className="priority-chip"
                    />
                  </div>
                </>
              }
            />

            <ListItemSecondaryAction>
              {isActive ? (
                <IconButton
                  edge="end"
                  aria-label="stop timer"
                  onClick={() => handleStopTimer()}
                  className="stop-button"
                >
                  <StopIcon />
                </IconButton>
              ) : (
                <IconButton edge="end" aria-label="more options" onClick={(e) => handleMenuOpen(e, task)}>
                  <MoreIcon />
                </IconButton>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        )
      })}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {selectedTask && !activeEntry && (
          <MenuItem onClick={() => handleStartTimer(selectedTask.id)}>
            <StartIcon fontSize="small" className="menu-icon" />
            Start Timer
          </MenuItem>
        )}
        {selectedTask && (
          <MenuItem onClick={() => handleEdit(selectedTask)}>
            <EditIcon fontSize="small" className="menu-icon" />
            Edit
          </MenuItem>
        )}
        {selectedTask && (
          <MenuItem onClick={() => handleDelete(selectedTask.id)}>
            <DeleteIcon fontSize="small" className="menu-icon" />
            Delete
          </MenuItem>
        )}
      </Menu>
    </List>
  )
}

export default TaskList
