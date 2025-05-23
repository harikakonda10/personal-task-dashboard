const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const { Pool } = require("pg")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to database:", err)
  } else {
    console.log("Connected to database")
    release()
  }
})

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "")
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id])

    if (result.rows.length === 0) {
      throw new Error()
    }

    req.user = result.rows[0]
    req.token = token
    next()
  } catch (error) {
    res.status(401).send({ message: "Please authenticate" })
  }
}

// Routes
// Auth routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).send({ message: "All fields are required" })
    }

    // Check if user already exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    if (userExists.rows.length > 0) {
      return res.status(400).send({ message: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword],
    )

    const user = result.rows[0]

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    res.status(201).send({ token, user })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).send({ message: "Server error" })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).send({ message: "Email and password are required" })
    }

    // Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    if (result.rows.length === 0) {
      return res.status(401).send({ message: "Invalid credentials" })
    }

    const user = result.rows[0]

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).send({ message: "Invalid credentials" })
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    // Remove password from response
    delete user.password

    res.send({ token, user })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).send({ message: "Server error" })
  }
})

// User routes
app.get("/api/users/me", auth, async (req, res) => {
  try {
    // Remove password from response
    const user = { ...req.user }
    delete user.password

    res.send(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).send({ message: "Server error" })
  }
})

// Task routes
app.get("/api/tasks", auth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC", [req.user.id])

    const tasks = result.rows.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      estimatedTime: task.estimated_time,
      createdAt: task.created_at,
    }))

    res.send(tasks)
  } catch (error) {
    console.error("Get tasks error:", error)
    res.status(500).send({ message: "Server error" })
  }
})

app.post("/api/tasks", auth, async (req, res) => {
  try {
    const { title, description, status, priority, estimatedTime } = req.body

    // Validate input
    if (!title) {
      return res.status(400).send({ message: "Title is required" })
    }

    const result = await pool.query(
      "INSERT INTO tasks (user_id, title, description, status, priority, estimated_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [req.user.id, title, description, status, priority, estimatedTime],
    )

    const task = result.rows[0]

    res.status(201).send({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      estimatedTime: task.estimated_time,
      createdAt: task.created_at,
    })
  } catch (error) {
    console.error("Create task error:", error)
    res.status(500).send({ message: "Server error" })
  }
})

app.put("/api/tasks/:id", auth, async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, status, priority, estimatedTime } = req.body

    // Validate input
    if (!title) {
      return res.status(400).send({ message: "Title is required" })
    }

    // Check if task exists and belongs to user
    const taskExists = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2", [id, req.user.id])

    if (taskExists.rows.length === 0) {
      return res.status(404).send({ message: "Task not found" })
    }

    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, estimated_time = $5 WHERE id = $6 AND user_id = $7 RETURNING *",
      [title, description, status, priority, estimatedTime, id, req.user.id],
    )

    const task = result.rows[0]

    res.send({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      estimatedTime: task.estimated_time,
      createdAt: task.created_at,
    })
  } catch (error) {
    console.error("Update task error:", error)
    res.status(500).send({ message: "Server error" })
  }
})

app.delete("/api/tasks/:id", auth, async (req, res) => {
  try {
    const { id } = req.params

    // Check if task exists and belongs to user
    const taskExists = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2", [id, req.user.id])

    if (taskExists.rows.length === 0) {
      return res.status(404).send({ message: "Task not found" })
    }

    await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [id, req.user.id])

    res.send({ message: "Task deleted" })
  } catch (error) {
    console.error("Delete task error:", error)
    res.status(500).send({ message: "Server error" })
  }
})

// Time entry routes
app.get("/api/time-entries", auth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM time_entries WHERE user_id = $1 ORDER BY start_time DESC", [
      req.user.id,
    ])

    const timeEntries = result.rows.map((entry) => ({
      id: entry.id,
      taskId: entry.task_id,
      startTime: entry.start_time,
      endTime: entry.end_time,
      notes: entry.notes,
    }))

    res.send(timeEntries)
  } catch (error) {
    console.error("Get time entries error:", error)
    res.status(500).send({ message: "Server error" })
  }
})

