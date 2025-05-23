# Personal Task Dashboard

A responsive web application that allows users to manage daily tasks, track time spent on tasks, and view productivity statistics.

## Features

- **Task Management**: Create, update, delete, and organize tasks with priorities and statuses
- **Time Tracking**: Start and stop timers for tasks to track time spent
- **Statistics**: View productivity metrics and time distribution charts
- **Authentication**: Secure user authentication with JWT
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes

## Tech Stack

### Frontend
- React.js
- Material-UI for components
- React Router for navigation
- Context API for state management
- Chart.js for data visualization
- Axios for API requests

### Backend
- Node.js with Express
- PostgreSQL database
- JWT authentication
- RESTful API architecture

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

### Database Setup

1. Install PostgreSQL if not already installed
2. Access PostgreSQL command line:
   ```bash
   # For Windows
   psql -U postgres
   
   # For macOS/Linux
   sudo -u postgres psql