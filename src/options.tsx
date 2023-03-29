import { ThemeProvider } from "@emotion/react";
import { Button, Container, createTheme, FormControl, FormControlLabel, FormLabel, Grid, Link, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import React, { ChangeEvent, useState } from "react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ExitableModal } from "./components/ExitableModal";
import { PageHeaderAndSubtitle } from "./components/PageHeaderAndSubtitle";
import { HuntSource } from "./types/progress";

// TODO: TYLER NEED TO REWRITE THIS WHOLE PAGE WITH REACT/MUI

// Saves options to chrome.storage
function save_options() {
  console.log("SAVING OPTIONS");
  var choice = -1;
  var error = 0;
  var json_source = chrome.runtime.getURL("res/hunt.json");

  //   let currentId;

  var sample_selected = (document.getElementById("sample_choice") as any)
    .checked;
  var url_selected = (document.getElementById("url_choice") as any).checked;
  var file_selected = (document.getElementById("upload_choice") as any).checked;

  //   var url_source;
  //   var file_source;

  if (sample_selected) {
    choice = 0;
    (document.getElementById("urlsource") as any).value = "";
  } else if (url_selected) {
    choice = 1;
    var status = document.getElementById("status");
    status!.textContent =
      "url noted \n " + (document.getElementById("urlsource") as any).value;
    json_source = (document.getElementById("urlsource") as any).value;
    status!.textContent = "Save successful.";
  } else if (file_selected) {
    choice = 2;
    (document.getElementById("urlsource") as any).value = "";
    var file_obj = document.getElementById("myfile") as any;
    var file = file_obj.files[0];

    retrieveUpload(file);
    json_source = "upload";
  }

  if (choice >= 0 && error == 0) {
    if (json_source == "upload") {
      chrome.storage.local.set(
        {
          sourceChoice: choice,
          sourceJson: json_source,
          sourceUpdates: false,
        },
        function () {
          // Update status to let user know options were saved.
          console.log("SAVING OPTIONS");
          confirmSubmission();
        }
      );
    } else {
      chrome.storage.local.set(
        {
          sourceChoice: choice,
          sourceJson: json_source,
          sourceUpdates: true,
          //TODO: SET SOURCE UPDATES TO FALSE, SET MAXID, SET CLUEOBJECT
        },
        function () {
          getClues(json_source);
          popupStart();
          confirmSubmission();
        }
      );
    }
  } else {
    var status = document.getElementById("status");
    status!.textContent = "Please select a valid option";
  }
}

async function retrieveUpload(file: any) {
  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    var hunt_data = JSON.parse(event.target?.result as string);
    chrome.storage.local.set(
      {
        clueobject: hunt_data,
        sourceUpdates: false,
        maxId: getMaxId(hunt_data.clues),
      },
      function () {
        popupStart();
      }
    );
  });
  reader.readAsText(file);
}

async function getClues(source: string) {
  //const json_url = chrome.runtime.getURL('res/hunt.json');
  try {
    fetch(source, {
      mode: "cors",
    })
      .then((res) => res.json())
      .then(function (response) {
        chrome.storage.local.set({
          sourceUpdates: false,
          clueobject: response,
          maxId: getMaxId(response.clues),
        });
      });
  } catch (error) {
    console.error(error);
  }
}

function getMaxId(clues: any[]) {
  var max_id = 0;
  for (var i = 0; i < clues.length; i++) {
    if (clues[i].id > max_id) {
      max_id = clues[i].id;
    }
  }
  return max_id;
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.local.get(
    {
      sourceChoice: 0,
      sourceJson: chrome.runtime.getURL("res/hunt.json"),
    },
    function (items) {
      (document.getElementById("urlsource") as any).value = "";
      if (items.sourceChoice == 0) {
        (document.getElementById("sample_choice") as any).checked = true;
      } else if (items.sourceChoice == 1) {
        (document.getElementById("url_choice") as any).checked = true;
        (document.getElementById("urlsource") as any).value = items.sourceJson;
      } else if (items.sourceChoice == 2) {
        (document.getElementById("upload_choice") as any).checked = true;
      }
    }
  );
}

function onChanged({ id }: any) {
  if (id === undefined) {
    var status = document.getElementById("status") as any;
    status.textContent = "Error, please verify the URL";
    // error = 1;
  }
}

function confirmSubmission() {
  console.log("SAVING OPTIONS");
  var status = document.getElementById("status") as any;
  var bg = chrome.extension.getBackgroundPage() as any;
  bg.sourceSet = true;
  // updatedSource = true;
  status.textContent = "Options saved.";
  setTimeout(function () {
    status.textContent = "";
  }, 1500);
}

function popupStart() {
  chrome.storage.local.get(
    {
      clueobject: {},
    },
    function (items) {
      if (items.clueobject != undefined) {
        var beg = items.clueobject.beginning;
        if (beg != undefined) {
          console.log("hi");
          chrome.tabs.create({ url: "beginning.html" });
        }
      }
    }
  );
}

interface SourceFormType {
  sourceType: HuntSource;
  sampleName: string;
  sourceURL?: string;
  fileName?: string;
}

