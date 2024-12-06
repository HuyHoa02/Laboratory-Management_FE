import React, { useState, useEffect } from 'react';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check'; // Accept Icon
import CloseIcon from '@mui/icons-material/Close'; // Reject Icon
import axios from 'axios';
import AcceptRegistrationDialog from '../Dialog/AcceptRegistrationDialog';
import RejectRegistrationDialog from '../Dialog/RejectRegistrationDialog';

const RegistrationTable = () => {
    const [registrations, setRegistrations] = useState([]);
    const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken'); // Retrieve the token from local storage

                if (!accessToken) {
                    console.error('Access token is missing');
                    return;
                }

                const response = await axios.get(
                    'http://localhost:8080/api/laboratory/admin/get-registration',
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`, // Add the Authorization header
                        },
                    }
                );

                setRegistrations(response.data.result || []);
            } catch (error) {
                console.error('Failed to fetch registrations:', error);
            }
        };

        fetchRegistrations();
    }, []);

    const handleRefreshData = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken'); // Retrieve the token from local storage

            if (!accessToken) {
                console.error('Access token is missing');
                return;
            }

            const response = await axios.get(
                'http://localhost:8080/api/laboratory/admin/get-registration',
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Add the Authorization header
                    },
                }
            );

            setRegistrations(response.data.result || []);
        } catch (error) {
            console.error('Failed to fetch registrations:', error);
        }
    };

    const handleAcceptClick = (registration) => {
        setSelectedRegistration(registration);
        setOpenAcceptDialog(true);
    };

    const handleRejectClick = (registration) => {
        setSelectedRegistration(registration);
        setOpenRejectDialog(true);
    };

    const handleConfirm = () => {
        setOpenAcceptDialog(false); // Close the dialog after successful submission
    };

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleRefreshData}
                sx={{ float: 'right', marginBottom: 2 }}
                startIcon={<RefreshIcon />}
            >
                Refresh
            </Button>

            <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="registrations table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Class ID</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Laboratory ID</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Session Name</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Reservation Date</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>State</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {registrations.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.classId}</TableCell>
                                <TableCell>{row.labId}</TableCell>
                                <TableCell>{row.sessionName}</TableCell>
                                <TableCell>{row.reservationDate}</TableCell>
                                <TableCell>{row.state}</TableCell>
                                <TableCell>
                                    {row.state === 'PENDING' ? (
                                        <>
                                            <Button
                                                onClick={() => handleAcceptClick(row)}
                                                variant="outlined"
                                                color="success"
                                                sx={{ marginRight: 1 }}
                                                startIcon={<CheckIcon />}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                onClick={() => handleRejectClick(row)}
                                                variant="outlined"
                                                color="error"
                                                startIcon={<CloseIcon />}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    ) : (
                                        <Typography>Action Completed</Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pass the functions to the dialogs */}
            <AcceptRegistrationDialog
                open={openAcceptDialog}
                onClose={() => setOpenAcceptDialog(false)}
                registration={selectedRegistration}
                onConfirm={handleConfirm} // Pass handleConfirm here
            />

            <RejectRegistrationDialog
                open={openRejectDialog}
                onClose={() => setOpenRejectDialog(false)}
                registration={selectedRegistration}
                onConfirm={handleConfirm}
            />
        </>
    );
};


export default RegistrationTable;
