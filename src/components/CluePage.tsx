import { ThemeProvider } from "@emotion/react";
import { Container, Grid, Card, CardContent, Typography, createTheme } from "@mui/material";
import React from "react";
import { Footer } from "./Footer";
import { PageHeaderAndSubtitle } from "./PageHeaderAndSubtitle";
import { yellow } from "@mui/material/colors";

export interface CluePageProps {
title: React.ReactNode;
message: React.ReactNode;
}

export const CluePage = (props: CluePageProps) => {
      // TODO: TYLER FIGURE OUT THEMES
  const theme = createTheme({
    palette: {
      primary: {
        main: yellow[600],
      },
      secondary: {
        main: "#654eff",
      },
    },
  });

    return (
        <>
        <ThemeProvider theme={theme}>
          <Container maxWidth="sm" sx={{ mt: 3, "&::after": { flex: "auto" }}}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={12}>
                <Card sx={{mt: 4, backgroundColor: "#333"}}>
                  <CardContent>
                    <PageHeaderAndSubtitle header={props.title} />
                    <Typography variant="body1" textAlign="center" color="white" mt={1}>
                      {/* TODO: TYLER DO LINE REPLACEMENT */}
                      {props.message}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Footer/>
              </Grid>
            </Grid>
          </Container>
        </ThemeProvider>
        </>);
}