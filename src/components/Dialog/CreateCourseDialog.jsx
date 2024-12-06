import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { refreshToken } from '../../client';

const CreateCourseDialog = ({ open, onClose, onCreateSuccess }) => {
    const [formData, setFormData] = useState({ id: '', name: '' });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCreate = async () => {
        setLoading(true);
        setErrorMessage(""); // Clear previous error messages
        setSuccessMessage(""); // Clear previous success messages

        const { id, name } = formData; // Destructure id and name from formData

        // Validate required fields
        if (!id || !name) {
            setErrorMessage("Please provide all required fields.");
            setLoading(false);
            return;
        }

        try {
            // Get the access token from localStorage
            let accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setErrorMessage("No access token found. Please log in.");
                setLoading(false);
                return;
            }

            // Make the API request to create the course
            await axios.post(
                "http://localhost:8080/api/laboratory/admin/add-course",
                { id, name },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setSuccessMessage("Course created successfully!"); // Display success message
            onCreateSuccess(); // Notify the parent to refresh data
            onClose(); // Close the modal
        } catch (error) {
            // Check if the error is due to an expired token
            if (
                (error.response && error.response.data.error === 1008) ||
                (error.response && error.response.data.error === 1006)
            ) {
                try {
                    const token = localStorage.getItem("accessToken");
                    if (!token) {
                        throw new Error("No refresh token found.");
                    }

                    // Attempt to refresh the access token
                    const newAccessToken = await refreshToken(token);
                    localStorage.setItem("accessToken", newAccessToken);

                    // Retry the API request with the new token
                    await axios.post(
                        "http://localhost:8080/api/laboratory/admin/add-course",
                        { id, name },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        }
                    );

                    setSuccessMessage("Course created successfully!"); // Display success message
                    onCreateSuccess(); // Notify the parent to refresh data
                    onClose(); // Close the modal
                } catch (refreshError) {
                    setErrorMessage("Failed to refresh token. Please log in again.");
                }
            } else {
                // Handle other errors
                setErrorMessage(
                    error.response?.data?.message || "Failed to create class. Please try again."
                );
            }
        } finally {
            setLoading(false); // Stop the loading indicator
        }
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create Course</DialogTitle>
            <DialogContent>
                <TextField
                    name="id"
                    label="Course ID"
                    value={formData.id}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="name"
                    label="Course Name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleCreate} variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateCourseDialog;
