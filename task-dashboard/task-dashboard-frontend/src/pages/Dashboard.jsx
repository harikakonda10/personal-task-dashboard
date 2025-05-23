"use client"

import { useState, useContext } from "react"
import { Typography, Button, Grid, Paper, Box, Divider } from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import TaskList from "../components/tasks/TaskList"
import TaskForm from "../components/tasks/TaskForm"
import { TaskContext } from "../context/TaskContext"
import "./Dashboard.css"

const Dashboard = () => {
  const { tasks, addTask, updateTask, loading, error } = useContext(TaskContext)
  const [openTaskForm, setOpenTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const handleAddTask = () => {
    setEditingTask(null)
    setOpenTaskForm(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setOpenTaskForm(true)
  }

  const handleTaskSubmit = async (formData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData)
      } else {
        await addTask(formData)
      }
      setOpenTaskForm(false)
    } catch (err) {
      console.error("Error saving task:", err)
    }
  }

  const handleCloseForm = () => {
    setOpenTaskForm(false)
    setEditingTask(null)
  }

  const getTaskCounts = () => {
    const counts = {
      total: tasks.length,
      todo: 0,
      inProgress: 0,
      completed: 0,
    }

    tasks.forEach((task) => {
      if (task.status === "todo") counts.todo++
      else if (task.status === "in_progress") counts.inProgress++
      else if (task.status === "completed") counts.completed++
    })

    return counts
  }

  const taskCounts = getTaskCounts()

  if (loading) {
    return <div className="loading">Loading tasks...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="dashboard fade-in">
      <Box className="dashboard-header">
        <Typography variant="h4" component="h1">
          Task Dashboard
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddTask}>
          Add Task
        </Button>
      </Box>

      <Grid container spacing={3} className="task-summary">
        <Grid item xs={6} sm={3}>
          <Paper className="summary-card total-card">
            <Typography variant="h6" className="summary-title">
              Total
            </Typography>
            <Typography variant="h4" className="summary-count">
              {taskCounts.total}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper className="summary-card todo-card">
            <Typography variant="h6" className="summary-title">
              To Do
            </Typography>
            <Typography variant="h4" className="summary-count">
              {taskCounts.todo}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper className="summary-card progress-card">
            <Typography variant="h6" className="summary-title">
              In Progress
            </Typography>
            <Typography variant="h4" className="summary-count">
              {taskCounts.inProgress}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper className="summary-card completed-card">
            <Typography variant="h6" className="summary-title">
              Completed
            </Typography>
            <Typography variant="h4" className="summary-count">
              {taskCounts.completed}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Divider className="section-divider" />

      <Typography variant="h5" component="h2" className="section-title">
        Your Tasks
      </Typography>

      <TaskList onEditTask={handleEditTask} />

      <TaskForm task={editingTask} onSubmit={handleTaskSubmit} onCancel={handleCloseForm} open={openTaskForm} />
    </div>
  )
}

export default Dashboard
