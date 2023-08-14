import { CardMedia, Container, Grid, Link } from "@mui/material";
import React from "react";
import { PageHeaderAndSubtitle } from "src/components/PageHeaderAndSubtitle";

export const CreateYourOwn = () => (
  <>
    <Container maxWidth="sm" sx={{ mt: 1 }}>
      <Grid container>
        <Grid item xs={12}>
          <PageHeaderAndSubtitle header="Create Your Own" />
        </Grid>
        <Link href="../encode.html" sx={{ paddingTop: 1 }}>
          <CardMedia
            component="img"
            image="../graphics/encode_teaser.png"
            alt="Encrypt Hunt Teaser"
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
