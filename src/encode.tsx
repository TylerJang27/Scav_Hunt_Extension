import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HuntConfig } from "./types/hunt_config";
import { Card, CardContent, Container, Grid, TextField } from "@mui/material";
import { yellow } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import { PageHeaderAndSubtitle } from "./components/PageHeaderAndSubtitle";
import { Footer } from "./components/Footer";
import { theme } from "./components/theme";
import { Render } from "./utils/root";

const Encode = () => {
  const [huntConfig, setHuntConfig] = useState<HuntConfig | any>({});

  const sampleJson = `{
    "name": "The Hunt Is On",
    "description": "A basic scavenger hunt",
    "version": "1.0",
    "author": "Tyler Jang",
    "encrypted": false,
    "background": "https://images.unsplash.com/photo-1583425921686-c5daf5f49e4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=889&q=80",
    "options": { "silent": false },
    "beginning": "Welcome to the hunt.\nBegin by navigating to google.com",
    "clues": [
      {
        "id": 1,
        "url": "google.com",
        "text": "The hunt begins for pure and brave\nAt education's own conclave.\nYou'll find the treasure that you seek\nUpon Khan's anointed peak.",
        "image": "res/scav_alt.png",
        "alt": "Scavenger Hunt Icon"
      },
      {
        "id": 2,
        "url": "khanacademy.org/",
        "text": "You found the first clue!",
        "image": "https://i.pcmag.com/imagery/reviews/07AxdIVbQ63OEkJoPgCybXt-19.1594914797.fit_scale.size_1028x578.png",
        "alt": "Khan Academy"
      },
      {
        "id": 3,
        "url": "https://xkcd.com/",
        "html": "res/xkcd.html"
      },
      {
        "id": 4,
        "url": "https://www.nytimes.com/*",
        "text": "You cracked the code!",
        "interactive": {
          "prompt": "Enter yolo",
          "key": "yolo"
        }
      }
    ]
  }
  `;
  
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg" sx={{ mt: 3 }}>
          
        <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Card sx={{ mt: 4, backgroundColor: "#333" }}>
                <CardContent>
                  <PageHeaderAndSubtitle header={"Make Your Own Hunt"} />
          
          
          <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
            direction="row"
            >
              {/* Input pane */}
              <Grid item xs={6}
                          display={"grid"}>
                Input
              </Grid>

              {/* Preview pane */}
              {/*  TODO: Figure out how to set the color while also making disabled */}
              <Grid item xs={6}
                          display={"grid"}>
                <TextField variant="outlined" InputProps={{ inputProps: { style: { color: '#fff' }}}} maxRows={30} multiline value={sampleJson} sx={{fontFamily: "system-ui", fontSize: "0.9rem", color: "white"}}/>
              </Grid>
            </Grid>



            </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Footer />
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </>
  );
};

Render(<Encode />);
