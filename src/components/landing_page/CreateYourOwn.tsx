import { Container, Grid, Link, Typography } from "@mui/material";
import React from "react";
import { PageHeaderAndSubtitle } from "src/components/PageHeaderAndSubtitle";

export const CreateYourOwn = () => (
  <>
    <Container maxWidth="sm" sx={{ mt: 1 }}>
      <Grid container>
        <Grid item xs={12}>
          <PageHeaderAndSubtitle header="Create Your Own" />
        </Grid>
        <Link href="../encode.html">
          <img
            src={"../graphics/encode_teaser.png"}
            alt={"Coming"}
            loading="lazy"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "100%",
              objectFit: "cover",
              display: "flex",
            }}
          />
        </Link>
      </Grid>
    </Container>
  </>
);
