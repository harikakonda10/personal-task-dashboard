"use client"

import { useContext } from "react"
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from "@mui/material"
import { Brightness4, Brightness7, Menu as MenuIcon } from "@mui/icons-material"
import { AuthContext } from "../../context/AuthContext"
import { ThemeContext } from "../../context/ThemeContext"
import "./Navbar.css"

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext)
  const { darkMode, toggleDarkMode } = useContext(ThemeContext)

  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar} className="menu-button">
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" className="title">
          Task Dashboard
        </Typography>

        <Box className="user-info">
          {user && (
            <Typography variant="body1" component="span">
              Welcome, {user.name}
            </Typography>
          )}
        </Box>

        <IconButton color="inherit" onClick={toggleDarkMode} className="theme-toggle">
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <Button color="inherit" onClick={logout} className="logout-button">
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
