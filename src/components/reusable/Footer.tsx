import { Box, Divider, Link, Stack, Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import React from "react";
import { logger } from "src/logger";
import { setPopup } from "src/providers/action";
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
            <Link href={getURL("landing_page.html")} color={yellow[600]}>
              Home
            </Link>
          </Typography>
          <Typography variant="body1" textAlign="center">
            <Link href={getURL("beginning.html")} color={yellow[600]}>
              Beginning
            </Link>
          </Typography>
          <Typography variant="body1" textAlign="center">
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
                setPopup({ popup: "" }, () => {});
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

export interface OverlayFooterProps {
  isBeginning: boolean;
}

export const OverlayFooter = (props: OverlayFooterProps) => (
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
          {!props.isBeginning && (
            <Typography variant="body1" textAlign="center">
              <Link
                href={getURL("popup.html")}
                color={yellow[600]}
                target="_blank"
              >
                View in Tab
              </Link>
            </Typography>
          )}
          <Typography variant="body1" textAlign="center">
            <Link
              href={getURL("beginning.html")}
              color={yellow[600]}
              target="_blank"
            >
              Beginning
            </Link>
          </Typography>
        </Stack>
      </Box>
    </footer>
  </>
);
