import React, { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

const VerifyEmailPage = () => {
    const [lecturerId, setLecturerId] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:8080/api/laboratory/auth/verify-email', {
                lecturerId,
                verifyCode
            });
            setSuccessMessage('Email verification successful!');
            window.location.href = '/'
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Verification failed. Please check your details and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
            <Typography variant="h4" gutterBottom>Verify Your Email</Typography>

            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
                <TextField
                    label="Lecturer ID"
                    variant="outlined"
                    fullWidth
                    value={lecturerId}
                    onChange={(e) => setLecturerId(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />

                <TextField
                    label="Verification Code"
                    variant="outlined"
                    fullWidth
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />

                {errorMessage && (
                    <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>
                        {errorMessage}
                    </Typography>
                )}

                {successMessage && (
                    <Typography color="primary" variant="body2" sx={{ marginBottom: 2 }}>
                        {successMessage}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Email'}
                </Button>
            </form>
        </Box>
    );
};

export default VerifyEmailPage;
