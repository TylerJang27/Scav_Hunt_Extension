import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ClueConfig, HuntConfig } from "./types/hunt_config";
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  TextField,
  createTheme,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";
import { yellow } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import { PageHeaderAndSubtitle } from "./components/PageHeaderAndSubtitle";
import { Footer } from "./components/Footer";
import { theme } from "./components/theme";
import { Render } from "./utils/root";
import { ExitableModal } from "./components/ExitableModal";

const Encode = () => {
  const [huntConfig, setHuntConfig] = useState<HuntConfig>({
    name: "",
    description: "",
    author: "",
    version: "1.0",
    encrypted: true,
    background: "",
    options: {
      silent: false
    },
    beginning: "",
    clues: []
  });

  const [createClueOpen, setCreateClueOpen] = useState<boolean>(false);
  const [createdClueIndex, setCreatedClueIndex] = useState<number>(0);
  const [createdClue, setCreatedClue] = useState<ClueConfig>({
    id: -1,
    url: "",
    text: "",
  });

  // TODO: TYLER MAKE SURE TO TRIM RESULTS BEFORE DOWNLOADING

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
                    <Grid item xs={6} display={"grid"}>
                      <FormControl>
                        <TextField
                          value={huntConfig.name}
                          label="Name"
                          required
                          variant="outlined"
                          onChange={(e) => {
                            setHuntConfig({ ...huntConfig, name: e.target.value });
                          }}
                        />

                        <TextField
                          value={huntConfig.description}
                          label="Description"
                          required
                          variant="outlined"
                          onChange={(e) => {
                            setHuntConfig({ ...huntConfig, description: e.target.value });
                          }}
                        />

                        <TextField
                          value={huntConfig.author}
                          label="Author"
                          required
                          variant="outlined"
                          onChange={(e) => {
                            setHuntConfig({ ...huntConfig, author: e.target.value });
                          }}
                        />

                        <TextField
                          value={huntConfig.version}
                          label="Version"
                          required
                          variant="outlined"
                          onChange={(e) => {
                            setHuntConfig({ ...huntConfig, version: e.target.value });
                          }}
                        />

                        <TextField
                          value={huntConfig.background}
                          label="Background (URL)"
                          required
                          variant="outlined"
                          type="url"
                          onChange={(e) => {
                            setHuntConfig({ ...huntConfig, background: e.target.value });
                          }}
                        />

                        <TextField
                          value={huntConfig.beginning}
                          label="Beginning"
                          required
                          variant="outlined"
                          onChange={(e) => {
                            setHuntConfig({ ...huntConfig, beginning: e.target.value });
                          }}
                        />
                        <br />
                        Silent:
                        <br />
                        <Select
                          value={huntConfig.options.silent}
                          label="Silent"
                          required
                          variant="outlined"
                          onChange={(e) => {
                            setHuntConfig({ ...huntConfig, options: { ...huntConfig.options, silent: e.target.value === 'true' } });
                          }}
                        >
                          <MenuItem value="false">False (Popping up alerts)</MenuItem>
                          <MenuItem value="true">True (Icon alerts)</MenuItem>
                        </Select>

                        <br />

                        Encrypted:
                        <br />
                        <Select
                          value={huntConfig.encrypted}
                          label="Encrypted"
                          required
                          variant="outlined"
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setHuntConfig({ ...huntConfig, encrypted: selectedValue === 'true' });
                            if (selectedValue === 'false') {
                              window.alert("The downloaded file will NOT be encrypted and the clues will be displayed as plain text.");
                            }
                          }}
                        >
                          <MenuItem value="true">True (Default)</MenuItem>
                          <MenuItem value="false">False</MenuItem>
                        </Select>

                        <br />

                        {/* TODO: RENDER THE LIST OF CLUES IN huntConfig as cards with their own summary and index and edit/delete button */}
                        {Array.from(huntConfig.clues).map(({ id, url, text, image, alt, interactive }) => (
                          // TODO: RENDER A CARD FOR THE CLUE HERE
                          <>

                          </>
                        ))}

                        <Button
                          fullWidth
                          color="secondary"
                          variant="contained"
                          onClick={() => {
                            // setCreatedClueIndex(huntConfig.clues.length);
                            // setCreatedClue({
                            //   id: huntConfig.clues.length + 1,
                            //   url: "",
                            //   text: ""
                            // });
                            setCreateClueOpen(true);
                          }}>Create New Clue</Button>

                        {/* TODO: DOWNLOAD BUTTON */}
                      </FormControl>
                    </Grid>

                    {/* Preview pane */}
                    {/*  TODO: Figure out how to set the color while also making disabled */}
                    <Grid item xs={6} display={"grid"}>
                      <TextField
                        variant="outlined"
                        InputProps={{
                          inputProps: { style: { color: "#fff" } },
                        }}
                        maxRows={30}
                        multiline
                        value={JSON.stringify(huntConfig, null, "  ")}
                        sx={{
                          fontFamily: "system-ui",
                          fontSize: "0.9rem",
                          color: "white",
                        }}
                      />
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

        {/* Create clue modal */}
        <ExitableModal
          open={createClueOpen}
          // TODO: ON SAVE, ADD THE IN PROGRESS CLUE TO THE END OF THE LIST
          onClose={() => setCreateClueOpen(false)}
          modalTitle="Create new clue"
<<<<<<< HEAD
          // TODO: TYLER OR EDIT CLUE
=======
        // TODO: TYLER OR EDIT CLUE
>>>>>>> 36e2f78 (Finish basic encode page excluding the clue part)
        >
          <FormControl>
            <TextField label="URL" variant="outlined" required value={createdClue.url} onChange={(e) => {
              setCreatedClue({ ...createdClue, url: e.target.value });
            }} />
            <TextField label="Text" variant="outlined" required value={createdClue.text} onChange={(e) => {
              setCreatedClue({ ...createdClue, text: e.target.value });
            }} />
            <TextField label="Image URL" variant="outlined" value={createdClue.image} onChange={(e) => {
              setCreatedClue({ ...createdClue, image: e.target.value });
            }} />
            <TextField label="Image Alt" variant="outlined" value={createdClue.alt} onChange={(e) => {
              setCreatedClue({ ...createdClue, alt: e.target.value });
            }} />

            <Button variant="contained" color="primary" onClick={() => {
              // Add the new clue to the list
              let newClue = {
                id: huntConfig.clues.length + 1,
                url: createdClue.url,
                text: createdClue.text,
                image: createdClue.image,
                alt: createdClue.alt
              };

              setHuntConfig({
                ...huntConfig,
                clues: [...huntConfig.clues, newClue]
              });

              // Reset the createdClue state
              setCreatedClue({
                id: -1,
                url: '',
                text: '',
                image: '',
                alt: ''
              });

              // Close the modal
              setCreateClueOpen(false);
            }}>
              Save
            </Button>

          </FormControl>
        </ExitableModal>
      </ThemeProvider>
    </>
  );
};

Render(<Encode />);
