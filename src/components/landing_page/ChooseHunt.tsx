import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiToggleButton from "@mui/material/ToggleButton";
import path from "path";
import React, { ChangeEvent, useEffect, useState } from "react";
import { UserConfigModal } from "src/components/landing_page/UserConfigModal";
import { PageHeaderAndSubtitle } from "src/components/reusable/PageHeaderAndSubtitle";
import { logger } from "src/logger";
import { setPopup } from "src/providers/action";
import { resetStorage } from "src/providers/helpers";
import { getLastError, getURL } from "src/providers/runtime";
import { loadStorageValues, saveStorageValues } from "src/providers/storage";
import { createTab } from "src/providers/tabs";
import { EMPTY_OR_INVALID_HUNT } from "src/types/errors";
import { HuntConfig, SAMPLE_DIR } from "src/types/hunt_config";
import {
  HuntSource,
  Progress,
  SomeProgress,
  UserConfig,
} from "src/types/progress";
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

// TODO(Tyler): Move this logic to themes.
// TODO(Tyler): Handle light vs. dark mode.
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
  background: "#353a85",
  textTransform: "inherit",
});

const PresetSelector = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.secondary.main,
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    fontFamily: "Roboto,Helvetica,Arial,sans-serif",
    fontWeight: 500,
    fontSize: "0.875rem",
    transition: theme.transitions.create([
      "border-color",
      "box-shadow",
      "background-color",
      "color",
    ]),
    textTransform: "uppercase",
    boxShadow:
      "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
    "&:hover": {
      color: "#eeeeee",
      backgroundColor: "rgb(82, 49, 170)",
    },
  },
}));

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
  userConfig: UserConfig,
  sourceInfo: string,
) => {
  // Save config and hunt progress to local storage
  const progress: Progress = {
    sourceType,
    huntConfig,
    maxProgress: 0,
    currentProgress: 0,
    userConfig,
    sourceInfo,
  };

  saveStorageValues(progress, () => {
    if (userConfig.displayMode === "Tab") {
      // Need to unset the popup if we want to make onClick work.
      setPopup({ popup: "" }, () => {});
    } else {
      setPopup({ popup: chrome.runtime.getURL("overlay.html") }, () => {});
    }

    // https://stackoverflow.com/questions/63488141/promise-returned-in-function-argument-where-a-void-return-was-expected
    void (async () => {
      const error = getLastError();
      if (error) {
        logger.error("Error saving initial progress", error);
      } else {
        // Popup beginnining of hunt
        await createTab("beginning.html");
      }
    })();
  });
};

interface HuntPreset {
  name: string;
  filename: string;
}

const getPresetOptions = ({ name, filename }: Partial<HuntPreset>) => {
  // TODO(Tyler): Add more defaults to the hunt presets.
  const presetHuntOptions = new Array<HuntPreset>();
  presetHuntOptions.push({ name: "Tutorial", filename: "tutorial.json" });
  presetHuntOptions.push({ name: "Foods", filename: "foods.json" });
  presetHuntOptions.push({
    name: "National Parks (nonlinear)",
    filename: "national_parks.json",
  });

  if (name) {
    return presetHuntOptions.filter(
      (preset: HuntPreset) => preset.name === name,
    );
  }
  if (filename) {
    return presetHuntOptions.filter(
      (preset: HuntPreset) => preset.filename === filename,
    );
  }
  return presetHuntOptions;
};

export const ChooseHunt = () => {
  const presetHuntOptions = getPresetOptions({});

  // Persistent state
  const initialPreset = "Tutorial";
  const [sourceFormState, setSourceFormState] = useState<SourceFormType>({
    sourceType: "Preset",
    huntName: initialPreset,
    presetPath: getPresetOptions({ name: initialPreset })[0].filename,
  });
  // Persistent settings
  const [userConfigState, setUserConfigState] = useState<UserConfig>({
    displayMode: "Overlay",
  });

  const [validationError, setValidationError] = useState<Error | undefined>(
    undefined,
  );
  const [missingInputMessage, setMissingInputMessage] = useState<
    string | undefined
  >();

  const [resetable, setResetable] = useState<boolean>(true);

  useEffect(() => {
    loadStorageValues(
      ["huntConfig", "sourceInfo", "sourceType", "userConfig"],
      (items: SomeProgress) => {
        logger.debug("Loaded initial");
        logger.debug(items);
        try {
          const { sourceInfo, sourceType, huntConfig, userConfig } = items;
          if (sourceType && huntConfig) {
            const presetPath =
              sourceType === "Preset"
                ? getPresetOptions({ name: sourceInfo })[0]?.filename
                : getPresetOptions({ name: initialPreset })[0].filename;

            setSourceFormState({
              sourceType,
              huntName: huntConfig.name,
              presetPath,
              sourceURL: sourceType === "URL" ? sourceInfo : undefined,
              fileName: sourceType === "Upload" ? sourceInfo : undefined,
            });
            setResetable(true);
          } else {
            setResetable(false);
          }
          if (userConfig) {
            setUserConfigState(userConfig);
          }
        } catch (err) {
          logger.warn(EMPTY_OR_INVALID_HUNT);
          logger.warn(err);
        }
      },
    );
  }, []);

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
        "Error: unknown condition reached when validating chosen hunt. Please refresh the page.",
        sourceFormState.sourceType,
      );
    }
    return false;
  };

  const [submitable, setSubmitable] = useState<boolean>(true);

  // Upload state
  const validateAndSetUploadedConfig = (huntConfig: any, fileName: string) => {
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
    if (!e.target.files || e.target.files[0] == undefined) {
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
          const presetName = getPresetOptions({ filename: presetPath })[0].name;
          const parsedConfig = ParseConfig(presetJson);
          saveConfigAndLaunch(
            parsedConfig,
            sourceType,
            userConfigState,
            presetName,
          );
        } else if (sourceType == "URL" && sourceURL) {
          // trunk-ignore(eslint/@typescript-eslint/no-unsafe-assignment)
          const fetchedJson = await fetchFromUrl(sourceURL);
          const parsedConfig = ParseConfig(fetchedJson);
          saveConfigAndLaunch(
            parsedConfig,
            sourceType,
            userConfigState,
            sourceURL,
          );
        } else if (sourceType == "Upload" && uploadedConfig) {
          // huntConfig will have already been parsed
          saveConfigAndLaunch(
            uploadedConfig,
            sourceType,
            userConfigState,
            sourceFormState.fileName ?? "",
          );
        } else {
          logger.warn(
            "Error: unknown condition reached when submitting. Please refresh the page.",
            sourceType,
          );
        }
        setResetable(true);
      } catch (error) {
        setValidationError(error as Error);
      }
    })();
  };
  const onReset = () => {
    resetStorage(() => {
      setResetable(false);
      // Need to unset the popup to avoid error states.
      setPopup({ popup: "" }, () => {});
    });
  };

  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ position: "relative" }}>
            <Box sx={{ position: "absolute", right: "4px", top: "25px" }}>
              <IconButton
                edge="end"
                aria-label="settings"
                color="secondary"
                size="large"
                component="label"
                data-testid="settings-configure-button"
                role="button"
                onClick={() => {
                  setSettingsModalOpen(true);
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Box>
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
                  if (nextView !== null && nextView !== undefined) {
                    setSourceFormState({
                      ...sourceFormState,
                      sourceType: nextView as HuntSource,
                    });
                  }
                }}
              >
                <ToggleButton
                  value="Preset"
                  aria-label="Preset"
                  data-testid="hunt-preset-toggle"
                >
                  <Grid container direction="row" spacing={1}>
                    <Grid
                      item
                      xs={3}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Typography>Presets</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <FormControl fullWidth sx={{ pt: "0px" }}>
                        <Select
                          id="hunt-preset-select"
                          data-testid="hunt-preset-select"
                          value={
                            getPresetOptions({
                              filename: sourceFormState.presetPath,
                            })[0]?.name ?? "Unknown path"
                          }
                          input={<PresetSelector />}
                          color="secondary"
                          onChange={(e: SelectChangeEvent) => {
                            const filePath = getPresetOptions({
                              name: e.target.value,
                            })[0].filename;

                            setSourceFormState({
                              ...sourceFormState,
                              sourceType: "Preset",
                              presetPath: filePath,
                            });
                          }}
                          MenuProps={{
                            disableScrollLock: true,
                          }}
                        >
                          {presetHuntOptions.map((preset: HuntPreset) => (
                            <MenuItem key={preset.name} value={preset.name}>
                              {preset.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </ToggleButton>

                <ToggleButton
                  value="URL"
                  aria-label="URL"
                  data-testid="hunt-url-toggle"
                >
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
                        data-testid="hunt-url-textfield"
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

                <ToggleButton
                  value="Upload"
                  aria-label="Upload"
                  data-testid="hunt-upload-toggle"
                >
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
                        data-testid="hunt-upload-button"
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
                data-testid="hunt-submit-tooltip"
                title={validationError?.message ?? missingInputMessage}
                followCursor
                leaveDelay={200}
              >
                <div>
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
                      data-testid="hunt-submit-button"
                    >
                      Submit
                    </Button>
                  </span>
                </div>
              </Tooltip>
              <Button
                variant="outlined"
                size="medium"
                onClick={onReset}
                color="primary"
                disabled={!resetable}
                data-testid="hunt-reset-button"
              >
                Remove Current Hunt
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <UserConfigModal
        isOpen={settingsModalOpen}
        userConfigState={userConfigState}
        setUserConfigState={setUserConfigState}
        onClose={() => {
          setSettingsModalOpen(false);
        }}
      />
    </>
  );
};
