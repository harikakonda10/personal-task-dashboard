"use client"

import { useContext, useState, useEffect } from "react"
import { Typography, FormControl, InputLabel, Select, MenuItem, Grid, Paper, TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import StatsSummary from "../components/stats/StatsSummary"
import TaskDistributionChart from "../components/stats/TaskDistributionChart"
import TimeDistributionChart from "../components/stats/TimeDistributionChart"
import { TaskContext } from "../context/TaskContext"
import { TimeEntryContext } from "../context/TimeEntryContext"
import "./Statistics.css"

const Statistics = () => {
  const { tasks } = useContext(TaskContext)
  const { timeEntries } = useContext(TimeEntryContext)

  const [dateRange, setDateRange] = useState("week")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [filteredTasks, setFilteredTasks] = useState([])
  const [filteredTimeEntries, setFilteredTimeEntries] = useState([])
  const [stats, setStats] = useState({
    completedTasks: 0,
    pendingTasks: 0,
    totalHours: 0,
    productivityScore: 0,
  })
  const [tasksByStatus, setTasksByStatus] = useState({})
  const [tasksByPriority, setTasksByPriority] = useState({})
  const [timeByDay, setTimeByDay] = useState({})
  const [timeByTask, setTimeByTask] = useState({})

  useEffect(() => {
    // Set date range based on selection
    const now = new Date()
    const start = new Date()
    const end = new Date()

    switch (dateRange) {
      case "today":
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        break
      case "week":
        const day = now.getDay() || 7 // Convert Sunday from 0 to 7
        start.setDate(now.getDate() - day + 1) // Monday
        start.setHours(0, 0, 0, 0)
        end.setDate(start.getDate() + 6) // Sunday
        end.setHours(23, 59, 59, 999)
        break
      case "month":
        start.setDate(1) // First day of month
        start.setHours(0, 0, 0, 0)
        end.setMonth(start.getMonth() + 1, 0) // Last day of month
        end.setHours(23, 59, 59, 999)
        break
      case "custom":
        // Use the selected dates
        break
      default:
        break
    }

    if (dateRange !== "custom") {
      setStartDate(start)
      setEndDate(end)
    }
  }, [dateRange])

  useEffect(() => {
    if (startDate && endDate) {
      // Filter tasks and time entries based on date range
      filterData()

      // Calculate statistics
      calculateStats()

      // Prepare chart data
      prepareChartData()
    }
  }, [startDate, endDate, tasks, timeEntries])

  const filterData = () => {
    // Filter tasks
    const filteredTasks = tasks.filter((task) => {
      const createdAt = new Date(task.createdAt)
      return createdAt >= startDate && createdAt <= endDate
    })
    setFilteredTasks(filteredTasks)

    // Filter time entries
    const filteredEntries = timeEntries.filter((entry) => {
      const entryDate = new Date(entry.startTime)
      return entryDate >= startDate && entryDate <= endDate
    })
    setFilteredTimeEntries(filteredEntries)
  }

  const calculateStats = () => {
    // Count completed and pending tasks
    const completed = filteredTasks.filter((task) => task.status === "completed").length
    const pending = filteredTasks.length - completed

    // Calculate total hours
    let totalSeconds = 0
    filteredTimeEntries.forEach((entry) => {
      if (entry.startTime && entry.endTime) {
        const start = new Date(entry.startTime).getTime()
        const end = new Date(entry.endTime).getTime()
        totalSeconds += Math.floor((end - start) / 1000)
      }
    })
    const totalHours = Math.round((totalSeconds / 3600) * 10) / 10 // Round to 1 decimal

    // Calculate productivity score (example algorithm)
    const completionRate = filteredTasks.length > 0 ? completed / filteredTasks.length : 0
    const timeUtilization = Math.min(totalHours / 40, 1) // Assuming 40 hours is max productive time
    const productivityScore = Math.round((completionRate * 0.7 + timeUtilization * 0.3) * 100)

    setStats({
      completedTasks: completed,
      pendingTasks: pending,
      totalHours,
      productivityScore,
    })
  }

  const prepareChartData = () => {
    // Tasks by status
    const statusCount = {
      todo: 0,
      in_progress: 0,
      completed: 0,
    }

    filteredTasks.forEach((task) => {
      if (statusCount[task.status] !== undefined) {
        statusCount[task.status]++
      }
    })

    setTasksByStatus(statusCount)

    // Tasks by priority
    const priorityCount = {
      low: 0,
      medium: 0,
      high: 0,
    }

    filteredTasks.forEach((task) => {
      if (priorityCount[task.priority] !== undefined) {
        priorityCount[task.priority]++
      }
    })

    setTasksByPriority(priorityCount)

    // Time by day
    const timeByDayData = {}

    filteredTimeEntries.forEach((entry) => {
      if (entry.startTime && entry.endTime) {
        const date = new Date(entry.startTime).toLocaleDateString()
        const start = new Date(entry.startTime).getTime()
        const end = new Date(entry.endTime).getTime()
        const hours = (end - start) / (1000 * 60 * 60)

        if (timeByDayData[date]) {
          timeByDayData[date] += hours
        } else {
          timeByDayData[date] = hours
        }
      }
    })

    // Round values to 1 decimal
    Object.keys(timeByDayData).forEach((key) => {
      timeByDayData[key] = Math.round(timeByDayData[key] * 10) / 10
    })

    setTimeByDay(timeByDayData)

    // Time by task
    const timeByTaskData = {}

    filteredTimeEntries.forEach((entry) => {
      if (entry.startTime && entry.endTime && entry.taskId) {
        const task = tasks.find((t) => t.id === entry.taskId)
        if (task) {
          const taskName = task.title
          const start = new Date(entry.startTime).getTime()
          const end = new Date(entry.endTime).getTime()
          const hours = (end - start) / (1000 * 60 * 60)

          if (timeByTaskData[taskName]) {
            timeByTaskData[taskName] += hours
          } else {
            timeByTaskData[taskName] = hours
          }
        }
      }
    })

    // Round values to 1 decimal
    Object.keys(timeByTaskData).forEach((key) => {
      timeByTaskData[key] = Math.round(timeByTaskData[key] * 10) / 10
    })

    // Limit to top 5 tasks by time
    const sortedTasks = Object.entries(timeByTaskData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    setTimeByTask(Object.fromEntries(sortedTasks))
  }

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value)
  }

  return (
    <div className="statistics fade-in">
      <Typography variant="h4" component="h1" className="page-title">
        Statistics
      </Typography>

      <Paper className="filters-paper">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select value={dateRange} onChange={handleDateRangeChange} label="Date Range">
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {dateRange === "custom" && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </LocalizationProvider>
          )}
        </Grid>
      </Paper>

      <StatsSummary stats={stats} />

      <TaskDistributionChart tasksByStatus={tasksByStatus} tasksByPriority={tasksByPriority} />

      <TimeDistributionChart timeByDay={timeByDay} timeByTask={timeByTask} />
    </div>
  )
}

export default Statistics
