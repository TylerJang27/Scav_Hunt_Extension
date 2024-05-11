import { Box, Grid } from "@mui/material";
import React from "react";
import { PageHeaderAndSubtitle } from "src/components/reusable/PageHeaderAndSubtitle";
import { getURL } from "src/providers/runtime";

export const Header = () => (
  <>
    <header>
      <Box
        sx={{
          width: "100%",
          height: "auto",
          backgroundColor: "#121416ee",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: 99,
        }}
      >
        <Grid
          container
          direction="row"
          spacing={1}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 1,
          }}
        >
          <img
            src={getURL("graphics/scav.png")}
            style={{
              width: "45px",
              height: "50px",
              paddingTop: "5px",
              marginRight: "15px",
            }}
            alt="Scavenger Hunt Logo"
          />
          <PageHeaderAndSubtitle header="Scavenger Hunt" />
        </Grid>
      </Box>
    </header>
  </>
);
