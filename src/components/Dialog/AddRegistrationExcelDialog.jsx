import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    CircularProgress,
    Alert,
} from "@mui/material";
import axios from "axios";
import { refreshToken } from "../../client";

const AddRegistrationExcelDialog = ({ open, onClose }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            setErrorMessage("Access token not found. Please log in.");
            setLoading(false);
            return;
        }

        if (!file) {
            setErrorMessage("Please select a file to upload.");
            setLoading(false);
            return;
        }

        // Prepare formData
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Send the file to the backend API
            await axios.post("http://localhost:8080/api/laboratory/admin/add-registrations", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setSuccessMessage("Registrations added successfully!");
            setFile(null); // Reset file input
        } catch (error) {
            if (
                (error.response && error.response.data.error === 1008) ||
                (error.response && error.response.data.error === 1006)
            ) {
                try {
                    const token = localStorage.getItem("accessToken");
                    const newAccessToken = await refreshToken(token);
                    localStorage.setItem("accessToken", newAccessToken);

                    // Retry the file upload request with the new token
                    await axios.post(
                        "http://localhost:8080/api/laboratory/admin/add-registrations",
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        }
                    );

                    setSuccessMessage("Registrations added successfully!");
                    setFile(null); // Reset file input
                } catch (refreshError) {
                    setErrorMessage("Failed to refresh token. Please log in again.");
                }
            } else {
                setErrorMessage(
                    error.response?.data?.message || "Failed to upload the file. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Registration with Excel</DialogTitle>
            <DialogContent>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                <TextField
                    type="file"
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    onChange={handleFileChange}
                    inputProps={{ accept: ".xlsx" }}
                />
                <div style={{ marginTop: "1rem" }}>
                    <a href="/sample-excel-file.xlsx" target="_blank" rel="noopener noreferrer">
                        Download Sample Excel File
                    </a>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddRegistrationExcelDialog;
