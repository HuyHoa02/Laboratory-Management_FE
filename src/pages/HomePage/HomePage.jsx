import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { refreshToken } from "../../client";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    Paper,
    TableContainer,
    Link,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
} from "@mui/material";
import AddRegistrationExcelDialog from "../../components/Dialog/AddRegistrationExcelDialog";


const HomePage = () => {
    const { id } = useParams();
    const [labs, setLabs] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [timeSet, setTimeSet] = useState({});
    const [agendas, setAgendas] = useState([]);
    const [classes, setClasses] = useState([]); // State for classes
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [classId, setClassId] = useState("");
    const [labId, setLabId] = useState("");
    const [sessionName, setSessionName] = useState("");
    const [reservationDate, setReservationDate] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [timeSets, setTimeSets] = useState([]); // Store list of TimeSets
    const [openExcelDialog, setOpenExcelDialog] = useState(false);  // State for Excel dialog


    const defaultId = id ? id : "1";


    useEffect(() => {
        const fetchData = async () => {
            const lecturerId = localStorage.getItem("id"); // Get the lecturer ID from localStorage

            try {
                // Make the initial API calls regardless of the login status
                const [labsRes, sessionsRes, timeSetRes, allTimeSetsRes, agendasRes] = await Promise.all([
                    axios.get("http://localhost:8080/api/laboratory/public/get-laboratory"),
                    axios.get("http://localhost:8080/api/laboratory/public/get-session"),
                    axios.get(`http://localhost:8080/api/laboratory/public/get-timeset/${defaultId}`),
                    axios.get(`http://localhost:8080/api/laboratory/public/get-all-timesets`),
                    axios.get(`http://localhost:8080/api/laboratory/public/get-agenda/${defaultId}`),
                ]);

                setLabs(labsRes.data.result);
                setSessions(sessionsRes.data.result);
                setTimeSet(timeSetRes.data.result);
                setAgendas(agendasRes.data.result);
                setTimeSets(allTimeSetsRes.data.result)

                // Only fetch classes if lecturerId exists in localStorage
                if (lecturerId) {
                    const classesRes = await axios.get(`http://localhost:8080/api/laboratory/public/get-class/${lecturerId}`);
                    setClasses(classesRes.data.result);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    const handleOpenModal = (sessionName, labId) => {
        if (!localStorage.getItem("id")) {
            setErrorMessage("You must be logged in to register.");
            return;
        }

        console.log(sessionName, labId)

        setSessionName(sessionName); // Set session and lab values from clicked cell
        setLabId(labId); // Set selected labId
        setOpenModal(true);
    };

    const handleCloseModal = () => setOpenModal(false);

    const handleOpenExcelDialog = () => setOpenExcelDialog(true);
    const handleCloseExcelDialog = () => setOpenExcelDialog(false);


    const handleSubmit = async () => {
        setFormLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        if (!classId || !labId || !sessionName || !reservationDate) {
            setErrorMessage("Please fill all required fields.");
        }

        try {
            // Get accessToken from localStorage
            let accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                console.log("No Token found!");
            }

            // Send POST request with Bearer token in Authorization header
            await axios.post(
                "http://localhost:8080/api/laboratory/admin/add-registration",
                { classId, labId, sessionName, reservationDate },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`,
                    },
                }
            );

            setSuccessMessage("Registration created successfully!");
            setClassId("");
            setLabId("");
            setSessionName("");
            setReservationDate("");
            setOpenModal(false);

        } catch (error) {
            // Check if the error is related to expired token (error code 1008) or unauthenticated (error code 1006)
            if (
                (error.response && error.response.data.error === 1008) ||
                (error.response && error.response.data.error === 1006)
            ) {

                // Attempt to refresh the token
                try {
                    // Get refreshToken from localStorage
                    const refreshTokenFromStorage = localStorage.getItem("accessToken");

                    // Call the refreshToken function from authService
                    const newAccessToken = await refreshToken(refreshTokenFromStorage);
                    console.log(newAccessToken);

                    // If the token refresh is successful, update the accessToken in localStorage
                    localStorage.setItem("accessToken", newAccessToken);

                    // Retry the original request with the new accessToken
                    try {
                        await axios.post(
                            "http://localhost:8080/api/laboratory/admin/add-registration",
                            { classId, labId, sessionName, reservationDate },
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${newAccessToken}`,
                                },
                            }
                        );

                        setSuccessMessage("Registration created successfully!");
                        setClassId("");
                        setLabId("");
                        setSessionName("");
                        setReservationDate("");
                        setOpenModal(false);
                    } catch (retryError) {
                        // If the second call fails, show a more specific error message
                        setErrorMessage(
                            retryError.response?.data?.message || "Failed to create registration after refreshing token. Please try again later."
                        );
                    }
                } catch (refreshError) {
                    // If token refresh fails, show an error message
                    setErrorMessage("Failed to refresh token. Please log in again.");
                }
            } else {
                // For other errors, show the general error message
                setErrorMessage(
                    error.response?.data?.message || "Failed to create registration. Please try again."
                );
            }
        } finally {
            setFormLoading(false);
        }
    };





    const generateWeekDays = (startDate) => {
        if (!startDate) return [];
        const days = [];
        const start = new Date(startDate);
        for (let i = 0; i < 7; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            const formattedDate = day.toISOString().split("T")[0];
            days.push({
                date: formattedDate,
                day: day.toLocaleDateString("en-US", { weekday: "long" }),
            });
        }
        return days;
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    const weekDays = generateWeekDays(timeSet.startDate);

    return (
        <Paper sx={{ padding: 2, marginTop: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", marginLeft: '35%' }}>
                    ĐĂNG KÝ SỬ DỤNG PHÒNG THỰC HÀNH
                </Typography>
                {
                    localStorage.getItem('accessToken') && (
                        <Box
                            sx={{ marginBottom: 1, display: "flex", justifyContent: "right", flexWrap: "wrap" }}
                            startIcon={<AddIcon />}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleOpenExcelDialog}  // Open Excel upload dialog
                            >
                                + Add Registration with Excel
                            </Button>
                        </Box>
                    )
                }

            </Box>
            <Box
                sx={{
                    marginBottom: 2,
                    display: 'flex',
                    justifyContent: 'center',  // Horizontal centering
                    alignItems: 'center',      // Vertical centering
                    flexWrap: 'wrap',          // Allows buttons to wrap if needed
                }}
            >
                {timeSets.map((timeSet, index) => (
                    <Button
                        key={`${timeSet.id}-${index}`} // Combines id and index for uniqueness
                        component={Link}
                        to={`/home/${timeSet.isCurrent}`} // Using Link properly here
                        sx={{ margin: "5px" }}
                        variant="contained"
                        color={timeSet.isCurrent == defaultId ? "success" : "primary"}
                        onClick={() => { window.location.href = `/home/${timeSet.isCurrent}` }}
                    >
                        {timeSet.isCurrent}
                    </Button>
                ))}

            </Box>



            <TableContainer component={Box} sx={{ overflowX: "auto", border: "1px solid #ddd" }}>
                <Table sx={{ minWidth: 800, border: "1px solid #ddd" }} aria-label="Timesheet Table">
                    <TableHead>
                        <TableRow>
                            {/* Session Header */}
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    border: "1px solid #ddd",
                                }}
                            >
                                Session
                            </TableCell>
                            {/* Laboratory Header */}
                            <TableCell
                                rowSpan={2}
                                sx={{
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    border: "1px solid #ddd",
                                }}
                            >
                                Laboratory
                            </TableCell>
                            {weekDays.map((day, index) => (
                                <TableCell
                                    key={`date-${index}`} // Unique key for each date cell
                                    sx={{
                                        backgroundColor: "#2196f3",
                                        color: "white",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        border: "1px solid #ddd",
                                    }}
                                >
                                    {new Date(day.date).toLocaleDateString("en-GB")} {/* Format as dd/MM/yyyy */}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            {weekDays.map((day, index) => (
                                <TableCell
                                    key={`day-${index}`} // Unique key for each day cell
                                    sx={{
                                        backgroundColor: "#2196f3",
                                        color: "white",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        border: "1px solid #ddd",
                                    }}
                                >
                                    {day.day}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sessions.map((session) =>
                            labs.map((lab, index) => (
                                <TableRow key={`${session.name}-${lab.id}`}>
                                    {index === 0 && (
                                        <TableCell
                                            key={`session-${session.name}`}
                                            rowSpan={labs.length}
                                            sx={{
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                border: "1px solid #ddd",
                                                backgroundColor: "#f9f9f9",
                                            }}
                                        >
                                            {session.name}
                                        </TableCell>
                                    )}
                                    <TableCell
                                        key={`lab-${lab.id}`}
                                        sx={{
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            border: "1px solid #ddd",
                                            backgroundColor: "#f0f0f0",
                                            "&:hover": { backgroundColor: "#e0e0e0" },
                                        }}
                                    >
                                        {lab.id}
                                    </TableCell>
                                    {weekDays.map((day) => {
                                        const agenda = agendas.find(
                                            (a) =>
                                                a.date === day.date &&
                                                a.labId === lab.id &&
                                                a.sessionName === session.name
                                        );
                                        return (
                                            <TableCell
                                                key={`${lab.id}-${day.date}-${session.name}`}
                                                sx={{
                                                    textAlign: "center",
                                                    border: "1px solid #ddd",
                                                    backgroundColor: "#ffffff",
                                                    "&:hover": { backgroundColor: "#f5f5f5" },
                                                }}
                                                onClick={() => handleOpenModal(session.name, lab.id)}
                                            >
                                                {agenda ? (
                                                    <>
                                                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                                            {agenda.classId}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                                            {agenda.courseName}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {agenda.lecturerName}
                                                        </Typography>
                                                    </>
                                                ) : null}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        )}
                    </TableBody>

                </Table>
            </TableContainer>



            {/* Modal */}
            <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
                <DialogTitle>Create Registration</DialogTitle>
                <DialogContent>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    <FormControl fullWidth margin="dense" variant="outlined">
                        <InputLabel id="class-select-label">Class</InputLabel>
                        <Select
                            labelId="class-select-label"
                            value={classId}  // This value should be set from the selected class in the modal
                            onChange={(e) => setClassId(e.target.value)}
                            label="Class"
                        >
                            {classes.map((cls) => (
                                <MenuItem key={cls.id} value={cls.id}>
                                    {cls.id} (Size: {cls.size})
                                </MenuItem>
                            ))}
                        </Select>

                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel id="lab-select-label">Laboratory</InputLabel>
                        <Select
                            labelId="lab-select-label"
                            value={labId} // Use labId here
                            onChange={(e) => setLabId(e.target.value)}
                            label="Laboratory"
                        >
                            {labs.map((lab) => (
                                <MenuItem key={lab.id} value={lab.id}>
                                    {lab.id} (Capacity: {lab.capacity})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                    <FormControl fullWidth margin="dense" variant="outlined">
                        <InputLabel id="session-select-label">Session</InputLabel>
                        <Select
                            labelId="session-select-label"
                            value={sessionName} // Use sessionName here
                            onChange={(e) => setSessionName(e.target.value)}
                            label="Session"
                        >
                            {sessions.map((session) => (
                                <MenuItem key={session.name} value={session.name}>
                                    {session.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                    <TextField
                        margin="dense"
                        label="Reservation Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={reservationDate}
                        onChange={(e) => setReservationDate(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={formLoading}>
                        {formLoading ? <CircularProgress size={24} /> : "Submit"}
                    </Button>
                </DialogActions>
            </Dialog>
            <AddRegistrationExcelDialog open={openExcelDialog} onClose={handleCloseExcelDialog} />

        </Paper >
    );
};

export default HomePage;
