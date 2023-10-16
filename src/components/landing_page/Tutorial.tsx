import { Container, Grid, Typography } from "@mui/material";
import React from "react";
import { PageHeaderAndSubtitle } from "src/components/reusable/PageHeaderAndSubtitle";

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
          {/* YouTube embedder based on https://dev.to/bravemaster619/simplest-way-to-embed-a-youtube-video-in-your-react-app-3bk2 */}
          <div className="video-responsive">
            <iframe
              width="853"
              height="480"
              src={`https://www.youtube.com/embed/yBkaL08VXWs`}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
              role="application"
            />
          </div>
        </Grid>
      </Grid>
    </Container>
  </>
);
