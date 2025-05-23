"use client"

import { useContext } from "react"
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material"
import { Dashboard as DashboardIcon, Timer as TimerIcon, BarChart as StatsIcon } from "@mui/icons-material"
import { NavLink } from "react-router-dom"
import { ThemeContext } from "../../context/ThemeContext"
import "./Sidebar.css"

const Sidebar = () => {
  const { darkMode } = useContext(ThemeContext)

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Time Tracking", icon: <TimerIcon />, path: "/time-tracking" },
    { text: "Statistics", icon: <StatsIcon />, path: "/statistics" },
  ]

  return (
    <Drawer
      variant="permanent"
      className={`sidebar ${darkMode ? "sidebar-dark" : ""}`}
      classes={{
        paper: `sidebar-paper ${darkMode ? "sidebar-paper-dark" : ""}`,
      }}
    >
      <div className="sidebar-header">
        <h3>Menu</h3>
      </div>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            component={NavLink}
            to={item.path}
            key={item.text}
            className="sidebar-item"
            activeClassName="active"
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar
