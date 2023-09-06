import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiToggleButton from "@mui/material/ToggleButton";
import path from "path";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ExitableModal } from "src/components/ExitableModal";
import { PageHeaderAndSubtitle } from "src/components/PageHeaderAndSubtitle";
import { logger } from "src/logger";
import { resetStorage } from "src/providers/helpers";
import { getLastError, getURL } from "src/providers/runtime";
import { saveStorageValues } from "src/providers/storage";
import { createTab } from "src/providers/tabs";
import { HuntConfig, SAMPLE_DIR } from "src/types/hunt_config";
import { HuntSource, Progress } from "src/types/progress";
import { ParseConfig } from "src/utils/parse";

interface SourceFormType {
  sourceType: HuntSource;
  huntName: string;
  // Preset
  presetPath: string;
  // URL
  sourceURL?: string;
  // Upload
  fileName?: string;
  uploadedConfig?: HuntConfig;
  uploadedError?: Error;
}

// TODO: TYLER MOVE THIS LOGIC TO THEME
// TODO: TYLER HANDLE DARK VS LIGHT MODE
const ToggleButton = styled(MuiToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "white",
    backgroundColor: "#787dc8",
  },
  "&:hover": {
    color: "#eeeeee",
    backgroundColor: "#484d98",
  },
  color: "white",
  background: "#383d88",
  textTransform: "inherit",
});

const fetchFromUrl = async (url: string): Promise<any> =>
  // trunk-ignore(eslint/@typescript-eslint/no-unsafe-return)
  await fetch(url, {
    mode: "cors",
  }).then((res) => res.json());

const fetchFromPresets = async (presetPath: string): Promise<any> => {
  const url = getURL(path.join(SAMPLE_DIR, presetPath));
  // trunk-ignore(eslint/@typescript-eslint/no-unsafe-return)
  return await fetchFromUrl(url);
};

export const saveConfigAndLaunch = (
  huntConfig: HuntConfig,
  sourceType: HuntSource,
) => {
  // Save config and hunt progress to local storage
  const progress: Progress = {
    sourceType,
    huntConfig,
    maxProgress: 0,
    currentProgress: 0,
  };

  saveStorageValues(progress, () => {
    // https://stackoverflow.com/questions/63488141/promise-returned-in-function-argument-where-a-void-return-was-expected
    void (async () => {
      const error = getLastError();
      if (error) {
        logger.error("Error saving initial progress", error);
      } else {
        // Popup beginnining of hunt
        logger.info("Saved initial progress", progress); // TODO: TYLER REMOVE PROGRESS FROM LOG
        await createTab("beginning.html");
      }
    })();
  });
};

const getPresetOptions = () => {
  // TODO: TYLER POPULATE THIS WITH MORE DEFAULTS
  const presetHuntOptions = new Map<string, string>();
  const files = ["hunt.json"];
  files
    .filter((file) => file.endsWith(".json"))
    .forEach((file) => {
      const name = path.parse(file).name.replace("_", " ");
      presetHuntOptions.set(file, name);
    });
  return presetHuntOptions;
};

