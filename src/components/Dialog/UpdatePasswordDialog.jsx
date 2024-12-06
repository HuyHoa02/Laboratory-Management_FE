import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";
import axios from "axios";
import { refreshToken } from "../../client";

const UpdatePasswordDialog = ({ open, onClose }) => {
    const [newPassword, setNewPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const id = localStorage.getItem("id");
        const accessToken = localStorage.getItem("accessToken");

        if (!id) {
            setErrorMessage("User ID not found. Please log in.");
            setLoading(false);
            return;
        }

        if (!accessToken) {
            setErrorMessage("Access token not found. Please log in.");
            setLoading(false);
            return;
        }

        try {
            // API call to update the password
            await axios.post(
                "http://localhost:8080/api/laboratory/lecturers/update-password",
                { id, newPassword },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setSuccessMessage("Password updated successfully!");
            setNewPassword("");
            onClose();
        } catch (error) {
            if (
                (error.response && error.response.data.error === 1008) ||
                (error.response && error.response.data.error === 1006)
            ) {
                try {
                    const token = localStorage.getItem("accessToken")

                    const newAccessToken = await refreshToken(token);
                    localStorage.setItem('accessToken', newAccessToken);


                    // Retry the password update request with the new token
                    await axios.post(
                        "http://localhost:8080/api/laboratory/lecturers/update-password",
                        { id, newPassword },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        }
                    );

                    setSuccessMessage("Password updated successfully!");
                    setNewPassword("");
                    onClose();
                } catch (refreshError) {
                    setErrorMessage("Failed to refresh token. Please log in again.");
                }
            } else {
                setErrorMessage(
                    error.response?.data?.message || "Failed to update password. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Update Password</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    id="newPassword"
                    label="New Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                />
                {errorMessage && (
                    <Typography color="error" variant="body2">
                        {errorMessage}
                    </Typography>
                )}
                {successMessage && (
                    <Typography color="primary" variant="body2">
                        {successMessage}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleUpdatePassword} color="primary" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdatePasswordDialog;
