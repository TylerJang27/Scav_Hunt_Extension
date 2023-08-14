import GitHubIcon from "@mui/icons-material/GitHub";
import { CardMedia, Container, Grid, Link, Typography } from "@mui/material";
import React from "react";
import { PageHeaderAndSubtitle } from "src/components/PageHeaderAndSubtitle";

export const LearnMore = () => (
  <>
    <Container maxWidth="sm" sx={{ mt: 1 }}>
      <Grid container>
        <Grid item xs={12}>
          <PageHeaderAndSubtitle header="Learn More" />
        </Grid>
        <Grid item xs={12}>
          <Typography textAlign={"center"}>
            Discover new scavenger hunts to solve made by other hunt creators!
          </Typography>
          <CardMedia
            component="img"
            image="../graphics/coming_soon.png"
            alt="Coming Soon"
            loading="lazy"
            width="75%"
            height="75%"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              display: "flex",
              paddingTop: "1",
              objectFit: "scale-down",
            }}
          />
          <Link
            href="https://github.com/TylerJang27/Scav_Hunt_Extension"
            sx={{ display: "flex", justifyContent: "center", pt: 1 }}
          >
            <GitHubIcon />
          </Link>
          <Typography textAlign={"center"} sx={{ pt: 1 }}>
            <Link href="https://forms.gle/3ZhvtKasc3WZZF9V7">Feedback</Link>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  </>
);
