import { Box, Divider, Link, Stack, Typography } from "@mui/material";
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
          backgroundColor: "#484848d0",
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
            onClick={() => {
              const confirmBox = window.confirm(
                "Do you really want to reset your progress?",
              );
              if (confirmBox === true) {
                logger.info("Resetting hunt");
                resetStorage(() => logger.info("Finished removing hunt"));
              }
            }}
          >
            <Link color={yellow[600]}>Reset Hunt</Link>
          </Typography>
        </Stack>
      </Box>
    </footer>
  </>
);
