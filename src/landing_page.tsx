import {
  Card,
  CardContent,
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
import { PageHeaderAndSubtitle } from "src/components/PageHeaderAndSubtitle";
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
          alignItems="center"
        >
          {/* TODO: TYLER DRAW A BOX AROUND THE TOP ROW */}
          <Grid item xs={6}>
            <Card sx={{ mt: 4, backgroundColor: "#333" }}>
              <CardContent>
                <ChooseHunt />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={2}>
            <Card sx={{ mt: 4, backgroundColor: "#333" }}>
              <CardContent>
                <PageHeaderAndSubtitle header="OR" />
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
                <Tutorial />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={2}></Grid>

          <Grid item xs={6}>
            <Card sx={{ mt: 4, backgroundColor: "#333" }}>
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
