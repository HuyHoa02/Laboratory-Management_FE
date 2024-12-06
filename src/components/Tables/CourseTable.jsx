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
import CreateCourseDialog from '../Dialog/CreateCourseDialog';  // Assuming you have a similar dialog for creating courses
import UpdateCourseDialog from '../Dialog/UpdateCourseDialog';
import DeleteConfirmationDialog from '../Dialog/DeleteConfirmationDialog';

const CourseTable = () => {
    const [courses, setCourses] = useState([]);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [deleteItem, setDeleteItem] = useState({ id: '', name: '' });

    // Fetch Courses Data
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/laboratory/public/get-course");
                setCourses(response.data.result); // Assuming `result` contains the courses list
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };

        fetchCourses();
    }, []);

    // Open Update Dialog with Selected Course Data
    const handleEdit = (id) => {
        const courseToEdit = courses.find((course) => course.id === id);
        setSelectedCourse(courseToEdit);  // Ensure this is setting the correct data
        setOpenUpdateDialog(true);  // Open the update dialog
    };

    // Open Delete Confirmation Dialog with Selected Course Data
    const handleDeleteDialogOpen = (id, name) => {
        setDeleteItem({ id, name });
        setOpenDeleteDialog(true);
    };

    // Refresh Courses Data
    const handleRefreshData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/laboratory/public/get-course");
            setCourses(response.data.result);
        } catch (error) {
            console.error("Failed to refresh course data:", error);
        }
    };

    return (
        <>
            {/* Create Course Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenCreateDialog(true)}
                sx={{ float: 'right', marginBottom: 2 }}
                startIcon={<AddIcon />}
            >
                Create Course
            </Button>

            {/* Course Table */}
            <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="courses table">
                    <TableHead>
                        <TableRow>
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
                            }}>Name</TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold', backgroundColor: '#2196f3', color: "white",
                                fontWeight: "bold",
                                textAlign: "center",
                                border: "1px solid #ddd",
                            }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
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
                                        onClick={() => handleDeleteDialogOpen(row.id, row.name)}
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

            {/* Create Course Dialog */}
            {openCreateDialog && (
                <CreateCourseDialog
                    open={openCreateDialog}
                    onClose={() => setOpenCreateDialog(false)}
                    onCreateSuccess={handleRefreshData}
                />
            )}

            {/* Update Course Dialog */}
            {selectedCourse && (
                <UpdateCourseDialog
                    openDialog={openUpdateDialog}  // Rename `open` to `openDialog`
                    handleDialogClose={() => setOpenUpdateDialog(false)}  // Rename `onClose` to `handleDialogClose`
                    courseData={selectedCourse}
                    onSave={handleRefreshData}
                />
            )}

            {/* Delete Confirmation Dialog */}
            {deleteItem.id && (
                <DeleteConfirmationDialog
                    open={openDeleteDialog}
                    onClose={() => setOpenDeleteDialog(false)}
                    id={deleteItem.id}
                    name={deleteItem.name}
                    apiUrl="http://localhost:8080/api/laboratory/admin/delete-course"
                    onDeleteSuccess={handleRefreshData}
                />
            )}
        </>
    );
};

export default CourseTable;
