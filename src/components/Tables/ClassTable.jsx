import React, { useEffect, useState } from 'react';
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import DeleteConfirmationDialog from '../Dialog/DeleteConfirmationDialog';
import CreateClassDialog from '../Dialog/CreateClassDialog';
import AddIcon from "@mui/icons-material/Add";


const ClassTable = () => {
    const [classes, setClasses] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteItem, setDeleteItem] = useState({ id: '', name: '' });
    const [openCreateModal, setOpenCreateModal] = useState(false);


    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/laboratory/public/get-class");
                setClasses(response.data.result);
            } catch (error) {
                console.error("Failed to fetch classes:", error);
            }
        };

        fetchClasses();
    }, []);

    const handleDeleteDialogOpen = (id, name) => {
        setDeleteItem({ id, name });
        setOpenDeleteDialog(true);
    };

    const handleDeleteSuccess = () => {
        // Refresh the classes data after successful deletion
        setClasses(classes.filter(item => item.id !== deleteItem.id));
    };

    const handleCreateSuccess = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/laboratory/public/get-class");
            setClasses(response.data.result);
        } catch (error) {
            console.error('Failed to refresh classes:', error);
        }
    };

    return (
        <>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenCreateModal(true)}
                    startIcon={<AddIcon />}
                >
                    Create Class
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="classes table">
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
                            }}>Course ID</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Lecturer ID</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Size</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {classes.slice().map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.courseId}</TableCell>
                                <TableCell>{row.lecturerId}</TableCell>
                                <TableCell>{row.size}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeleteDialogOpen(row.id, row.lecturerId)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pass the necessary props to the DeleteConfirmationDialog */}
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                id={deleteItem.id}
                name={deleteItem.name}
                apiUrl="http://localhost:8080/api/laboratory/admin/delete-class"
                onDeleteSuccess={handleDeleteSuccess}
            />
            <CreateClassDialog
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onCreateSuccess={handleCreateSuccess}
            />
        </>
    );
};

export default ClassTable;
