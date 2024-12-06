import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, MenuItem, CircularProgress } from '@mui/material';
import axios from 'axios';
import { refreshToken } from '../../client';

const AcceptRegistrationDialog = ({ open, onClose, onConfirm, registration }) => {

    const [laboratories, setLaboratories] = useState([]);
    const [selectedLabId, setSelectedLabId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleConfirm = async () => {
        setLoading(true);
        setErrorMessage(""); // Clear previous error messages
        setSuccessMessage(""); // Clear previous success messages

        if (!registration || !registration.registrationId || !registration.labId) {
            setErrorMessage("No registration or laboratory selected. Please try again.");
            setLoading(false);
            return;
        }

        try {
            let accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setErrorMessage("No access token found. Please log in.");
                setLoading(false);
                return;
            }


            await axios.post(
                "http://localhost:8080/api/laboratory/admin/add-agenda",
                {
                    registrationId: registration.registrationId,
                    laboratoryId: selectedLabId, // Include the selected laboratory ID
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setSuccessMessage("Registration accepted successfully!");
            onConfirm(); // Notify parent to refresh data
            onClose(); // Close the dialog
        } catch (error) {
            if (
                (error.response && error.response.data.error === 1008) ||
                (error.response && error.response.data.error === 1006)
            ) {
                try {
                    const token = localStorage.getItem("accessToken");
                    if (!token) {
                        throw new Error("No refresh token found.");
                    }

                    const newAccessToken = await refreshToken(token);
                    localStorage.setItem("accessToken", newAccessToken);

                    await axios.post(
                        "http://localhost:8080/api/laboratory/admin/add-agenda",
                        {
                            registrationId: registration.registrationId,
                            laboratoryId: selectedLabId,
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        }
                    );

                    setSuccessMessage("Registration accepted successfully!");
                    onConfirm();
                    onClose();
                } catch (refreshError) {
                    setErrorMessage("Failed to refresh token. Please log in again.");
                }
            } else {
                setErrorMessage(error.response?.data?.message || "Failed to accept registration. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchLaboratories = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/api/laboratory/admin/getLaboratory');
                setLaboratories(response.data.result || []);
            } catch (err) {
                console.error('Error fetching laboratories:', err);
                setError('Failed to load laboratory data.');
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchLaboratories();
        }
    }, [open]);

    useEffect(() => {
        if (open && registration?.labId) {
            setSelectedLabId(registration.labId); // Pre-select labId
        }
    }, [open, registration]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Accept Registration</DialogTitle>
            <DialogContent>
                <Typography marginBottom={2}>
                    Please review the registration details and select a laboratory to accept the registration.
                </Typography>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <TextField
                            margin="normal"
                            label="Class ID"
                            fullWidth
                            value={registration?.classId || ''}
                            InputProps={{ readOnly: true }}
                        />
                        <TextField
                            margin="normal"
                            label="Session Name"
                            fullWidth
                            value={registration?.sessionName || ''}
                            InputProps={{ readOnly: true }}
                        />
                        <TextField
                            margin="normal"
                            label="Registration Date"
                            fullWidth
                            value={registration?.reservationDate || ''}
                            InputProps={{ readOnly: true }}
                        />

                        <TextField
                            margin="normal"
                            label="Laboratory ID"
                            select
                            fullWidth
                            value={selectedLabId}
                            onChange={(e) => setSelectedLabId(e.target.value)}
                            helperText="Select a laboratory for the class."
                        >
                            {laboratories.map((lab) => (
                                <MenuItem key={lab.id} value={lab.id}>
                                    {lab.id} (Capacity: {lab.capacity})
                                </MenuItem>
                            ))}
                        </TextField>
                        {error && <Typography color="error">{error}</Typography>}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="success" variant="contained" disabled={loading}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AcceptRegistrationDialog;
