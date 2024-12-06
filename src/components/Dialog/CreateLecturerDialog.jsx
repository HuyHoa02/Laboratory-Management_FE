import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, CircularProgress } from '@mui/material';
import axios from 'axios';
import { refreshToken } from '../../client';

const CreateLecturerDialog = ({ open, onClose, onCreateSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        gender: 'MALE',
        email: '',
        phoneNum: '',
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle form submission (create lecturer)
    const handleCreate = async () => {
        setLoading(true);
        setErrorMessage(""); // Clear previous error messages
        setSuccessMessage(""); // Clear previous success messages

        const { username, password, firstname, lastname, email, phoneNum, gender } = formData; // Destructure formData

        // Validate required fields
        if (!username || !password || !firstname || !lastname || !email || !phoneNum || !gender) {
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

            // Make the API request to create the lecturer with the access token
            await axios.post(
                "http://localhost:8080/api/laboratory/admin/add-lecturer",  // API endpoint for creating a lecturer
                { username, password, firstname, lastname, email, phoneNum, gender },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,  // Include the token in the headers
                    },
                }
            );
            console.log("abc")

            setSuccessMessage("Lecturer created successfully!"); // Display success message
            onCreateSuccess(); // Notify the parent to refresh data
            onClose(); // Close the modal

        } catch (error) {
            // Catch and handle error (general or token-related)
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
                        await axios.post(
                            "http://localhost:8080/api/laboratory/admin/add-lecturer",
                            { username, password, firstname, lastname, email, phoneNum, gender },
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${newAccessToken}`,  // Use new access token
                                },
                            }
                        );

                        setSuccessMessage("Lecturer created successfully!"); // Display success message
                        onCreateSuccess(); // Notify the parent to refresh data
                        onClose(); // Close the modal
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
            setLoading(false); // Stop the loading indicator after completion
        }
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create Lecturer</DialogTitle>
            <DialogContent>
                {errorMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</div>}
                {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

                <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="First Name"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Last Name"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <FormControl fullWidth required margin="normal">
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        row
                    >
                        <FormControlLabel value="MALE" control={<Radio />} label="Male" />
                        <FormControlLabel value="FEMALE" control={<Radio />} label="Female" />
                    </RadioGroup>
                </FormControl>
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Phone Number"
                    name="phoneNum"
                    value={formData.phoneNum}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleCreate}
                    color="primary"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Create Lecturer'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateLecturerDialog;
