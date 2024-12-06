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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import CreateLaboratoryDialog from '../Dialog/CreateLaboratoryDialog';
import UpdateLaboratoryDialog from '../Dialog/UpdateLaboratoryDialog';
import DeleteConfirmationDialog from '../Dialog/DeleteConfirmationDialog';

const LaboratoryTable = () => {
    const [laboratories, setLaboratories] = useState([]);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedLaboratory, setSelectedLaboratory] = useState(null);
    const [deleteItem, setDeleteItem] = useState({ id: '', name: '' });

    // Fetch Laboratories Data
    useEffect(() => {
        const fetchLaboratories = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8080/api/laboratory/public/get-laboratory'
                );
                setLaboratories(response.data.result); // Assuming `result` contains the laboratory list
            } catch (error) {
                console.error('Failed to fetch laboratories:', error);
            }
        };

        fetchLaboratories();
    }, []);

    // Open Update Dialog with Selected Laboratory Data
    const handleEdit = (id) => {
        const labToEdit = laboratories.find((lab) => lab.id === id);
        console.log('Editing Laboratory:', labToEdit); // Debugging line to check if labToEdit is found
        setSelectedLaboratory(labToEdit);  // Ensure this is setting the correct data
        setOpenUpdateDialog(true);  // Open the update dialog
    };


    // Open Delete Confirmation Dialog with Selected Laboratory Data
    const handleDeleteDialogOpen = (id, name) => {
        setDeleteItem({ id, name });
        setOpenDeleteDialog(true);
    };

    // Refresh Laboratories Data
    const handleRefreshData = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/laboratory/public/get-laboratory'
            );
            setLaboratories(response.data.result);
        } catch (error) {
            console.error('Failed to refresh laboratory data:', error);
        }
    };

    return (
        <>
            {/* Create Laboratory Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenCreateDialog(true)}
                sx={{ float: 'right', marginBottom: 2 }}
                startIcon={<AddIcon />}
            >
                Create Laboratory
            </Button>

            {/* Laboratory Table */}
            <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="laboratories table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>
                                Laboratory ID
                            </TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>
                                Capacity
                            </TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {laboratories.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.capacity}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => handleEdit(row.id)}
                                        variant="outlined"
                                        color="primary"
                                        sx={{ marginRight: 1 }}
                                        startIcon={<EditIcon />}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteDialogOpen(row.id, row.id)}
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create Laboratory Dialog */}
            {openCreateDialog && (
                <CreateLaboratoryDialog
                    open={openCreateDialog}
                    onClose={() => setOpenCreateDialog(false)}
                    onCreateSuccess={handleRefreshData}
                />
            )}

            {/* Update Laboratory Dialog */}
            {selectedLaboratory && (
                <UpdateLaboratoryDialog
                    openDialog={openUpdateDialog}  // Rename `open` to `openDialog`
                    handleDialogClose={() => setOpenUpdateDialog(false)}  // Rename `onClose` to `handleDialogClose`
                    laboratoryData={selectedLaboratory}
                    onSave={handleRefreshData}
                />
            )}


            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                id={deleteItem.id}
                name={deleteItem.name}
                apiUrl="http://localhost:8080/api/laboratory/admin/delete-laboratory"
                onDeleteSuccess={handleRefreshData}
            />
        </>
    );
};

export default LaboratoryTable;
