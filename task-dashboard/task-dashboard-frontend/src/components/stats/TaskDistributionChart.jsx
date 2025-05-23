"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, Typography } from "@mui/material"
import Chart from "chart.js/auto"
import "./TaskDistributionChart.css"

const TaskDistributionChart = ({ tasksByStatus, tasksByPriority }) => {
  const statusChartRef = useRef(null)
  const priorityChartRef = useRef(null)
  const statusChartInstance = useRef(null)
  const priorityChartInstance = useRef(null)

  useEffect(() => {
    if (statusChartRef.current && tasksByStatus) {
      if (statusChartInstance.current) {
        statusChartInstance.current.destroy()
      }

      const ctx = statusChartRef.current.getContext("2d")
      statusChartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: Object.keys(tasksByStatus).map((status) => {
            switch (status) {
              case "todo":
                return "To Do"
              case "in_progress":
                return "In Progress"
              case "completed":
                return "Completed"
              default:
                return status
            }
          }),
          datasets: [
            {
              data: Object.values(tasksByStatus),
              backgroundColor: ["#ff9800", "#2196f3", "#4caf50"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      })
    }

    if (priorityChartRef.current && tasksByPriority) {
      if (priorityChartInstance.current) {
        priorityChartInstance.current.destroy()
      }

      const ctx = priorityChartRef.current.getContext("2d")
      priorityChartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(tasksByPriority).map((priority) => priority.charAt(0).toUpperCase() + priority.slice(1)),
          datasets: [
            {
              data: Object.values(tasksByPriority),
              backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      })
    }

    return () => {
      if (statusChartInstance.current) {
        statusChartInstance.current.destroy()
      }
      if (priorityChartInstance.current) {
        priorityChartInstance.current.destroy()
      }
    }
  }, [tasksByStatus, tasksByPriority])

  return (
    <div className="chart-container fade-in">
      <Card className="chart-card">
        <CardContent>
          <Typography variant="h6" component="h3" className="chart-title">
            Tasks by Status
          </Typography>
          <div className="canvas-container">
            <canvas ref={statusChartRef}></canvas>
          </div>
        </CardContent>
      </Card>

      <Card className="chart-card">
        <CardContent>
          <Typography variant="h6" component="h3" className="chart-title">
            Tasks by Priority
          </Typography>
          <div className="canvas-container">
            <canvas ref={priorityChartRef}></canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TaskDistributionChart
