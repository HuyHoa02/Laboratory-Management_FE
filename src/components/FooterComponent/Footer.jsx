import React from "react";
import { Container, Grid, Typography, IconButton, Box } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import DribbbleIcon from "@mui/icons-material/SportsBasketball";

const Footer = () => {
    return (
        <Box component="footer" sx={{ backgroundColor: "#eaeaea", py: 4, marginTop: 'auto' }}>
            <Container>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                            Contact Us
                        </Typography>
                        <Typography variant="body2">
                            Placeholder text for contact details or other widgets.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                            Social
                        </Typography>
                        <Box>
                            <IconButton color="inherit" href="#" aria-label="Instagram">
                                <InstagramIcon />
                            </IconButton>
                            <IconButton color="inherit" href="#" aria-label="Twitter">
                                <TwitterIcon />
                            </IconButton>
                            <IconButton color="inherit" href="#" aria-label="Facebook">
                                <FacebookIcon />
                            </IconButton>
                            <IconButton color="inherit" href="#" aria-label="LinkedIn">
                                <LinkedInIcon />
                            </IconButton>
                            <IconButton color="inherit" href="#" aria-label="Pinterest">
                                <PinterestIcon />
                            </IconButton>
                            <IconButton color="inherit" href="#" aria-label="Dribbble">
                                <DribbbleIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Footer;
