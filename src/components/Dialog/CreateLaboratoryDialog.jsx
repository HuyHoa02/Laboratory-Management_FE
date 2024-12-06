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

const CreateLaboratoryDialog = ({ open, onClose, onCreateSuccess }) => {
    const [id, setId] = useState('');
    const [capacity, setCapacity] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleCreate = async () => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        // Validate required fields
        if (!id || !capacity) {
            setErrorMessage('Please provide all required fields.');
            setLoading(false);
            return;
        }

        try {
            let accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                setErrorMessage('No access token found. Please log in.');
                setLoading(false);
                return;
            }

            await axios.post(
                'http://localhost:8080/api/laboratory/admin/add-laboratory',
                { id, capacity },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setSuccessMessage('Laboratory created successfully!');
            onCreateSuccess(); // Notify parent to refresh data
            onClose(); // Close the modal
        } catch (error) {
            if (
                (error.response && error.response.data.error === 1008) ||
                (error.response && error.response.data.error === 1006)
            ) {
                try {
                    const token = localStorage.getItem('accessToken');
                    if (!token) {
                        throw new Error('No refresh token found.');
                    }

                    const newAccessToken = await refreshToken(token);
                    localStorage.setItem('accessToken', newAccessToken);

                    await axios.post(
                        'http://localhost:8080/api/laboratory/admin/add-laboratory',
                        { id, capacity },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        }
                    );

                    setSuccessMessage('Laboratory created successfully!');
                    onCreateSuccess(); // Notify parent to refresh data
                    onClose(); // Close the modal
                } catch (refreshError) {
                    setErrorMessage('Failed to refresh token. Please log in again.');
                }
            } else {
                setErrorMessage(
                    error.response?.data?.message || 'Failed to create laboratory. Please try again.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Create Laboratory</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Lab ID"
                    fullWidth
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Capacity"
                    fullWidth
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                />
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
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

export default CreateLaboratoryDialog;
