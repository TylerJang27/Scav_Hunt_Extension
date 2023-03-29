import React from "react";
import { createRoot } from "react-dom/client";

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

const Options = () => {
  return (
    <>
      <head>
        <title>Scavenger Hunt Source</title>
        <link
          rel="canonical"
          href="https://getbootstrap.com/docs/4.5/examples/cover/"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
          integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
          crossOrigin="anonymous"
        />
        <link href="assets/hunt.css" rel="stylesheet" />
      </head>
      <body>
        <div className="container">
          <div className="row space">
            <div className="col-md-4">
              <h3 className="masthead-brand justify-content-center">
                Scavenger Hunt Source
              </h3>
            </div>
          </div>
          <div className="row space">
            <div className="col-md-4">
              <div className="form-check">
                <form>
                  <input
                    type="radio"
                    id="sample_choice"
                    name="source"
                    value="Sample"
                  />
                  <label htmlFor="sample">Sample</label>
                  <br />
                  <input
                    type="radio"
                    id="url_choice"
                    name="source"
                    value="URL"
                  />
                  <label htmlFor="url_label">URL</label>
                  <input type="url" id="urlsource" name="urlsource" />
                  <br />
                  <input
                    type="radio"
                    id="upload_choice"
                    name="source"
                    value="Upload"
                  />
                  <label htmlFor="myfile">Upload</label>
                  <input
                    type="file"
                    accept=".json,.zip,.html,.css"
                    id="myfile"
                    name="myfile"
                  />
                  <br />
                  <br />
                  <input type="button" id="submitit" value="Submit" />
                  <input type="button" id="resetit" value="Reset" />
                </form>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 text-center">
              <a href="encode.html" target="_blank">
                Generate Hunt
              </a>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 text-center" id="status"></div>
          </div>
        </div>
      </body>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("submitit")?.addEventListener("click", save_options);
document.getElementById("resetit")?.addEventListener("click", restore_options);
