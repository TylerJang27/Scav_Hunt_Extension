import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  ThemeProvider,
} from "@mui/material";
import React from "react";
import { Header } from "src/components/Header";
import { ChooseHunt } from "src/components/landing_page/ChooseHunt";
import { CreateYourOwn } from "src/components/landing_page/CreateYourOwn";
import { LearnMore } from "src/components/landing_page/LearnMore";
import { Tutorial } from "src/components/landing_page/Tutorial";
import { theme } from "src/components/theme";
import { Render } from "src/utils/root";

export const LandingPage = () => (
  <>
    <ThemeProvider theme={theme}>
      <Header />
      <Container
        maxWidth="lg"
        sx={{ pt: 4, mt: 3, "&::after": { flex: "auto" } }}
      >
        <Grid
          container
          columns={14}
          spacing={2}
          justifyContent="center"
          alignItems="stretch"
        >
          <Grid item xs={6} sx={{ display: "flex" }}>
            <Card sx={{ mt: 4, backgroundColor: "#383d5bdd" }}>
              <CardContent>
                <ChooseHunt />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={2} sx={{ alignSelf: "center" }}>
            <Card sx={{ mt: 4, backgroundColor: "#383d5bdd" }}>
              <CardMedia
                component="img"
                image="../graphics/or.png"
                alt="OR"
                sx={{
                  root: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                  },
                }}
              />
              {/* <CardContent sx={{root: {
    position: "relative",
    backgroundColor: "transparent"
  }}}>
              
                <PageHeaderAndSubtitle header="OR" />
              </CardContent> */}
            </Card>
          </Grid>

          <Grid item xs={6} sx={{ display: "flex" }}>
            <Card sx={{ mt: 4, backgroundColor: "#383d5bdd" }}>
              <CardContent>
                <CreateYourOwn />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card sx={{ mt: 4, backgroundColor: "#383d5bdd" }}>
              <CardContent>
                <Tutorial />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={2}></Grid>

          <Grid item xs={6} sx={{ display: "flex" }}>
            <Card sx={{ mt: 4, backgroundColor: "#383d5bdd" }}>
              <CardContent>
                <LearnMore />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  </>
);

Render(<LandingPage />);
