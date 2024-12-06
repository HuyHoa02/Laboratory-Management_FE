import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { refreshToken } from '../../client';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Button, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Menu as MenuIcon, Dashboard, Assignment, ExitToApp, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import LaboratoryTable from '../../components/Tables/LaboratoryTable';
import ClassTable from '../../components/Tables/ClassTable';
import LecturerTable from '../../components/Tables/LecturerTable';
import CourseTable from '../../components/Tables/CourseTable';
import AdminDrawer from '../../components/Drawer/AdminDrawer';
import RegistrationTable from '../../components/Tables/RegistrationTable';

const AdminPage = () => {
    const [openSidebar, setOpenSidebar] = useState(true);

    const handleDrawerToggle = () => {
        setOpenSidebar(!openSidebar);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AdminDrawer openSidebar={openSidebar} handleDrawerToggle={handleDrawerToggle} />

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    backgroundColor: '#f3f6f9',
                    padding: 3,
                    width: openSidebar ? 'calc(100% - 240px)' : '100%',
                    transition: 'width 1s ease',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: 3, position: 'relative' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ marginTop: 3 }}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>Classes</Typography>
                        <ClassTable />

                        <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>Laboratories</Typography>
                        <LaboratoryTable />

                        <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>Courses</Typography>
                        <CourseTable />

                        <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>Users</Typography>
                        <LecturerTable />

                        <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 2 }}>Registration</Typography>
                        <RegistrationTable />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminPage;
