// src/components/Toast.js
import React, { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const Toast = ({ open, message, type, onClose, duration }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                severity={type}
                onClose={onClose}
                sx={{ width: '100%', maxWidth: 480 }}
            >
                <strong>{message.title}</strong>
                <div>{message.body}</div>
            </Alert>
        </Snackbar>
    );
};

export default Toast;
