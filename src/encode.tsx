import { ThemeProvider } from "@emotion/react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
// trunk-ignore(eslint/import/extensions)
import { ExitableModal } from "src/components/ExitableModal";
// trunk-ignore(eslint/import/extensions)
import { Footer } from "src/components/Footer";
// trunk-ignore(eslint/import/extensions)
import { PageHeaderAndSubtitle } from "src/components/PageHeaderAndSubtitle";
import { theme } from "src/components/theme";
import { download } from "src/providers/downloads";
import { ClueConfig, HuntConfig } from "src/types/hunt_config";
import { EncryptClue } from "src/utils/parse";
// trunk-ignore(eslint/import/extensions)
import { Render } from "src/utils/root";

// TODO: TYLER ADD THE ABILITY TO UPLOAD A DRAFT NON-ENCRYPTED

const generateJson = (huntConfig: HuntConfig) => {
  const encryptedHunt = {
    ...huntConfig,
    clues: huntConfig.clues.map((clue) =>
      EncryptClue(clue, huntConfig.encrypted, huntConfig.name),
    ),
  };

  const outputString = JSON.stringify(encryptedHunt, null, "  ");

  const blob_gen = new Blob([outputString], { type: "application/json" });
  const url_gen = URL.createObjectURL(blob_gen);

  download({
    url: url_gen,
    filename: `${huntConfig.name}.json`,
  });
};

