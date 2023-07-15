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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { yellow } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import { PageHeaderAndSubtitle } from "./components/PageHeaderAndSubtitle";
import { Footer } from "./components/Footer";
import { theme } from "./components/theme";
import { Render } from "./utils/root";
import { ExitableModal } from "./components/ExitableModal";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { EncryptClue } from './utils/parse';


const generateJson = (huntConfig:HuntConfig) => {
  const encryptedHunt = {
    ...huntConfig,
    clues: huntConfig.clues.map((clue) => {
      return EncryptClue(clue, huntConfig.encrypted)
    })
  };

  const outputString = JSON.stringify(encryptedHunt, null, "  ");

  const blob_gen = new Blob([outputString], {type: 'application/json'});
  const url_gen = URL.createObjectURL(blob_gen);
  chrome.downloads.download({
      url: url_gen,
      filename: `${huntConfig.name}.json`
  });
}



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
                          error={
                            huntConfig.name.trim().length === 0
                          }
                          variant="outlined"
                          onChange={(e) => {
                            setHuntConfig({ ...huntConfig, name: e.target.value });
                          }}
                        />

                        <TextField
                          value={huntConfig.description}
                          label="Description"
                          required
                          error={
                            huntConfig.description.trim().length === 0
                          }
                          variant="outlined"
                          onChange={(e) => {
                            setHuntConfig({ ...huntConfig, description: e.target.value });
                          }}
                        />

                        <TextField
                          value={huntConfig.author}
                          label="Author"
                          required
                          error={
                            huntConfig.author.trim().length === 0
                          }
                          variant="outlined"
                          onChange={(e) => {
                            setHuntConfig({ ...huntConfig, author: e.target.value });
                          }}
                        />

                        <TextField
                          value={huntConfig.background}
                          label="Background (URL)"
                          required
                          error={
                            huntConfig.background.trim().length === 0 || !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(huntConfig.background.trim())
                          }
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
                          error={
                            huntConfig.beginning.trim().length === 0
                          }
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
                        <List>
                          {huntConfig.clues.map(({ id, url, text, image, alt }, index) => (
                            <ListItem key={id} divider>
                              {
                                huntConfig.clues.length > 1 &&
                                <>
                                  <IconButton edge="start" aria-label="move up" disabled={index === 0} onClick={() => {
                                    let currClues = [...huntConfig.clues];
                                    let temp = { ...currClues[index], id: index };
                                    currClues[index] = { ...currClues[index - 1], id: index + 1 };

                                    currClues[index - 1] = temp;

                                    setHuntConfig({
                                      ...huntConfig,
                                      clues: currClues
                                    });
                                  }}>
                                    <ArrowUpwardIcon />
                                  </IconButton>

                                  <IconButton edge="start" aria-label="move down" disabled={index === huntConfig.clues.length - 1} onClick={() => {
                                    let currClues = [...huntConfig.clues];
                                    let temp = { ...currClues[index], id: index + 2 };
                                    currClues[index] = { ...currClues[index + 1], id: index + 1 };
                                    currClues[index + 1] = temp;

                                    setHuntConfig({
                                      ...huntConfig,
                                      clues: currClues
                                    });
                                  }}>
                                    <ArrowDownwardIcon />
                                  </IconButton>
                                </>
                              }

                              <ListItemText
                                primary={`Clue ${index + 1}: ${text}`}
                                secondary={`URL: ${url}`}
                              />
                              <IconButton edge="end" aria-label="edit" onClick={() => {
                                setCreatedClueIndex(index);
                                setCreatedClue({
                                  id: id,
                                  url: url,
                                  text: text,
                                  image: image,
                                  alt: alt
                                });
                                setCreateClueOpen(true);
                              }}>
                                <EditIcon />
                              </IconButton>
                              <IconButton edge="end" aria-label="delete" onClick={() => {
                                // Remove the clue from the list
                                let currClues = [...huntConfig.clues];
                                currClues.splice(index, 1);

                                for (let i = index; i < currClues.length; i++) {
                                  currClues[i].id = i + 1;
                                }

                                setHuntConfig({
                                  ...huntConfig,
                                  clues: currClues
                                });
                              }}>
                                <DeleteIcon />
                              </IconButton>
                            </ListItem>
                          ))}
                        </List>

                        <Button
                          fullWidth
                          color="secondary"
                          variant="contained"
                          onClick={() => {
                            setCreatedClueIndex(huntConfig.clues.length);
                            setCreateClueOpen(true);
                          }}>Create New Clue</Button>
                        <Divider></Divider>
                        <Button
                          fullWidth
                          color="secondary"
                          variant="contained"
                          onClick={() => {
                            // TODO: Trim all strings, encrypt all clues if encrypted is true
                            // TODO: Test line breaks, dump to json string, download json file

                            generateJson(huntConfig);


                            // const json_gen = generateJson();
                            //         const blob_gen = new Blob([JSON.stringify(json_gen)], {type: 'application/json'});
                            //         const url_gen = URL.createObjectURL(blob_gen);
                            //         chrome.downloads.download({
                            //             url: url_gen
                            //         });

                          }}>Download</Button>
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
          onClose={() => {
            setCreateClueOpen(false);
            setCreatedClue({
              id: -1,
              url: '',
              text: '',
              image: '',
              alt: ''
            });
          }}
          modalTitle="Create new clue">
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
                id: createdClueIndex + 1,
                url: createdClue.url,
                text: createdClue.text,
                image: createdClue.image,
                alt: createdClue.alt
              };

              if (createdClueIndex >= huntConfig.clues.length) {
                setHuntConfig({
                  ...huntConfig,
                  clues: [...huntConfig.clues, newClue]
                });
              } else {
                let currClues = [...huntConfig.clues];
                currClues[createdClueIndex] = newClue;
                setHuntConfig({
                  ...huntConfig,
                  clues: currClues
                });
              }
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
