"use client"

import { useContext, useState, useEffect } from "react"
import { Card, CardContent, Typography, Button, FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material"
import { PlayArrow, Stop, Timer } from "@mui/icons-material"
import { TaskContext } from "../../context/TaskContext"
import { TimeEntryContext } from "../../context/TimeEntryContext"
import "./TimeTracker.css"

const TimeTracker = () => {
  const { tasks } = useContext(TaskContext)
  const { activeEntry, startTimeEntry, stopTimeEntry } = useContext(TimeEntryContext)

  const [selectedTaskId, setSelectedTaskId] = useState("")
  const [elapsedTime, setElapsedTime] = useState(0)
  const [timerInterval, setTimerInterval] = useState(null)

  useEffect(() => {
    if (activeEntry) {
      setSelectedTaskId(activeEntry.taskId)

      // Calculate elapsed time
      const startTime = new Date(activeEntry.startTime).getTime()
      const initialElapsed = Math.floor((Date.now() - startTime) / 1000)
      setElapsedTime(initialElapsed)

      // Start timer
      const interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)

      setTimerInterval(interval)
    } else {
      clearInterval(timerInterval)
      setTimerInterval(null)
      setElapsedTime(0)
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [activeEntry])

  const handleTaskChange = (e) => {
    setSelectedTaskId(e.target.value)
  }

  const handleStartTimer = async () => {
    if (selectedTaskId) {
      try {
        await startTimeEntry(selectedTaskId)
      } catch (error) {
        console.error("Failed to start timer:", error)
      }
    }
  }

  const handleStopTimer = async () => {
    if (activeEntry) {
      try {
        await stopTimeEntry(activeEntry.id)
      } catch (error) {
        console.error("Failed to stop timer:", error)
      }
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":")
  }

  const getActiveTask = () => {
    if (!activeEntry) return null
    return tasks.find((task) => task.id === activeEntry.taskId)
  }

  const activeTask = getActiveTask()

  return (
    <Card className="time-tracker fade-in">
      <CardContent>
        <Typography variant="h5" component="h2" className="tracker-title">
          <Timer className="timer-icon" />
          Time Tracker
        </Typography>

        {activeEntry ? (
          <div className="active-tracking">
            <Typography variant="h3" className="timer-display">
              {formatTime(elapsedTime)}
            </Typography>

            <Typography variant="body1" className="active-task-info">
              Currently tracking: <strong>{activeTask?.title}</strong>
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<Stop />}
              onClick={handleStopTimer}
              className="stop-button"
            >
              Stop Timer
            </Button>
          </div>
        ) : (
          <Grid container spacing={2} className="start-tracking">
            <Grid item xs={12} md={8}>
              <FormControl fullWidth>
                <InputLabel>Select Task</InputLabel>
                <Select
                  value={selectedTaskId}
                  onChange={handleTaskChange}
                  label="Select Task"
                  disabled={tasks.length === 0}
                >
                  {tasks.map((task) => (
                    <MenuItem key={task.id} value={task.id}>
                      {task.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrow />}
                onClick={handleStartTimer}
                disabled={!selectedTaskId}
                fullWidth
                className="start-button"
              >
                Start Timer
              </Button>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}

export default TimeTracker
