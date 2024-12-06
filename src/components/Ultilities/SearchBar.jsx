import React, { useState } from "react";
import { Box, InputBase, IconButton, MenuItem, Select, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BookIcon from "@mui/icons-material/Book";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const SearchBar = () => {
    const [searchText, setSearchText] = useState("");
    const [filterOption, setFilterOption] = useState("classId"); // Default filter option
    const [agendaResults, setAgendaResults] = useState([]);
    const navigate = useNavigate(); // Initialize the navigate function

    // Determine the appropriate icon based on the filter option
    const getFilterIcon = () => {
        switch (filterOption) {
            case "classId":
                return <BookIcon sx={{ fontSize: 18 }} />;
            case "courseName":
                return <SchoolIcon sx={{ fontSize: 18 }} />;
            case "lecturerName":
                return <PersonIcon sx={{ fontSize: 18 }} />;
            default:
                return <SearchIcon sx={{ fontSize: 18 }} />;
        }
    };

    // Function to call the API with the correct JSON format
    const fetchAgenda = async () => {
        const requestData = {
            method: filterOption,  // Pass the selected filter (classId, courseName, or lecturerName)
            input: searchText.replace(/\s+/g, ' ').trim(),     // Pass the search text as input
        };

        try {
            console.log(filterOption, searchText);
            const response = await fetch("http://localhost:8080/api/laboratory/admin/get-agenda-by-input", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),  // Send the formatted request
            });

            if (response.ok) {
                const data = await response.json();
                setAgendaResults(data); // Store the results
                console.log("Agenda results:", data); // Log the results for debugging

                // If data is returned, redirect to the SearchPage and pass data
                navigate("/search", { state: { agendaData: data } }); // Pass the data to the SearchPage
            } else {
                console.error("Failed to fetch agenda data");
                navigate("/"); // Redirect to the home page on API failure
            }
        } catch (error) {
            console.error("Error during API call:", error);
            navigate("/"); // Redirect to the home page in case of error
        }
    };

    // Trigger the API call when the search icon is clicked
    const handleSearch = () => {
        fetchAgenda(); // Call fetchAgenda when search icon is clicked
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                width: "60%",  // Compact width for search bar
                backgroundColor: "white",
                borderRadius: 1,
                padding: "2px 8px",
                boxShadow: 1,  // Optional: add shadow for visual effect
            }}
        >
            <Select
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
                sx={{
                    width: 100,  // Smaller width for the filter
                    marginRight: 1,  // Space between filter and input field
                    "& .MuiSelect-icon": { display: "none" },  // Hide the dropdown arrow
                    border: "none",  // Remove border
                    fontSize: "0.9rem",  // Smaller font size for filter options
                    width: '30%',
                }}
                startAdornment={
                    <InputAdornment position="start">
                        {getFilterIcon()}  {/* Dynamically add the filter icon */}
                    </InputAdornment>
                }
            >
                <MenuItem value="classId">Class ID</MenuItem>
                <MenuItem value="courseName">Course Name</MenuItem>
                <MenuItem value="lecturerName">Lecturer Name</MenuItem>
            </Select>

            <InputBase
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{
                    flex: 1,
                    backgroundColor: "#fff",
                    padding: "4px 10px",  // Compact padding
                    borderRadius: 1,
                    border: "none",  // Remove border
                    fontSize: "0.875rem",  // Smaller font size
                }}
            />

            <IconButton color="inherit" onClick={handleSearch} sx={{ padding: 0 }}>
                <SearchIcon sx={{ fontSize: 20, color: '#2196f3' }} />  {/* Larger icon for search */}
            </IconButton>
        </Box>
    );
};

export default SearchBar;
