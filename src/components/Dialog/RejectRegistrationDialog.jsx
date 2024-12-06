import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import axios from 'axios';
import { refreshToken } from '../../client';

const RejectRegistrationDialog = ({ open, onClose, onConfirm, registration }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleRejectConfirm = async () => {
        setLoading(true);
        setErrorMessage(""); // Clear previous error messages
        setSuccessMessage(""); // Clear previous success messages

        if (!registration || !registration.registrationId) {
            setErrorMessage("No registration selected. Please try again.");
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
                "http://localhost:8080/api/laboratory/admin/reject-registration",
                {
                    registrationId: registration.registrationId,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setSuccessMessage("Registration rejected successfully!");
            onConfirm(); // Notify parent to refresh data
            onClose(); // Close the dialog
        } catch (error) {
            // Handle expired token and refresh
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
                        "http://localhost:8080/api/laboratory/admin/reject-registration",
                        {
                            registrationId: registration.registrationId,
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        }
                    );

                    setSuccessMessage("Registration rejected successfully!");
                    onConfirm();
                    onClose();
                } catch (refreshError) {
                    setErrorMessage("Failed to refresh token. Please log in again.");
                }
            } else {
                setErrorMessage(
                    error.response?.data?.message || "Failed to reject registration. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Reject Registration</DialogTitle>
            <DialogContent>
                {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                {successMessage && <Typography color="success">{successMessage}</Typography>}
                <Typography>Are you sure you want to reject this registration?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleRejectConfirm} color="primary" disabled={loading}>
                    {loading ? 'Processing...' : 'Confirm'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RejectRegistrationDialog;
