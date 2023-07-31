import {
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  ThemeProvider,
} from "@mui/material";
import React from "react";
import { Header } from "src/components/Header";
import { ChooseHunt } from "src/components/landing_page/ChooseHunt";
import { CreateYourOwn } from "src/components/landing_page/CreateYourOwn";
import { Feedback } from "src/components/landing_page/Feedback";
import { LearnMore } from "src/components/landing_page/LearnMore";
import { Tutorial } from "src/components/landing_page/Tutorial";
import { theme } from "src/components/theme";
import { Render } from "src/utils/root";

export const LandingPage = () => (
  <>
    <ThemeProvider theme={theme}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 3, "&::after": { flex: "auto" } }}>
        <Divider />
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={6}>
            <Card sx={{ mt: 4, backgroundColor: "#333" }}>
              <CardContent>
                <ChooseHunt />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card sx={{ mt: 4, backgroundColor: "#333" }}>
              <CardContent>
                <Tutorial />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card sx={{ mt: 4, backgroundColor: "#333" }}>
              <CardContent>
                <CreateYourOwn />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card sx={{ mt: 4, backgroundColor: "#333" }}>
              <CardContent>
                <LearnMore />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={10}>
            <Card sx={{ mt: 4, backgroundColor: "#333" }}>
              <CardContent>
                <Feedback />
              </CardContent>
            </Card>
          </Grid>
          {/* <Grid item xs={12}>
              <Footer />
            </Grid> */}
        </Grid>
      </Container>
    </ThemeProvider>
  </>
);

Render(<LandingPage />);
