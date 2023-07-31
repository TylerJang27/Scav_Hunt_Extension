import { Container, Grid, Link, Typography } from "@mui/material";
import React from "react";
import { PageHeaderAndSubtitle } from "src/components/PageHeaderAndSubtitle";

export const LearnMore = () => (
  <>
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PageHeaderAndSubtitle header="Learn More" />
        </Grid>
        <Grid item xs={12}>
          <Typography>Learn More</Typography>
          <Typography>Browse Hunts</Typography>
        </Grid>
      </Grid>
    </Container>
  </>
);
