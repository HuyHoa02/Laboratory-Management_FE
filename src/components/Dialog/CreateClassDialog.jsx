import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    MenuItem,
    CircularProgress,
    Typography, // Added Typography for error and success messages
} from '@mui/material';
import axios from 'axios';
import { refreshToken } from '../../client';

const CreateClassDialog = ({ open, onClose, onCreateSuccess }) => {
    const [size, setSize] = useState('40');
    const [courseId, setCourseId] = useState('');
    const [lecturerId, setLecturerId] = useState('');
    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [coursesResponse, lecturersResponse] = await Promise.all([
                    axios.get('http://localhost:8080/api/laboratory/public/get-course'),
                    axios.get('http://localhost:8080/api/laboratory/public/get-lecturers'),
                ]);
                setCourses(coursesResponse.data.result || []);
                setLecturers(lecturersResponse.data.result || []);
            } catch (error) {
                console.error('Failed to fetch options:', error);
            }
        };

        if (open) {
            fetchOptions();
        }
    }, [open]);

    const handleCreate = async () => {
        setLoading(true);
        setErrorMessage(''); // Clear previous error messages
        setSuccessMessage(''); // Clear previous success messages

        // Validate required fields
        if (!size || !courseId || !lecturerId) {
            setErrorMessage('Please provide all required fields.');
            setLoading(false);
            return;
        }

        try {
            // Get the access token from localStorage
            let accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                setErrorMessage('No access token found. Please log in.');
                setLoading(false);
                return;
            }

            // Make the API request to create a class
            await axios.post(
                'http://localhost:8080/api/laboratory/admin/add-class',
                { size, courseId, lecturerId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setSuccessMessage('Class created successfully!'); // Display success message
            onCreateSuccess(); // Notify the parent to refresh data
            onClose(); // Close the modal
        } catch (error) {
            // Check if the error is due to an expired token
            if (
                (error.response && error.response.data.error === 1008) ||
                (error.response && error.response.data.error === 1006)
            ) {
                try {
                    const token = localStorage.getItem('accessToken');
                    if (!token) {
                        throw new Error('No refresh token found.');
                    }

                    // Attempt to refresh the access token
                    const newAccessToken = await refreshToken(token);
                    localStorage.setItem('accessToken', newAccessToken);

                    // Retry the API request with the new token
                    await axios.post(
                        'http://localhost:8080/api/laboratory/admin/add-class',
                        { size, courseId, lecturerId },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        }
                    );

                    setSuccessMessage('Class created successfully!'); // Display success message
                    onCreateSuccess(); // Notify the parent to refresh data
                    onClose(); // Close the modal
                } catch (refreshError) {
                    if (refreshError.response?.status === 403) {
                        setErrorMessage("You don't have authorization to perform this action.");
                    } else {
                        // Handle other errors (e.g., failed token refresh)
                        setErrorMessage('Failed to refresh token. Please log in again.');
                    }
                }
            } else {
                // Handle other errors
                setErrorMessage(
                    error.response?.data?.message || 'Failed to create class. Please try again.'
                );
            }
        } finally {
            setLoading(false); // Stop the loading indicator
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create New Class</DialogTitle>
            <DialogContent>
                {/* Display error message above the form */}
                {errorMessage && (
                    <Typography color="error" variant="body2" gutterBottom>
                        {errorMessage}
                    </Typography>
                )}
                {successMessage && (
                    <Typography color="success" variant="body2" gutterBottom>
                        {successMessage}
                    </Typography>
                )}

                <TextField
                    margin="normal"
                    label="Course ID"
                    select
                    fullWidth
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                >
                    {courses.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                            {course.name} ({course.id})
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    margin="normal"
                    label="Lecturer ID"
                    select
                    fullWidth
                    value={lecturerId}
                    onChange={(e) => setLecturerId(e.target.value)}
                >
                    {lecturers.map((lecturer) => (
                        <MenuItem key={lecturer.id} value={lecturer.id}>
                            {lecturer.firstname} {lecturer.lastname} ({lecturer.id})
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    margin="normal"
                    label="Size"
                    type="number"
                    fullWidth
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleCreate}
                    color="primary"
                    variant="contained"
                    disabled={loading || !courseId || !lecturerId}
                >
                    {loading ? <CircularProgress size={24} /> : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateClassDialog;
