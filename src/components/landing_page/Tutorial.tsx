import {
  Container,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import React from "react";
import { PageHeaderAndSubtitle } from "src/components/PageHeaderAndSubtitle";

export const Tutorial = () => {

  return (
    <>
        <Container maxWidth="sm" sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PageHeaderAndSubtitle header="Tutorial" />
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Welcome!!!
              </Typography>
            </Grid>
          </Grid>
        </Container>
    </>
  );
};
