import { Container, Grid, Link, Typography } from "@mui/material";
import React from "react";
import { PageHeaderAndSubtitle } from "src/components/PageHeaderAndSubtitle";

export const Feedback = () => (
  <>
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PageHeaderAndSubtitle header="Feedback" />
        </Grid>
        <Grid item xs={12}>
          <Typography>
            Short blurb about coming soon and a google form link
          </Typography>
        </Grid>
      </Grid>
    </Container>
  </>
);