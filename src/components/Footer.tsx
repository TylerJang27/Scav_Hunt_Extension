import { Box, Link, Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import React from "react";

export const Footer = () => {
  return (
    <>
      <footer>
        <Box
          sx={{
            width: "100%",
            height: "auto",
            backgroundColor: "#a8a8a850",
            paddingTop: "1rem",
            paddingBottom: "1rem",
            position: "fixed",
            bottom: "0",
            left: "0",
          }}
        >
          <Typography variant="body1" textAlign="center">
            {/* TODO: TYLER ADD OTHER LINKS AND THINGS */}
            <Link href="https://github.com/TylerJang27/Scav_Hunt_Extension" color={yellow[600]}>
              Scavenger Hunt Extension
            </Link>
          </Typography>
        </Box>
      </footer>
    </>
  );
};
