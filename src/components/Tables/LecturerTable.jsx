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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import DeleteConfirmationDialog from '../Dialog/DeleteConfirmationDialog';  // Import the DeleteConfirmationDialog
import CreateLecturerDialog from '../Dialog/CreateLecturerDialog';  // Import the CreateLecturerDialog

const LecturerTable = () => {
    const [users, setUsers] = useState([]); // Renamed to 'users'
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteItem, setDeleteItem] = useState({ id: '', name: '' });
    const [openCreateLecturerDialog, setOpenCreateLecturerDialog] = useState(false); // State for Create Lecturer Dialog

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/laboratory/public/get-lecturers");
                setUsers(response.data.result); // Assuming 'result' contains the list of users
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteDialogOpen = (id, name) => {
        setDeleteItem({ id, name });
        setOpenDeleteDialog(true);
    };

    const handleDeleteSuccess = () => {
        // Remove the deleted user from the state
        setUsers(users.filter(user => user.id !== deleteItem.id));
    };

    return (
        <>
            {/* Create Lecturer Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenCreateLecturerDialog(true)}  // Open Create Lecturer Dialog
                sx={{ float: 'right', marginBottom: 2 }}
                startIcon={<AddIcon />}
            >
                Create Lecturer
            </Button>

            <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="users table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>User ID</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>First Name</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Last Name</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Gender</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Email</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Phone Number</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Roles</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.firstname}</TableCell>
                                <TableCell>{row.lastname}</TableCell>
                                <TableCell>{row.gender}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.phoneNum}</TableCell>
                                <TableCell>{row.roles.map(role => role.name).join(', ')}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeleteDialogOpen(row.id, row.firstname + ' ' + row.lastname)}  // Open the delete dialog
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                id={deleteItem.id}
                name={deleteItem.name}
                apiUrl={`http://localhost:8080/api/laboratory/admin/delete-lecturer`}  // API URL for deleting lecturer
                onDeleteSuccess={handleDeleteSuccess}  // Callback after successful deletion
            />

            {/* Create Lecturer Dialog */}
            <CreateLecturerDialog
                open={openCreateLecturerDialog}
                onClose={() => setOpenCreateLecturerDialog(false)}  // Close the dialog
                onCreateSuccess={() => {
                    setOpenCreateLecturerDialog(false); // Close dialog after success
                    // Optionally, refresh the users list here
                    axios.get("http://localhost:8080/api/laboratory/public/get-lecturers")
                        .then(response => setUsers(response.data.result))
                        .catch(error => console.error('Error fetching users:', error));
                }}
            />
        </>
    );
};

export default LecturerTable;
