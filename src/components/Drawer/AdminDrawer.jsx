import React from 'react';
import { Drawer, Box, Typography, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Dashboard, Assignment, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting

const AdminDrawer = ({ openSidebar, handleDrawerToggle }) => {
    const navigate = useNavigate(); // Hook for navigation

    // Logout handler
    const handleLogout = () => {
        // Clear the access token or any authentication data from storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("id");
        sessionStorage.removeItem("accessToken");

        // Optionally, you can redirect to the login page
        window.location.href = '/'; // Change the path according to your routing setup
    };

    return (
        <>
            <Drawer
                sx={{
                    width: openSidebar ? 240 : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: openSidebar ? 240 : 0,
                        boxSizing: 'border-box',
                        height: '100vh',
                        transition: 'width 1s ease',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={openSidebar}
                onClose={handleDrawerToggle}
            >
                <Box sx={{ padding: 2 }}>
                    <Typography variant="h5" color="primary">
                        ADMIN
                    </Typography>
                </Box>
                <List>
                    <ListItem button onClick={() => { window.location.href = '/admin' }}>
                        <ListItemIcon>
                            <Dashboard />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button onClick={() => { window.location.href = '/createTimeSet' }}>
                        <ListItemIcon>
                            <Assignment />
                        </ListItemIcon>
                        <ListItemText primary="Forms" />
                    </ListItem>
                    <ListItem button onClick={handleLogout}>  {/* Added onClick to handle logout */}
                        <ListItemIcon>
                            <ExitToApp />
                        </ListItemIcon>
                        <ListItemText primary="Log Out" />
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default AdminDrawer;
