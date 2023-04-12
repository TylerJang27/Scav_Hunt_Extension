import { Box, Link, Typography } from "@mui/material";
import React from "react";

export const Footer = () => {
    return (
        <>
    <footer>
        <Box sx={{
            width: "100%",
            height: "auto",
            backgroundColor: "#a8a8a850",
            paddingTop: "1rem",
            paddingBottom: "1rem",
            position: "absolute",
            bottom: "0",
            left: "0",
        }}>
        <Typography variant="body1" textAlign="center">
            {/* TODO: TYLER ADD OTHER LINKS AND THINGS */}
        <Link href="https://github.com/TylerJang27/Scav_Hunt_Extension">Scavenger Hunt Extension</Link>
        </Typography>
        </Box>
    </footer>
    </>);
    };