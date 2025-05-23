"use client"

import { useState, useEffect } from "react"
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import "./TaskForm.css"

const TaskForm = ({ task, onSubmit, onCancel, open }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    estimatedTime: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        estimatedTime: task.estimatedTime || "",
      })
    } else {
      resetForm()
    }
  }, [task])

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      estimatedTime: "",
    })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (formData.estimatedTime && isNaN(formData.estimatedTime)) {
      newErrors.estimatedTime = "Estimated time must be a number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
      if (!task) {
        resetForm()
      }
    }
  }

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth className="task-form-dialog">
      <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="task-form">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Task Title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.title}
                helperText={errors.title}
                className="form-field"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                className="form-field"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className="form-field">
                <InputLabel>Status</InputLabel>
                <Select name="status" value={formData.status} onChange={handleChange} label="Status">
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth className="form-field">
                <InputLabel>Priority</InputLabel>
                <Select name="priority" value={formData.priority} onChange={handleChange} label="Priority">
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="estimatedTime"
                label="Estimated Time (minutes)"
                type="number"
                value={formData.estimatedTime}
                onChange={handleChange}
                fullWidth
                error={!!errors.estimatedTime}
                helperText={errors.estimatedTime}
                className="form-field"
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {task ? "Update Task" : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskForm
