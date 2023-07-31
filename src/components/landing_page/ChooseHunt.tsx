import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Alert,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { yellow } from "@mui/material/colors";
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
  // Sample
  samplePath: string;
  // URL
  sourceURL?: string;
  // Upload
  fileName?: string;
  uploadedConfig?: HuntConfig;
  uploadedError?: Error;
}

const fetchFromUrl = async (url: string) =>
  await fetch(url, {
    mode: "cors",
  }).then((res) => res.json());

const fetchFromSample = async (samplePath: string) => {
  const url = getURL(path.join(SAMPLE_DIR, samplePath));
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
    const error = getLastError();
    if (error) {
      logger.error("Error saving initial progress", error);
    } else {
      // Popup beginnining of hunt
      logger.info("Saved initial progress", progress); // TODO: TYLER REMOVE PROGRESS FROM LOG
      createTab("beginning.html");
    }
  });
};

const getSampleOptions = () => {
  // TODO: TYLER POPULATE THIS WITH MORE DEFAULTS
  const sampleHuntOptions = new Map<string, string>();
  const files = ["hunt.json"];
  files
    .filter((file) => file.endsWith(".json"))
    .forEach((file) => {
      const name = path.parse(file).name.replace("_", " ");
      sampleHuntOptions.set(file, name);
    });
  return sampleHuntOptions;
};

export const ChooseHunt = () => {
  // TODO: DETERMINE THESE PROGRAMATICALLY

  // const sampleHuntOptions = ["Tutorial", "Board Games", "Star Wars"];
  const sampleHuntOptions = getSampleOptions();

  // TODO: TYLER USE PRESET USEEFFECT TO GET THE CURRENT CONFIGURATION
  // Persistent state
  const [sourceFormState, setSourceFormState] = useState<SourceFormType>({
    sourceType: "Sample",
    huntName: "Tutorial",
    samplePath: Array.from(sampleHuntOptions.keys())[0],
  });

  // TODO: TYLER RENDER ERRORS
  const [validationError, setValidationError] = useState<Error | undefined>(
    undefined,
  );
  const [sampleModalOpen, setSampleModalOpen] = useState<boolean>(false);

  const [hasReset, setHasReset] = useState<boolean>(false);

  const validateSubmitable = () => {
    if (validationError) {
      return false;
    }

    if (sourceFormState.sourceType == "Sample") {
      return Boolean(sourceFormState.samplePath);
    } else if (sourceFormState.sourceType == "URL") {
      return Boolean(sourceFormState.sourceURL);
    } else if (sourceFormState.sourceType == "Upload") {
      return Boolean(sourceFormState.uploadedConfig);
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

  const onSubmit = async () => {
    try {
      const { sourceType, samplePath, sourceURL, uploadedConfig } =
        sourceFormState;
      if (sourceType == "Sample") {
        const sampledJson = await fetchFromSample(samplePath);
        const parsedConfig = ParseConfig(sampledJson);
        saveConfigAndLaunch(parsedConfig, sourceType);
      } else if (sourceType == "URL" && sourceURL) {
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
          <Grid item xs={12}>
            <FormControl>
              <RadioGroup
                name="source-type-group"
                sx={{ display: "flex" }}
                value={sourceFormState.sourceType}
                onChange={(e) => {
                  setSourceFormState({
                    ...sourceFormState,
                    sourceType: e.target.value as HuntSource,
                  });
                  logger.info("Source type", e.target.value); // TODO: REMOVE
                }}
              >
                <FormControlLabel
                  value="Sample"
                  sx={{ display: "flex" }}
                  control={<Radio />}
                  label={
                    <Grid container direction="row" spacing={1}>
                      <Grid
                        item
                        xs={4}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography>Sample</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Button
                          fullWidth
                          color="primary"
                          variant="contained"
                          onClick={() => {
                            setSourceFormState({
                              ...sourceFormState,
                              sourceType: "Sample",
                            });
                            setSampleModalOpen(true);
                          }}
                        >
                          <>
                            {sampleHuntOptions.get(
                              sourceFormState.samplePath,
                            ) ?? "Unknown name"}
                            <ArrowDropDownIcon />
                            {/* TODO: TYLER ADD DROPDOWN ICON */}
                          </>
                        </Button>
                      </Grid>
                    </Grid>
                  }
                />
                <FormControlLabel
                  value="URL"
                  control={<Radio />}
                  label={
                    <Grid container direction="row" spacing={0}>
                      <Grid
                        item
                        xs={2}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Typography>URL</Typography>
                      </Grid>
                      <Grid item xs={10}>
                        <TextField
                          fullWidth
                          color="secondary"
                          variant="outlined"
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
                  }
                />
                <FormControlLabel
                  value="Upload"
                  control={<Radio />}
                  label="Upload"
                />
                <Grid
                  container
                  direction="row"
                  spacing={1}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      size="medium"
                      component="label"
                      color="secondary"
                    >
                      Choose File
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
                  <Grid item xs={6}>
                    <Typography>
                      {sourceFormState.fileName ?? "No file chosen"}
                    </Typography>
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              direction="row"
              spacing={1}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Button
                variant="outlined"
                size="medium"
                disabled={!submitable}
                onClick={onSubmit}
                color="secondary"
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                size="medium"
                onClick={onReset}
                color="secondary"
                disabled={hasReset}
              >
                Clear Hunt
              </Button>
            </Grid>
          </Grid>
          {validationError && (
            <Alert severity="error">{validationError.message}</Alert>
          )}
        </Grid>
      </Container>
      <ExitableModal
        open={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        modalTitle="Select Sample Hunt"
      >
        {/* TODO: TYLER ADD SUBMIT AND CANCEL BUTTONS TO MODAL */}
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="sample-hunt-group"
            value={sourceFormState.samplePath}
            onChange={(e) => {
              setSourceFormState({
                ...sourceFormState,
                samplePath: e.target.value as HuntSource,
              });
            }}
          >
            {Array.from(sampleHuntOptions.entries()).map(
              ([samplePath, sampleName]) => (
                <FormControlLabel
                  key={sampleName}
                  value={samplePath}
                  control={<Radio />}
                  label={sampleName}
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