const Encode = () => {
  const [submittedEver, setSubmittedEver] = useState<boolean>(false);
  const [huntConfig, setHuntConfig] = useState<HuntConfig>({
    name: "",
    description: "",
    author: "",
    version: "1.0",
    encrypted: true,
    background: "",
    options: {
      silent: false,
    },
    beginning: "",
    clues: [],
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
                    sx={{ pt: 2 }}
                  >
                    {/* Input pane */}
                    <Grid
                      item
                      xs={6}
                      display={"grid"}
                      sx={{ alignSelf: "flex-start" }}
                    >
                      <FormControl>
                        <TextField
                          value={huntConfig.name}
                          label="Name"
                          required
                          error={
                            submittedEver && huntConfig.name.trim().length === 0
                          }
                          variant="outlined"
                          onChange={(e) => {
                            setHuntConfig({
                              ...huntConfig,
                              name: e.target.value,
                            });
                          }}
                          sx={{ pt: 1 }}
                        />
                        <TextField
                          value={huntConfig.description}
                          label="Description"
                          required
                          error={
                            submittedEver &&
                            huntConfig.description.trim().length === 0
                          }
                          variant="outlined"
                          onChange={(e) => {
                            setHuntConfig({
                              ...huntConfig,
                              description: e.target.value,
                            });
                          }}
                          sx={{ pt: 1 }}
                        />
                        <TextField
                          value={huntConfig.author}
                          label="Author"
                          required
                          error={
                            submittedEver &&
                            huntConfig.author.trim().length === 0
                          }
                          variant="outlined"
                          onChange={(e) => {
                            setHuntConfig({
                              ...huntConfig,
                              author: e.target.value,
                            });
                          }}
                          sx={{ pt: 1 }}
                        />
                        <TextField
                          value={huntConfig.background}
                          label="Background (URL)"
                          required
                          error={
                            submittedEver &&
                            (huntConfig.background.trim().length === 0 ||
                              !/^https?:\/\/[\w-]+(\.[\w-]+)+[/#?]?.*$/.test(
                                huntConfig.background.trim(),
                              ))
                          }
                          variant="outlined"
                          type="url"
                          onChange={(e) => {
                            setHuntConfig({
                              ...huntConfig,
                              background: e.target.value,
                            });
                          }}
                          sx={{ pt: 1 }}
                        />
                        <TextField
                          value={huntConfig.beginning}
                          label="Beginning"
                          required
                          error={
                            submittedEver &&
                            huntConfig.beginning.trim().length === 0
                          }
                          variant="outlined"
                          onChange={(e) => {
                            setHuntConfig({
                              ...huntConfig,
                              beginning: e.target.value,
                            });
                          }}
                          sx={{ pt: 1, pb: 4 }}
                        />
                        <FormControl sx={{ pb: 2 }}>
                          <InputLabel id="silent-select-label">
                            Silent
                          </InputLabel>
                          <Select
                            value={huntConfig.options.silent}
                            label="Silent"
                            labelId="silent-select-label"
                            required
                            variant="outlined"
                            onChange={(e) => {
                              setHuntConfig({
                                ...huntConfig,
                                options: {
                                  ...huntConfig.options,
                                  silent: e.target.value === "true",
                                },
                              });
                            }}
                          >
                            <MenuItem value="false">
                              False (Popping up alerts)
                            </MenuItem>
                            <MenuItem value="true">True (Icon alerts)</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl>
                          <InputLabel id="encrypted-select-label">
                            Encrypted
                          </InputLabel>
                          <Select
                            value={huntConfig.encrypted}
                            label="Encrypted"
                            labelId="encrypted-select-label"
                            required
                            variant="outlined"
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              setHuntConfig({
                                ...huntConfig,
                                encrypted: selectedValue === "true",
                              });
                              if (selectedValue === "false") {
                                window.alert(
                                  "The downloaded file will NOT be encrypted and the clues will be displayed as plain text.",
                                );
                              }
                            }}
                          >
                            <MenuItem value="true">True (For Sharing)</MenuItem>
                            <MenuItem value="false">
                              False (For Drafts)
                            </MenuItem>
                          </Select>
                        </FormControl>

                        <List>
                          {huntConfig.clues.map(
                            ({ id, url, text, image, alt }, index) => (
                              <ListItem
                                key={id}
                                className="clue-list-item"
                                divider
                              >
                                {huntConfig.clues.length > 1 && (
                                  <>
                                    <IconButton
                                      edge="start"
                                      aria-label="move up"
                                      disabled={index === 0}
                                      onClick={() => {
                                        const currClues = [...huntConfig.clues];
                                        const temp = {
                                          ...currClues[index],
                                          id: index,
                                        };
                                        currClues[index] = {
                                          ...currClues[index - 1],
                                          id: index + 1,
                                        };

                                        currClues[index - 1] = temp;

                                        setHuntConfig({
                                          ...huntConfig,
                                          clues: currClues,
                                        });
                                      }}
                                    >
                                      <ArrowUpwardIcon />
                                    </IconButton>

                                    <IconButton
                                      edge="start"
                                      aria-label="move down"
                                      disabled={
                                        index === huntConfig.clues.length - 1
                                      }
                                      onClick={() => {
                                        const currClues = [...huntConfig.clues];
                                        const temp = {
                                          ...currClues[index],
                                          id: index + 2,
                                        };
                                        currClues[index] = {
                                          ...currClues[index + 1],
                                          id: index + 1,
                                        };
                                        currClues[index + 1] = temp;

                                        setHuntConfig({
                                          ...huntConfig,
                                          clues: currClues,
                                        });
                                      }}
                                    >
                                      <ArrowDownwardIcon />
                                    </IconButton>
                                  </>
                                )}

                                <ListItemText
                                  primary={`Clue ${index + 1}: ${text}`}
                                  secondary={`URL: ${url}`}
                                />
                                <IconButton
                                  edge="end"
                                  aria-label="edit"
                                  onClick={() => {
                                    setCreatedClueIndex(index);
                                    setCreatedClue({
                                      id: id,
                                      url: url,
                                      text: text,
                                      image: image,
                                      alt: alt,
                                    });
                                    setCreateClueOpen(true);
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => {
                                    // Remove the clue from the list
                                    const currClues = [...huntConfig.clues];
                                    currClues.splice(index, 1);

                                    for (
                                      let i = index;
                                      i < currClues.length;
                                      i++
                                    ) {
                                      currClues[i].id = i + 1;
                                    }

                                    setHuntConfig({
                                      ...huntConfig,
                                      clues: currClues,
                                    });
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </ListItem>
                            ),
                          )}
                        </List>
                        <Button
                          fullWidth
                          color="secondary"
                          variant="contained"
                          onClick={() => {
                            setCreatedClueIndex(huntConfig.clues.length);
                            setCreateClueOpen(true);
                          }}
                        >
                          Create New Clue
                        </Button>
                        <Button
                          fullWidth
                          color="primary"
                          variant="contained"
                          onClick={() => {
                            // TODO: TYLER Test line breaks, dump to json string, download json file
                            // TODO: TYLER WE NEED TO VALIDATE AND RENDER ERROR INFORMATION

                            setSubmittedEver(true);

                            generateJson(huntConfig);
                          }}
                          sx={{ mt: 1 }}
                        >
                          Download
                        </Button>
                      </FormControl>
                    </Grid>

                    {/* Preview pane */}
                    <Grid
                      item
                      xs={6}
                      display={"grid"}
                      sx={{ alignSelf: "flex-start" }}
                    >
                      <TextField
                        variant="outlined"
                        InputProps={{
                          inputProps: { style: { color: "#fff" } },
                        }}
                        minRows={23}
                        maxRows={23}
                        multiline
                        value={JSON.stringify(huntConfig, null, "  ")}
                        sx={{
                          fontFamily: "system-ui",
                          fontSize: "0.9rem",
                          color: "white",
                          pt: 1,
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
          onClose={() => {
            setCreateClueOpen(false);
            setCreatedClue({
              id: -1,
              url: "",
              text: "",
              image: "",
              alt: "",
            });
          }}
          modalTitle="Create new clue"
        >
          <FormControl>
            <TextField
              label="URL"
              variant="outlined"
              required
              value={createdClue.url}
              onChange={(e) => {
                setCreatedClue({ ...createdClue, url: e.target.value });
              }}
            />
            <TextField
              label="Text"
              variant="outlined"
              required
              value={createdClue.text}
              onChange={(e) => {
                setCreatedClue({ ...createdClue, text: e.target.value });
              }}
            />
            <TextField
              label="Image URL"
              variant="outlined"
              value={createdClue.image}
              onChange={(e) => {
                setCreatedClue({ ...createdClue, image: e.target.value });
              }}
            />
            <TextField
              label="Image Alt"
              variant="outlined"
              value={createdClue.alt}
              onChange={(e) => {
                setCreatedClue({ ...createdClue, alt: e.target.value });
              }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // TODO: TYLER WE NEED TO VALIDATE THE NEW CLUE FIRST

                // Add the new clue to the list
                const newClue = {
                  id: createdClueIndex + 1,
                  url: createdClue.url,
                  text: createdClue.text,
                  image: createdClue.image,
                  alt: createdClue.alt,
                };

                if (createdClueIndex >= huntConfig.clues.length) {
                  setHuntConfig({
                    ...huntConfig,
                    clues: [...huntConfig.clues, newClue],
                  });
                } else {
                  const currClues = [...huntConfig.clues];
                  currClues[createdClueIndex] = newClue;
                  setHuntConfig({
                    ...huntConfig,
                    clues: currClues,
                  });
                }
                // Reset the createdClue state
                setCreatedClue({
                  id: -1,
                  url: "",
                  text: "",
                  image: "",
                  alt: "",
                });

                // Close the modal
                setCreateClueOpen(false);
              }}
            >
              Save
            </Button>
          </FormControl>
        </ExitableModal>
      </ThemeProvider>
    </>
  );
};

Render(<Encode />);