const Options = () => {

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

  // TODO: DETERMINE THESE PROGRAMATICALLY
  const sampleHuntOptions = ["Tutorial", "Board Games", "Star Wars"];

  // TODO: TYLER USE PRESET USEEFFECT TO GET THE CURRENT CONFIGURATION
  const [sourceFormState, setSourceFormState] = useState<SourceFormType>({
    sourceType: "Sample",
    sampleName: "Tutorial"
  });

  const validateAndSetHuntConfig = (huntConfig: any) => {
    console.log("Validating hunt config");
    // TODO: TYLER PARSE CONFIG, RENDER ERRORS, SAVE TO STATE
  }

  const [sampleModalOpen, setSampleModalOpen] =
    useState<boolean>(false);

  // TODO: TYLER ADD UPLOAD POPUP
  const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    const file = e.target.files[0];
    const { name } = file;
    setSourceFormState({...sourceFormState, fileName: name});

    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      var huntData = JSON.parse(event.target?.result as string);
      validateAndSetHuntConfig(huntData)
    });
    reader.readAsText(file);
  };

  const validateSubmit = () => {
    if(sourceFormState.sourceType == "Sample") {
      return Boolean(sourceFormState.sampleName);
    } else if (sourceFormState.sourceType == "URL") {
      // TODO: TYLER IMPLEMENT VALIDATION CRITERIA
    } else if (sourceFormState.sourceType == "Upload") {
      // TODO: TYLER IMPLEMENT VALIDATION CRITERIA
    }
    return false;
  };

  const [submitable, setSubmitable] =
    useState<boolean>(true);
  useEffect(() => {
    setSubmitable(validateSubmit());
  }, [sourceFormState]);

  const onSubmit = () => {};
  const onReset = () => {};

  return (
    <>
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {/* TODO: TYLER ADD ICON HERE */}
            <PageHeaderAndSubtitle header="Choose Your Hunt" />
          </Grid>
          <Grid item xs={12}>
          <FormControl>
            <RadioGroup
              name="source-type-group"
              sx={{ display: "flex" }}
              value={sourceFormState.sourceType}
              onChange={(e) => {setSourceFormState({...sourceFormState, sourceType: e.target.value as HuntSource}); console.log("Source type", e.target.value)}}
            >
              <FormControlLabel value="Sample" sx={{ display: "flex" }} control={
              <Radio />
            } label={
              <Grid container direction="row" spacing={1}>
                <Grid item xs={4} sx={{ display: "flex", alignItems: "center"}}>
                  <Typography>
                  Sample
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Button
                    fullWidth
                    color="secondary"
                    variant="contained"
                    onClick={() => {setSourceFormState({...sourceFormState, sourceType: "Sample"});
                    setSampleModalOpen(true);
                  }}
                  >{sourceFormState.sampleName}</Button>
                </Grid>
              </Grid>
              } />
              <FormControlLabel value="URL" control={
              <Radio />
            } label={
              <Grid container direction="row" spacing={0}>
                <Grid item xs={2} sx={{ display: "flex", alignItems: "center"}}>
                  <Typography>
                  URL
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <TextField
                    fullWidth
                    color="secondary"
                    variant="outlined"
                    onChange={(e) => {setSourceFormState({...sourceFormState, sourceURL: e.target.value.trim()});}}
                    value={sourceFormState.sourceURL ?? ""}
                    error={sourceFormState.sourceType === "URL" && (sourceFormState.sourceURL ?? "") === ""}
                  />
                </Grid>
              </Grid>
              } />
              <FormControlLabel value="Upload" control={<Radio />
            } label="Upload" />
            <Grid container direction="row" spacing={1} sx={{ display: "flex", alignItems: "center"}}>
                <Grid item xs={6}>
                <Button
                  variant="contained"
                  size="medium"
                  component="label"
                >Choose File
                  <input
                    type="file"
                    accept=".json,jsn,.json5"
                    onChange={(e)=>{setSourceFormState({...sourceFormState, sourceType: "Upload"}); onUpload(e);}}
                    hidden
                  />
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{sourceFormState.fileName ?? "No file chosen"}</Typography>
                </Grid>
              </Grid>
            </RadioGroup>
          </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row" spacing={1} sx={{ display: "flex", alignItems: "center"}}>
              <Button
                variant="outlined"
                size="medium"
                disabled={submitable}
                onClick={onSubmit}
              >Submit</Button>
              <Button
                variant="outlined"
                size="medium"
                onClick={onReset}
              >Reset</Button>
            </Grid>
          </Grid>
          <Grid item xs={4} justifyContent='center'>
              <Typography><Link href="encode.html" target="_blank">Generate Hunt</Link></Typography>
          </Grid>
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
            value={sourceFormState.sampleName}
            onChange={(e) => {setSourceFormState({...sourceFormState, sampleName: e.target.value as HuntSource});}}
          >
            {
              sampleHuntOptions.map((huntName) => <FormControlLabel value={huntName} control={<Radio/>} label={huntName}/>)
            }
          </RadioGroup>
        </FormControl>
        </ExitableModal>
      </ThemeProvider>
    </>
  )
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);