import { Box, Button, Divider, Link, Stack, Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import React from "react";
import { logger } from "src/logger";
import { resetStorage } from "src/providers/helpers";
import { getURL } from "src/providers/runtime";

export const Footer = () => (
  <>
    <footer>
      <Box
        sx={{
          width: "100%",
          height: "auto",
          backgroundColor: "#989898d0",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          position: "fixed",
          bottom: "0",
          left: "0",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
          sx={{ justifyContent: "center" }}
        >
          <Typography variant="body1" textAlign="center">
            {/* TODO: TYLER ADD OTHER LINKS AND THINGS */}
            <Link href={getURL("landing_page.html")} color={yellow[600]}>
              Home
            </Link>
          </Typography>
          <Typography variant="body1" textAlign="center">
            {/* TODO: TYLER ADD OTHER LINKS AND THINGS */}
            <Link
              href="https://github.com/TylerJang27/Scav_Hunt_Extension"
              color={yellow[600]}
            >
              GitHub
            </Link>
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            role="button"
            color={yellow[600]}
            onClick={() => {
              const confirmBox = window.confirm(
                "Do you really want to reset your progress?",
              );
              if (confirmBox === true) {
                logger.info("Resetting hunt");
                resetStorage(() => logger.info("Finished removing hunt"));
              }
            }}
            sx={{ textDecoration: "underline" }}
          >
            Reset Hunt
          </Typography>
        </Stack>
      </Box>
    </footer>
  </>
);
