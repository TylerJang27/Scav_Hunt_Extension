import {
  Card,
  CardContent,
  Container,
  Grid,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React from "react";
import { Header } from "src/components/reusable/Header";
import { ChooseHunt } from "src/components/landing_page/ChooseHunt";
import { CreateYourOwn } from "src/components/landing_page/CreateYourOwn";
import { LearnMore } from "src/components/landing_page/LearnMore";
import { Tutorial } from "src/components/landing_page/Tutorial";
import { theme } from "src/components/reusable/theme";
import { Render } from "src/utils/root";

export const LandingPage = () => (
  <>
    <ThemeProvider theme={theme}>
      <Header />
      <Container
        maxWidth="lg"
        sx={{ pb: 2, pt: 6, mt: 3, "&::after": { flex: "auto" } }}
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
            <Typography
              variant="h2"
              fontWeight={theme.typography.fontWeightBold}
              textAlign="center"
              color="white"
              fontFamily={"ADLaM Display"}
              fontSize="4.5rem"
            >
              OR
            </Typography>
          </Grid>

          <Grid item xs={6} sx={{ display: "flex" }}>
            <Card sx={{ mt: 4, backgroundColor: "#383d5bdd" }}>
              <CardContent>
                <CreateYourOwn />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6} sx={{ display: "flex" }}>
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
