import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
} from '@mui/material';
import { refreshToken } from '../../client';

const UpdateLaboratoryDialog = ({ openDialog, handleDialogClose, laboratoryData, onSave }) => {

    console.log(openDialog)
    const [currentEditData, setCurrentEditData] = useState({ id: '', capacity: '' });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        if (laboratoryData) {
            setCurrentEditData(laboratoryData);
        }
    }, [laboratoryData]);

    const handleSaveChanges = async () => {
        setFormLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const { id, capacity } = currentEditData || {};

        if (!id || !capacity) {
            setErrorMessage("Please provide all required fields.");
            setFormLoading(false);
            return;
        }

        try {
            let accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setErrorMessage("No access token found. Please log in.");
                setFormLoading(false);
                return;
            }

            await axios.put(
                "http://localhost:8080/api/laboratory/admin/update-laboratory",
                { id, capacity },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setSuccessMessage("Laboratory updated successfully!");
            onSave(); // Notify the parent to refresh data
            handleDialogClose(); // Close the dialog
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

                    await axios.put(
                        "http://localhost:8080/api/laboratory/admin/update-laboratory",
                        { id, capacity },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        }
                    );

                    setSuccessMessage("Laboratory updated successfully!");
                    onSave(); // Notify the parent to refresh data
                    handleDialogClose(); // Close the dialog
                } catch (refreshError) {
                    setErrorMessage("Failed to refresh token. Please log in again.");
                }
            } else {
                setErrorMessage(
                    error.response?.data?.message || "Failed to update laboratory. Please try again."
                );
            }
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <Dialog
            open={openDialog}
            onClose={handleDialogClose}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 2,
                    width: 400,
                    padding: 3,
                    backgroundColor: '#fafafa',
                },
            }}
        >
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Update Laboratory
            </DialogTitle>
            <DialogContent>
                {/* Error Message */}
                {errorMessage && (
                    <Typography color="error" sx={{ marginBottom: 2 }}>
                        {errorMessage}
                    </Typography>
                )}

                {/* Success Message */}
                {successMessage && (
                    <Typography color="primary" sx={{ marginBottom: 2 }}>
                        {successMessage}
                    </Typography>
                )}

                <TextField
                    autoFocus
                    margin="dense"
                    label="Laboratory ID"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={currentEditData?.id || ''}
                    onChange={(e) =>
                        setCurrentEditData({ ...currentEditData, id: e.target.value })
                    }
                    disabled
                />
                <TextField
                    margin="dense"
                    label="Capacity"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={currentEditData?.capacity || ''}
                    onChange={(e) =>
                        setCurrentEditData({ ...currentEditData, capacity: e.target.value })
                    }
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button
                    onClick={handleDialogClose}
                    color="secondary"
                    sx={{ width: '100px' }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSaveChanges}
                    color="primary"
                    sx={{ width: '100px' }}
                    disabled={formLoading}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateLaboratoryDialog;
