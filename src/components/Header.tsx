import { Box } from "@mui/material";
import React from "react";
import { PageHeaderAndSubtitle } from "src/components/PageHeaderAndSubtitle";

export const Header = () => {
  return (
    <>
      <header>
        <Box
          sx={{
            width: "100%",
            height: "auto",
            backgroundColor: "#a8a8a8",
            paddingTop: "1rem",
            paddingBottom: "1rem",
            position: "fixed",
            top: "0",
            left: "0",
          }}
        >
          <PageHeaderAndSubtitle header="Scavenger Hunt" />
        </Box>
      </header>
    </>
  );
};
