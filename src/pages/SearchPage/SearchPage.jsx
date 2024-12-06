import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, List, ListItem, Divider, Paper } from "@mui/material";

const SearchPage = () => {
    const location = useLocation(); // Get the location object
    const [agendas, setAgendas] = useState([]); // Set initial state as empty

    // Use useEffect to update agendas whenever location.state changes
    useEffect(() => {
        if (location.state?.agendaData) {
            setAgendas(location.state.agendaData.result || []);
        }
    }, [location.state]); // Re-run whenever location.state changes

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Agenda List
            </Typography>

            {agendas.length > 0 ? (
                <List>
                    {agendas.map((agenda, index) => (
                        <ListItem key={index} sx={{ flexDirection: "column", marginBottom: 2 }}>
                            <Paper sx={{ padding: 2, width: "100%" }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {agenda.classId} - {agenda.courseName}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Session:</strong> {agenda.sessionName}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Date:</strong> {agenda.date}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Lecturer:</strong> {agenda.lecturerName}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Lab ID:</strong> {agenda.labId}
                                </Typography>
                            </Paper>
                            <Divider sx={{ marginTop: 2 }} />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body1">No agenda data available.</Typography>
            )}
        </Box>
    );
};

export default SearchPage;