export const ChooseHunt = () => {
  // TODO: DETERMINE THESE PROGRAMATICALLY

  // const presetHuntOptions = ["Tutorial", "Board Games", "Star Wars"];
  const presetHuntOptions = getPresetOptions();

  // TODO: TYLER USE PRESET USEEFFECT TO GET THE CURRENT CONFIGURATION
  // Persistent state
  const [sourceFormState, setSourceFormState] = useState<SourceFormType>({
    sourceType: "Preset",
    huntName: "Tutorial",
    presetPath: Array.from(presetHuntOptions.keys())[0],
  });

  const [validationError, setValidationError] = useState<Error | undefined>(
    undefined,
  );
  const [missingInputMessage, setMissingInputMessage] = useState<
    string | undefined
  >();
  const [presetModalOpen, setPresetModalOpen] = useState<boolean>(false);

  // TODO: TYLER INITIALIZE THIS TO THE ACTUAL VALUE OF WHETHER OR NOT WE HAVE A HUNT OR NOT
  const [hasReset, setHasReset] = useState<boolean>(false);

  const validateSubmitable = () => {
    if (validationError) {
      return false;
    }

    if (sourceFormState.sourceType == "Preset") {
      if (sourceFormState.presetPath) {
        setMissingInputMessage(undefined);
        return true;
      } else {
        setMissingInputMessage("Please specify a preset hunt");
        return false;
      }
    } else if (sourceFormState.sourceType == "URL") {
      if (sourceFormState.sourceURL) {
        setMissingInputMessage(undefined);
        return true;
      } else {
        setMissingInputMessage("Please specify a URL");
        return false;
      }
    } else if (sourceFormState.sourceType == "Upload") {
      if (sourceFormState.uploadedConfig) {
        setMissingInputMessage(undefined);
        return true;
      } else {
        setMissingInputMessage("Please specify an upload file");
        return false;
      }
    } else {
      logger.warn(
        "Error: unknown condition reached. Please refresh the page.",
        sourceFormState.sourceType,
      );
    }
    return false;
  };

  const [submitable, setSubmitable] = useState<boolean>(true);

  // Upload state
  const validateAndSetUploadedConfig = (huntConfig: any, fileName: string) => {
    logger.info("Validating hunt config"); // TODO: REMOVE
    try {
      const parsedConfig = ParseConfig(huntConfig);
      setSourceFormState({
        ...sourceFormState,
        fileName,
        huntName: parsedConfig.name,
        uploadedConfig: parsedConfig,
        uploadedError: undefined,
      });
    } catch (error) {
      setSourceFormState({ ...sourceFormState, uploadedError: error as Error });
      setValidationError(error as Error);
    }
  };

  const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const { name } = file;
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      try {
        // trunk-ignore(eslint/@typescript-eslint/no-unsafe-assignment)
        const huntData = JSON.parse(event.target?.result as string);
        validateAndSetUploadedConfig(huntData, name);
      } catch (error) {
        setSourceFormState({
          ...sourceFormState,
          uploadedError: error as Error,
        });
        setValidationError(error as Error);
      }
    });
    reader.readAsText(file);
  };

  // Provide reactivity for error reporting when cycling through radio buttons
  useEffect(() => {
    if (
      sourceFormState.sourceType == "Upload" &&
      sourceFormState.uploadedError
    ) {
      setValidationError(sourceFormState.uploadedError);
    } else {
      setValidationError(undefined);
    }
  }, [sourceFormState.sourceType]);

  useEffect(() => {
    setSubmitable(validateSubmitable());
  }, [sourceFormState, validationError]);

  const onSubmit = () => {
    void (async () => {
      try {
        const { sourceType, presetPath, sourceURL, uploadedConfig } =
          sourceFormState;
        if (sourceType == "Preset") {
          // trunk-ignore(eslint/@typescript-eslint/no-unsafe-assignment)
          const presetJson = await fetchFromPresets(presetPath);
          const parsedConfig = ParseConfig(presetJson);
          saveConfigAndLaunch(parsedConfig, sourceType);
        } else if (sourceType == "URL" && sourceURL) {
          // trunk-ignore(eslint/@typescript-eslint/no-unsafe-assignment)
          const fetchedJson = await fetchFromUrl(sourceURL);
          const parsedConfig = ParseConfig(fetchedJson);
          saveConfigAndLaunch(parsedConfig, sourceType);
        } else if (sourceType == "Upload" && uploadedConfig) {
          // huntConfig will have already been parsed
          saveConfigAndLaunch(uploadedConfig, sourceType);
        } else {
          logger.warn(
            "Error: unknown condition reached. Please refresh the page.",
            sourceType,
          );
        }
      } catch (error) {
        setValidationError(error as Error);
      }
    })();
  };
  const onReset = () => {
    resetStorage(() => setHasReset(true));
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PageHeaderAndSubtitle header="Begin A Hunt" />
          </Grid>
          <Grid item xs={12} sx={{ display: "grid" }}>
            <FormControl>
              <ToggleButtonGroup
                orientation="vertical"
                value={sourceFormState.sourceType}
                color="secondary"
                exclusive
                onChange={(
                  _: React.MouseEvent<HTMLElement>,
                  nextView: string,
                ) => {
                  logger.info("Source type", nextView); // TODO: REMOVE
                  if (nextView !== null) {
                    setSourceFormState({
                      ...sourceFormState,
                      sourceType: nextView as HuntSource,
                    });
                  }
                }}
              >
                <ToggleButton value="Preset" aria-label="Preset">
                  <Grid container direction="row" spacing={1}>
                    <Grid
                      item
                      xs={3}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography>Presets</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Button
                        fullWidth
                        color="secondary"
                        variant="contained"
                        onClick={() => {
                          setSourceFormState({
                            ...sourceFormState,
                            sourceType: "Preset",
                          });
                          setPresetModalOpen(true);
                        }}
                      >
                        <>
                          {presetHuntOptions.get(sourceFormState.presetPath) ??
                            "Unknown name"}
                          <ArrowDropDownIcon />
                        </>
                      </Button>
                    </Grid>
                  </Grid>
                </ToggleButton>

                <ToggleButton value="URL" aria-label="URL">
                  <Grid container direction="row" spacing={0}>
                    <Grid
                      item
                      xs={3}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography>URL</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <TextField
                        fullWidth
                        color="secondary"
                        variant="outlined"
                        label="Specify URL"
                        size="small"
                        onChange={(e) => {
                          setSourceFormState({
                            ...sourceFormState,
                            sourceURL: e.target.value.trim(),
                          });
                        }}
                        value={sourceFormState.sourceURL ?? ""}
                        error={
                          sourceFormState.sourceType === "URL" &&
                          (sourceFormState.sourceURL ?? "") === ""
                        }
                      />
                    </Grid>
                  </Grid>
                </ToggleButton>

                <ToggleButton value="Upload" aria-label="Upload">
                  <Grid
                    container
                    direction="row"
                    spacing={1}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Grid
                      item
                      xs={3}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography>File</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Button
                        variant="contained"
                        component="label"
                        color="secondary"
                        sx={{ display: "flex" }}
                      >
                        {sourceFormState.fileName ?? "Choose File"}
                        <input
                          type="file"
                          accept=".json,jsn,.json5"
                          onChange={(e) => {
                            setSourceFormState({
                              ...sourceFormState,
                              sourceType: "Upload",
                            });
                            onUpload(e);
                          }}
                          hidden
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              direction="row"
              spacing={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 2,
              }}
            >
              <Tooltip
                title={validationError?.message ?? missingInputMessage}
                followCursor
                leaveDelay={200}
              >
                <span>
                  {!submitable && (
                    <InfoOutlinedIcon
                      htmlColor="#ff99a9"
                      id="submit-disable-tooltip"
                      sx={{
                        position: "absolute",
                        transform: "translate(-100%, 25%)",
                      }}
                    />
                  )}
                  <Button
                    variant="contained"
                    size="medium"
                    aria-disabled={!submitable}
                    aria-describedby="submit-disable-tooltip"
                    disabled={!submitable}
                    onClick={onSubmit}
                    color="primary"
                    sx={{
                      ".MuiButton-contained, :disabled": {
                        backgroundColor: "#e5a9a988",
                        color: "black",
                      },
                    }}
                  >
                    Submit
                  </Button>
                </span>
              </Tooltip>
              <Button
                variant="outlined"
                size="medium"
                onClick={onReset}
                color="primary"
                disabled={hasReset}
              >
                Remove Current Hunt
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <ExitableModal
        open={presetModalOpen}
        onClose={() => setPresetModalOpen(false)}
        modalTitle="Select Sample Hunt"
      >
        {/* TODO: TYLER ADD SUBMIT AND CANCEL BUTTONS TO MODAL */}
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="preset-hunt-group"
            value={sourceFormState.presetPath}
            onChange={(e) => {
              setSourceFormState({
                ...sourceFormState,
                presetPath: e.target.value as HuntSource,
              });
            }}
          >
            {Array.from(presetHuntOptions.entries()).map(
              ([presetPath, presetName]) => (
                <FormControlLabel
                  key={presetName}
                  value={presetPath}
                  control={<Radio />}
                  label={presetName}
                  sx={{ textTransform: "capitalize" }}
                />
              ),
            )}
          </RadioGroup>
        </FormControl>
      </ExitableModal>
    </>
  );
};
