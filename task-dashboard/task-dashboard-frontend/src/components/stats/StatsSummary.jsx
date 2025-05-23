import { Card, CardContent, Typography, Grid, Box } from "@mui/material"
import { CheckCircle, Pending, AccessTime, TrendingUp } from "@mui/icons-material"
import "./StatsSummary.css"

const StatsSummary = ({ stats }) => {
  return (
    <Grid container spacing={3} className="stats-summary fade-in">
      <Grid item xs={12} sm={6} md={3}>
        <Card className="stat-card completed-card">
          <CardContent>
            <Box className="stat-icon-container">
              <CheckCircle className="stat-icon" />
            </Box>
            <Typography variant="h5" component="div" className="stat-value">
              {stats.completedTasks}
            </Typography>
            <Typography color="textSecondary" className="stat-label">
              Completed Tasks
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className="stat-card pending-card">
          <CardContent>
            <Box className="stat-icon-container">
              <Pending className="stat-icon" />
            </Box>
            <Typography variant="h5" component="div" className="stat-value">
              {stats.pendingTasks}
            </Typography>
            <Typography color="textSecondary" className="stat-label">
              Pending Tasks
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className="stat-card time-card">
          <CardContent>
            <Box className="stat-icon-container">
              <AccessTime className="stat-icon" />
            </Box>
            <Typography variant="h5" component="div" className="stat-value">
              {stats.totalHours}h
            </Typography>
            <Typography color="textSecondary" className="stat-label">
              Total Hours
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card className="stat-card productivity-card">
          <CardContent>
            <Box className="stat-icon-container">
              <TrendingUp className="stat-icon" />
            </Box>
            <Typography variant="h5" component="div" className="stat-value">
              {stats.productivityScore}%
            </Typography>
            <Typography color="textSecondary" className="stat-label">
              Productivity
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default StatsSummary
