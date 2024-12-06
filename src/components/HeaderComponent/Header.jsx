// Header.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
    Button,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchBar from "../Ultilities/SearchBar";
import UpdatePasswordDialog from "../Dialog/UpdatePasswordDialog";

const Header = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const toggleDialog = () => {
        setIsDialogOpen((prev) => !prev);
    };


    // UseEffect to check if the user is logged in on initial render
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const id = localStorage.getItem("id");

        if (token && id) {
            const fetchUserInfo = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:8080/api/laboratory/admin/get-info/${id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    setUserInfo(response.data.result);
                } catch (error) {
                    console.error("Error fetching user info:", error);
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("id");
                }
            };
            fetchUserInfo();
        }
    }, []);

    const toggleDrawer = (open) => {
        setDrawerOpen(open);
    };

    const toggleLoginModal = () => {
        setLoginModalOpen(!loginModalOpen);
        setErrorMessage(""); // Reset any error message on close
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        // Clear user info and token
        localStorage.removeItem("accessToken");
        localStorage.removeItem("id");
        setUserInfo(null);  // Clear the user info from state
        setAnchorEl(null);
        window.location.reload(); // Refresh page
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/laboratory/auth/signin",
                { username, password },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true, // Send credentials (if any)
                }
            );

            const { token, id, authenticated } = response.data.result;

            if (!authenticated) {
                window.location.href = '/verify-email'
                return;
            }

            // Store the token and id in localStorage
            localStorage.setItem("accessToken", token);
            localStorage.setItem("id", id);

            // Fetch user info after successful login
            const userInfoResponse = await axios.get(
                `http://localhost:8080/api/laboratory/admin/get-info/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setUserInfo(userInfoResponse.data.result); // Update user info state

            if (id == "admin") window.location.href = 'http://localhost:5173/admin';
            // Reload the page to reflect the changes
            else window.location.reload(); // Refresh page

        } catch (error) {
            if (error.response) {
                setErrorMessage("Invalid username or password");
            } else {
                setErrorMessage("Server is not responding. Please try again later.");
            }
        }
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => toggleDrawer(true)}
                        sx={{ display: { xs: "block", md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        component="a"
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            color: "inherit",
                        }}
                        onClick={() => { window.location.href = "/" }}
                    >
                        CIT
                        <span style={{ color: "#1976d2" }}>.</span>
                        <img src="/public/cit-logo.png" width="40px" alt="Logo" style={{ marginLeft: 8 }} />
                    </Typography>

                    <Box sx={{ display: { xs: "none", md: "block" }, flexGrow: 1, textAlign: 'center' }} >
                        <SearchBar />
                    </Box>

                    <Box sx={{ display: { xs: "none", md: "block" } }}>
                        {userInfo ? (
                            <>
                                <Button color="inherit" onClick={handleMenuClick}>
                                    {userInfo.firstname} {userInfo.lastname}
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={toggleDialog}>
                                        Change password
                                    </MenuItem>

                                    <MenuItem onClick={handleLogout}>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button color="inherit" onClick={toggleLoginModal}>
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
                <List>
                    <ListItem button component="a" href="/Home/Index">
                        <ListItemText primary="Agenda" />
                    </ListItem>
                    <ListItem button onClick={toggleLoginModal}>
                        <ListItemText primary="Login" />
                    </ListItem>
                </List>
            </Drawer>

            <Dialog open={loginModalOpen} onClose={toggleLoginModal}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="username"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errorMessage && (
                        <Typography color="error" variant="body2">
                            {errorMessage}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleLoginModal} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleLogin} color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
            <UpdatePasswordDialog open={isDialogOpen} onClose={toggleDialog} />
        </>
    );
};

export default Header;
