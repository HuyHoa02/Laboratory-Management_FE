import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Button, Drawer, IconButton, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import AdminDrawer from '../../components/Drawer/AdminDrawer';
import { refreshToken } from '../../client';

const CreateTimeSetPage = () => {
    const [openSidebar, setOpenSidebar] = useState(true);
    const [semesterList, setSemesterList] = useState([]);
    const [formData, setFormData] = useState({
        startDate: '',
        schoolYearName: '',
        semesterName: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        // Fetch available semesters from the API
        axios.get('http://localhost:8080/api/laboratory/admin/getSemester')
            .then((response) => {
                setSemesterList(response.data.result || []);
            })
            .catch((error) => {
                setErrorMessage('Failed to load semesters.');
            });
    }, []);

    const handleDrawerToggle = () => {
        setOpenSidebar(!openSidebar);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        setFormLoading(true);
        setErrorMessage(""); // Clear previous error messages
        setSuccessMessage(""); // Clear previous success messages

        const { startDate, schoolYearName, semesterName } = formData;

        // Validate required fields
        if (!startDate || !schoolYearName || !semesterName) {
            setErrorMessage("Please provide all required fields.");
            setFormLoading(false);
            return;
        }

        // Validate that the start date is a Monday
        const selectedDate = new Date(startDate);
        if (selectedDate.getDay() !== 1) { // 1 corresponds to Monday in JavaScript Date
            setErrorMessage("The start date must be a Monday.");
            setFormLoading(false);
            return;
        }

        try {
            // Get the access token from localStorage
            let accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setErrorMessage("No access token found. Please log in.");
                setFormLoading(false);
                return;
            }

            // Make the API request to create the TimeSet
            const response = await axios.post(
                'http://localhost:8080/api/laboratory/admin/add-timeset',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`, // Include the token in the headers
                    },
                }
            );

            setSuccessMessage('Time set created successfully!');

        } catch (error) {
            // Catch errors related to API call or token issues
            if (
                (error.response && error.response.data.error === 1008) ||
                (error.response && error.response.data.error === 1006)
            ) {
                // Token is expired, try refreshing the token
                try {
                    const token = localStorage.getItem("accessToken");
                    if (!token) {
                        throw new Error("No refresh token found.");
                    }

                    // Attempt to refresh the access token
                    const newAccessToken = await refreshToken(token);
                    localStorage.setItem("accessToken", newAccessToken);

                    try {
                        // Retry the API request with the new token
                        const response = await axios.post(
                            'http://localhost:8080/api/laboratory/admin/add-timeset',
                            formData,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${newAccessToken}`, // Include the token in the headers
                                },
                            }
                        );

                        setSuccessMessage('Time set created successfully!');
                    } catch (retryError) {
                        setErrorMessage(
                            retryError.response?.data?.message || "Failed to create lecturer after refreshing token. Please try again later."
                        );
                    }
                } catch (refreshError) {
                    // If token refresh fails, handle this scenario
                    setErrorMessage("Failed to refresh token. Please log in again.");
                }
            } else {
                // Handle general errors (e.g., invalid data or server issues)
                setErrorMessage(
                    error.response?.data?.message || "Failed to create lecturer. Please try again."
                );
            }
        } finally {
            setFormLoading(false); // Stop the loading indicator after completion
        }
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

                    <Box sx={{ margin: 10, width: '80%' }}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>Create Time Set</Typography>

                        {/* Form */}
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Start Date"
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                            />

                            <TextField
                                label="School Year"
                                name="schoolYearName"
                                value={formData.schoolYearName}
                                onChange={handleChange}
                                fullWidth
                            />

                            <FormControl fullWidth>
                                <InputLabel>Semester</InputLabel>
                                <Select
                                    name="semesterName"
                                    value={formData.semesterName}
                                    onChange={handleChange}
                                    label="Semester"
                                >
                                    {semesterList.map((semester, index) => (
                                        <MenuItem key={index} value={semester.name}>
                                            {semester.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Submit Button */}
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={formLoading}
                            >
                                {formLoading ? 'Submitting...' : 'Create Time Set'}
                            </Button>

                            {/* Success and Error Messages */}
                            {errorMessage && (
                                <Typography color="error" sx={{ marginTop: 2 }}>
                                    {errorMessage}
                                </Typography>
                            )}

                            {successMessage && (
                                <Typography color="success" sx={{ marginTop: 2 }}>
                                    {successMessage}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default CreateTimeSetPage;
