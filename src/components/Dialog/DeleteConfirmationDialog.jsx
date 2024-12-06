import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import axios from 'axios';
import { refreshToken } from '../../client';

const DeleteConfirmationDialog = ({ open, onClose, id, name, apiUrl, onDeleteSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    let accessToken = localStorage.getItem("accessToken");

    const handleDelete = async () => {
        setLoading(true);
        setErrorMessage(null); // Clear previous error message

        try {
            if (!accessToken) {
                setErrorMessage("No access token found. Please log in.");
                setLoading(false);
                return;
            }

            // Perform the DELETE request
            const response = await axios.delete(`${apiUrl}/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log('Deleted successfully:', response.data);
            onDeleteSuccess(); // Call the parent component's success handler
            onClose(); // Close the dialog

        } catch (error) {
            if (
                (error.response && error.response.data.error === 1008) || // Token expired or invalid
                (error.response && error.response.data.error === 1006)    // Token error
            ) {
                // Refresh the access token and retry the request
                try {
                    const newAccessToken = await refreshToken(accessToken);
                    localStorage.setItem("accessToken", newAccessToken); // Store the new token

                    const response = await axios.delete(`${apiUrl}/${id}`, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${newAccessToken}`,
                        },
                    });
                    console.log('Deleted successfully:', response.data);
                    onDeleteSuccess(); // Call the parent component's success handler
                    onClose(); // Close the dialog

                } catch (refreshError) {
                    setErrorMessage("Failed to refresh token. Please log in again.");
                }
            } else {
                setErrorMessage(error.response?.data?.message || "Failed to delete. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                Are you sure you want to delete {id} {name && `- ${name}`}?
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleDelete}
                    color="error"
                    disabled={loading}
                >
                    {loading ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;
