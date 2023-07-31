import { Box } from "@mui/material";
import React from "react";
import { PageHeaderAndSubtitle } from "src/components/PageHeaderAndSubtitle";

export const Header = () => (
  <>
    <header>
      <Box
        sx={{
          width: "100%",
          height: "auto",
          backgroundColor: "#A5C2DF",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          position: "fixed",
          top: "0",
          left: "0",
        }}
      >
        {/* TODO: TYLER ADD LOGO */}
        <PageHeaderAndSubtitle header="Scavenger Hunt" />
      </Box>
    </header>
  </>
);
