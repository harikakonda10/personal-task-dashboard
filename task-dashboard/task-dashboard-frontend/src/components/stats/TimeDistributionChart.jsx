"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, Typography } from "@mui/material"
import Chart from "chart.js/auto"
import "./TimeDistributionChart.css"

const TimeDistributionChart = ({ timeByDay, timeByTask }) => {
  const dayChartRef = useRef(null)
  const taskChartRef = useRef(null)
  const dayChartInstance = useRef(null)
  const taskChartInstance = useRef(null)

  useEffect(() => {
    if (dayChartRef.current && timeByDay) {
      if (dayChartInstance.current) {
        dayChartInstance.current.destroy()
      }

      const ctx = dayChartRef.current.getContext("2d")
      dayChartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(timeByDay),
          datasets: [
            {
              label: "Hours",
              data: Object.values(timeByDay),
              backgroundColor: "#3f51b5",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Hours",
              },
            },
            x: {
              title: {
                display: true,
                text: "Day",
              },
            },
          },
        },
      })
    }

    if (taskChartRef.current && timeByTask) {
      if (taskChartInstance.current) {
        taskChartInstance.current.destroy()
      }

      const ctx = taskChartRef.current.getContext("2d")
      taskChartInstance.current = new Chart(ctx, {
        type: "horizontalBar",
        data: {
          labels: Object.keys(timeByTask),
          datasets: [
            {
              label: "Hours",
              data: Object.values(timeByTask),
              backgroundColor: "#f50057",
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Hours",
              },
            },
          },
        },
      })
    }

    return () => {
      if (dayChartInstance.current) {
        dayChartInstance.current.destroy()
      }
      if (taskChartInstance.current) {
        taskChartInstance.current.destroy()
      }
    }
  }, [timeByDay, timeByTask])

  return (
    <div className="time-charts fade-in">
      <Card className="time-chart-card">
        <CardContent>
          <Typography variant="h6" component="h3" className="chart-title">
            Time Spent by Day
          </Typography>
          <div className="canvas-container">
            <canvas ref={dayChartRef}></canvas>
          </div>
        </CardContent>
      </Card>

      <Card className="time-chart-card">
        <CardContent>
          <Typography variant="h6" component="h3" className="chart-title">
            Time Spent by Task
          </Typography>
          <div className="canvas-container">
            <canvas ref={taskChartRef}></canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TimeDistributionChart
