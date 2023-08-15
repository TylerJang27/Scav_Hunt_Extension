import { ThemeProvider } from "@emotion/react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ExitableModal } from "src/components/ExitableModal";
import { Footer } from "src/components/Footer";
import { PageHeaderAndSubtitle } from "src/components/PageHeaderAndSubtitle";
import { theme } from "src/components/theme";
import { download } from "src/providers/downloads";
import {
  ClueConfig,
  HuntConfig,
  IntractiveConfig,
} from "src/types/hunt_config";
import { EncryptClue, ParseClue, ParseConfig } from "src/utils/parse";
import { Render } from "src/utils/root";

// TODO: TYLER ADD THE ABILITY TO UPLOAD A DRAFT NON-ENCRYPTED

const generateJson = (
  huntConfig: HuntConfig,
  setErrorTooltip: (message: string) => void,
) => {
  const encryptedHunt = {
    ...huntConfig,
    clues: huntConfig.clues.map((clue) =>
      EncryptClue(clue, huntConfig.encrypted, huntConfig.name),
    ),
  };

  try {
    ParseConfig(encryptedHunt);

    const outputString = JSON.stringify(encryptedHunt, null, "  ");

    const blob_gen = new Blob([outputString], { type: "application/json" });
    const url_gen = URL.createObjectURL(blob_gen);

    download({
      url: url_gen,
      filename: `${huntConfig.name}.json`,
    });
  } catch (err: any) {
    // trunk-ignore(eslint)
    setErrorTooltip(err.message);
  }
};

const Encode = () => {
  const [submittedEver, setSubmittedEver] = useState<boolean>(false);
  const [errorTooltip, setErrorTooltip] = useState<string | undefined>(
    undefined,
  );
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
    interactive: undefined,
  });
  const [createdClueError, setCreatedClueError] = useState<
    string | undefined
  >();

  // Whenever any input is changed, reset the error tooltip.
  useEffect(() => {
    setErrorTooltip(undefined);
  }, [huntConfig]);

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
                    sx={{ mt: 2 }}
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
                          sx={{ mt: 1 }}
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
                          sx={{ mt: 1 }}
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
                          sx={{ mt: 1 }}
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
                          sx={{ mt: 1 }}
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
                          sx={{ mt: 1, mb: 4 }}
                        />
                        <FormControl sx={{ mb: 2 }}>
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
                            <MenuItem value="true">True (Icon alerts)</MenuItem>
                            <MenuItem value="false">
                              False (Popping up alerts)
                            </MenuItem>
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
                            (
                              { id, url, text, image, alt, interactive },
                              index,
                            ) => (
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
                                      id,
                                      url,
                                      text,
                                      image,
                                      alt,
                                      interactive,
                                    });
                                    setCreateClueOpen(true);
                                    setCreatedClueError(undefined);
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
                        <Tooltip
                          title={errorTooltip}
                          followCursor
                          leaveDelay={200}
                        >
                          <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            onClick={() => {
                              // TODO: TYLER Test line breaks, dump to json string, download json file

                              setSubmittedEver(true);

                              generateJson(huntConfig, setErrorTooltip);
                            }}
                            sx={{ mt: 1 }}
                          >
                            Download
                          </Button>
                        </Tooltip>
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
                          mt: 1,
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
            setCreatedClueError(undefined);
          }}
          modalTitle="Create New Clue"
        >
          <FormControl sx={{ display: "flex" }}>
            <FormControl>
              <TextField
                label="URL"
                variant="outlined"
                required
                error={
                  Boolean(createdClueError) &&
                  createdClue.url.trim().length === 0
                }
                value={createdClue.url}
                onChange={(e) => {
                  setCreatedClue({ ...createdClue, url: e.target.value });
                }}
                sx={{ mt: 1 }}
                aria-describedby="url-helper-text"
              />
              <FormHelperText id="url-helper-text">
                Regex or substring match
              </FormHelperText>
            </FormControl>
            <FormControl>
              <TextField
                label="Text"
                variant="outlined"
                required
                error={
                  Boolean(createdClueError) &&
                  (createdClue.text ?? "").trim().length === 0
                }
                value={createdClue.text}
                onChange={(e) => {
                  setCreatedClue({ ...createdClue, text: e.target.value });
                }}
                sx={{ mt: 1 }}
                aria-describedby="text-helper-text"
              />
              <FormHelperText id="text-helper-text">
                Clue to display when this URL is visited
              </FormHelperText>
            </FormControl>
            <FormControl>
              <TextField
                label="Image URL"
                variant="outlined"
                value={createdClue.image}
                onChange={(e) => {
                  setCreatedClue({ ...createdClue, image: e.target.value });
                }}
                sx={{ mt: 1 }}
                aria-describedby="image-url-helper-text"
              />
              <FormHelperText id="image-url-helper-text">
                Optional image to display when this URL is visited
              </FormHelperText>
            </FormControl>
            <FormControl>
              <TextField
                label="Image Alt"
                variant="outlined"
                value={createdClue.alt}
                onChange={(e) => {
                  setCreatedClue({ ...createdClue, alt: e.target.value });
                }}
                sx={{ mt: 1 }}
                aria-describedby="image-alt-helper-text"
              />
              <FormHelperText id="image-alt-helper-text">
                Alt text for the above image
              </FormHelperText>
            </FormControl>
            <FormControl>
              <TextField
                label="Interactive Prompt"
                variant="outlined"
                value={createdClue.interactive?.prompt}
                onChange={(e) => {
                  setCreatedClue({
                    ...createdClue,
                    interactive: {
                      ...createdClue.interactive,
                      prompt: e.target.value,
                    } as IntractiveConfig,
                  });
                }}
                sx={{ mt: 1 }}
                aria-describedby="prompt-helper-text"
              />
              <FormHelperText id="prompt-helper-text">
                An optional question the user must answer before viewing the
                clue text
              </FormHelperText>
            </FormControl>
            <FormControl>
              <TextField
                label="Interactive Key"
                variant="outlined"
                value={createdClue.interactive?.key}
                onChange={(e) => {
                  setCreatedClue({
                    ...createdClue,
                    interactive: {
                      ...createdClue.interactive,
                      key: e.target.value,
                    },
                  });
                }}
                required={Boolean(createdClue.interactive?.prompt) ?? false}
                error={
                  Boolean(createdClueError) &&
                  Boolean(createdClue.interactive?.prompt) &&
                  (createdClue.interactive?.prompt ?? "").trim().length === 0
                }
                sx={{ mt: 1 }}
                aria-describedby="key-helper-text"
              />
              <FormHelperText id="key-helper-text">
                Case-sensitive answer to the prompt
              </FormHelperText>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => {
                // Add the new clue to the list
                const newClue: ClueConfig = {
                  id: createdClueIndex + 1,
                  url: createdClue.url,
                  text: createdClue.text,
                  image: createdClue.image,
                  alt: createdClue.alt,
                };
                if (createdClue.interactive) {
                  newClue.interactive = createdClue.interactive;
                }

                try {
                  ParseClue(createdClue);

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
                    interactive: undefined,
                  });

                  // Close the modal
                  setCreateClueOpen(false);
                  setCreatedClueError(undefined);
                } catch (err: any) {
                  // trunk-ignore(eslint)
                  setCreatedClueError(err.message);
                }
              }}
            >
              Save
            </Button>
            {createdClueError && (
              <Alert severity="error">{createdClueError}</Alert>
            )}
          </FormControl>
        </ExitableModal>
      </ThemeProvider>
    </>
  );
};

Render(<Encode />);
