import { ThemeProvider } from "@emotion/react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Box,
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
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CreateClueModal } from "src/components/encode/CreateClueModal";
import { DownloadHuntButton } from "src/components/encode/DownloadHuntButton";
import { PreviewHuntJson } from "src/components/encode/PreviewHuntJson";
import { UploadDraftButton } from "src/components/encode/UploadDraftButton";
import { CluePage } from "src/components/reusable/CluePage";
import { Footer } from "src/components/reusable/Footer";
import { PageHeaderAndSubtitle } from "src/components/reusable/PageHeaderAndSubtitle";
import { theme } from "src/components/reusable/theme";
import { getURL } from "src/providers/runtime";
import { ClueConfig, HuntConfig } from "src/types/hunt_config";
import { Render } from "src/utils/root";

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
  const [uploadError, setUploadError] = useState<string | undefined>(undefined);

  const [createClueOpen, setCreateClueOpen] = useState<boolean>(false);
  const [createdClueIndex, setCreatedClueIndex] = useState<number>(0);
  const [createdClue, setCreatedClue] = useState<ClueConfig>({
    id: -1,
    url: "",
    text: "",
    interactive: undefined,
  });

  const onCreatedClueClose = () => {
    setCreateClueOpen(false);
    setCreatedClue({
      id: -1,
      url: "",
      text: "",
      image: "",
      alt: "",
    });
  };
  const onCreatedClueSave = () => {
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
  };

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
                <CardContent sx={{ position: "relative" }}>
                  <Box sx={{ position: "absolute", right: "16px" }}>
                    <Tooltip title={uploadError} followCursor leaveDelay={200}>
                      <span>
                        {uploadError && (
                          <InfoOutlinedIcon
                            htmlColor="#ff99a9"
                            id="submit-disable-tooltip"
                            sx={{
                              position: "absolute",
                              transform: "translate(-100%, 25%)",
                            }}
                          />
                        )}
                        <UploadDraftButton
                          setHuntConfig={setHuntConfig}
                          setUploadError={setUploadError}
                        />
                      </span>
                    </Tooltip>
                  </Box>

                  <PageHeaderAndSubtitle
                    header={"Make Your Own Hunt"}
                    headingComponent="h1"
                  />

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
                          aria-label="Name"
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
                          data-testid="hunt-name-field"
                        />
                        <TextField
                          value={huntConfig.description}
                          label="Description"
                          aria-label="Description"
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
                          data-testid="hunt-description-field"
                        />
                        <TextField
                          value={huntConfig.author}
                          label="Author"
                          aria-label="Author"
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
                          data-testid="hunt-author-field"
                        />
                        <TextField
                          value={huntConfig.background}
                          label="Background (URL)"
                          aria-label="Background (URL)"
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
                          data-testid="hunt-background-field"
                        />
                        <TextField
                          value={huntConfig.beginning}
                          label="Beginning"
                          aria-label="Beginning"
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
                          data-testid="hunt-beginning-field"
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
                            data-testid="hunt-silent-field"
                          >
                            <MenuItem
                              value="true"
                              data-testid="hunt-silent-true"
                            >
                              True (Icon alerts)
                            </MenuItem>
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
                            data-testid="hunt-encrypted-field"
                          >
                            <MenuItem value="true">True (For Sharing)</MenuItem>
                            <MenuItem
                              value="false"
                              data-testid="hunt-encrypted-false"
                            >
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
                              <Tooltip
                                key={"tooltip" + id}
                                placement="right"
                                title={
                                  <CluePage
                                    key={"preview" + id}
                                    huntName={huntConfig.name || "Preview"}
                                    encrypted={false}
                                    clue={{
                                      id,
                                      url,
                                      text,
                                      image,
                                      alt,
                                      interactive,
                                    }}
                                    previewOnly={true}
                                    backgroundURL={
                                      huntConfig.background ||
                                      getURL("graphics/background.png")
                                    }
                                  />
                                }
                              >
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
                                          const currClues = [
                                            ...huntConfig.clues,
                                          ];
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
                                          const currClues = [
                                            ...huntConfig.clues,
                                          ];
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
                              </Tooltip>
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
                          data-testid="hunt-create-button"
                        >
                          Create New Clue
                        </Button>
                        <Tooltip
                          title={errorTooltip}
                          followCursor
                          leaveDelay={200}
                        >
                          <DownloadHuntButton
                            huntConfig={huntConfig}
                            setSubmittedEver={setSubmittedEver}
                            setErrorTooltip={setErrorTooltip}
                          />
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
                      <PreviewHuntJson huntConfig={huntConfig} />
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

        <CreateClueModal
          isOpen={createClueOpen}
          createdClue={createdClue}
          setCreatedClue={setCreatedClue}
          onSave={onCreatedClueSave}
          onClose={onCreatedClueClose}
        />
      </ThemeProvider>
    </>
  );
};

Render(<Encode />);
