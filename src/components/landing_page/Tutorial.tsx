import { Container, Grid, Typography } from "@mui/material";
import React from "react";
import YouTube from "react-youtube";
import { PageHeaderAndSubtitle } from "src/components/PageHeaderAndSubtitle";

export const Tutorial = () => (
  <>
    <Container maxWidth="sm" sx={{ mt: 1 }}>
      <Grid container>
        <Grid item xs={12}>
          <PageHeaderAndSubtitle header="Tutorial" />
        </Grid>
        <Grid item xs={12}>
          <Typography textAlign={"center"}>
            Follow the clues, visit the matching websites, and solve the hunt!
          </Typography>
          <YouTube videoId="yBkaL08VXWs" style={{ display: "flex" }} />
        </Grid>
      </Grid>
    </Container>
  </>
);