app.get("/api/time-entries/active", auth, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM time_entries WHERE user_id = $1 AND end_time IS NULL", [req.user.id])

    if (result.rows.length === 0) {
      return res.send(null)
    }

    const entry = result.rows[0]

    res.send({
      id: entry.id,
      taskId: entry.task_id,
      startTime: entry.start_time,
      endTime: entry.end_time,
      notes: entry.notes,
    })
  } catch (error) {
    console.error("Get active time entry error:", error)
    res.status(500).send({ message: "Server error" })
  }
})

app.post("/api/time-entries/start", auth, async (req, res) => {
  try {
    const { taskId } = req.body

    // Validate input
    if (!taskId) {
      return res.status(400).send({ message: "Task ID is required" })
    }

    // Check if task exists and belongs to user
    const taskExists = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2", [taskId, req.user.id])

    if (taskExists.rows.length === 0) {
      return res.status(404).send({ message: "Task not found" })
    }

    // Check if there's already an active time entry
    const activeEntry = await pool.query("SELECT * FROM time_entries WHERE user_id = $1 AND end_time IS NULL", [
      req.user.id,
    ])

    if (activeEntry.rows.length > 0) {
      return res.status(400).send({ message: "You already have an active time entry" })
    }

    const result = await pool.query(
      "INSERT INTO time_entries (user_id, task_id, start_time) VALUES ($1, $2, NOW()) RETURNING *",
      [req.user.id, taskId],
    )

    const entry = result.rows[0]

    res.status(201).send({
      id: entry.id,
      taskId: entry.task_id,
      startTime: entry.start_time,
      endTime: entry.end_time,
      notes: entry.notes,
    })
  } catch (error) {
    console.error("Start time entry error:", error)
    res.status(500).send({ message: "Server error" })
  }
})

app.put("/api/time-entries/:id/stop", auth, async (req, res) => {
  try {
    const { id } = req.params

    // Check if time entry exists and belongs to user
    const entryExists = await pool.query("SELECT * FROM time_entries WHERE id = $1 AND user_id = $2", [id, req.user.id])

    if (entryExists.rows.length === 0) {
      return res.status(404).send({ message: "Time entry not found" })
    }

    // Check if time entry is already stopped
    if (entryExists.rows[0].end_time) {
      return res.status(400).send({ message: "Time entry is already stopped" })
    }

    const result = await pool.query(
      "UPDATE time_entries SET end_time = NOW() WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id],
    )

    const entry = result.rows[0]

    res.send({
      id: entry.id,
      taskId: entry.task_id,
      startTime: entry.start_time,
      endTime: entry.end_time,
      notes: entry.notes,
    })
  } catch (error) {
    console.error("Stop time entry error:", error)
    res.status(500).send({ message: "Server error" })
  }
})

app.put("/api/time-entries/:id", auth, async (req, res) => {
  try {
    const { id } = req.params
    const { notes } = req.body

    // Check if time entry exists and belongs to user
    const entryExists = await pool.query("SELECT * FROM time_entries WHERE id = $1 AND user_id = $2", [id, req.user.id])

    if (entryExists.rows.length === 0) {
      return res.status(404).send({ message: "Time entry not found" })
    }

    const result = await pool.query("UPDATE time_entries SET notes = $1 WHERE id = $2 AND user_id = $3 RETURNING *", [
      notes,
      id,
      req.user.id,
    ])

    const entry = result.rows[0]

    res.send({
      id: entry.id,
      taskId: entry.task_id,
      startTime: entry.start_time,
      endTime: entry.end_time,
      notes: entry.notes,
    })
  } catch (error) {
    console.error("Update time entry error:", error)
    res.status(500).send({ message: "Server error" })
  }
})

app.delete("/api/time-entries/:id", auth, async (req, res) => {
  try {
    const { id } = req.params

    // Check if time entry exists and belongs to user
    const entryExists = await pool.query("SELECT * FROM time_entries WHERE id = $1 AND user_id = $2", [id, req.user.id])

    if (entryExists.rows.length === 0) {
      return res.status(404).send({ message: "Time entry not found" })
    }

    await pool.query("DELETE FROM time_entries WHERE id = $1 AND user_id = $2", [id, req.user.id])

    res.send({ message: "Time entry deleted" })
  } catch (error) {
    console.error("Delete time entry error:", error)
    res.status(500).send({ message: "Server error" })
  }
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
