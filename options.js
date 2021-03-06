// Saves options to chrome.storage
function save_options() {
    var choice = -1;
    var error = 0;
    var json_source = chrome.runtime.getURL('res/hunt.json');

    let currentId;

    var sample_selected = document.getElementById('sample_choice').checked;
    var url_selected = document.getElementById('url_choice').checked;
    var file_selected = document.getElementById('upload_choice').checked;

    var url_source;
    var file_source;

    if (sample_selected) {
        choice = 0;
        document.getElementById('urlsource').value = "";
    } else if (url_selected) {
        choice = 1;
        var status = document.getElementById('status');
        status.textContent = "url noted \n " + document.getElementById('urlsource').value;
        json_source = document.getElementById('urlsource').value;
        status.textContent = "Save successful.";
    } else if (file_selected) {
        choice = 2;
        document.getElementById('urlsource').value = "";
        var file_obj = document.getElementById('myfile');
        var file = file_obj.files[0];

        retrieveUpload(file);
        json_source="upload";
    }

    if (choice >= 0 && error == 0) {
        if (json_source == "upload") {
            chrome.storage.local.set({
                sourceChoice: choice,
                sourceJson: json_source,
                sourceUpdates: false
            }, function() {
                // Update status to let user know options were saved.
                confirmSubmission();
            });
        } else {
            chrome.storage.local.set({
                sourceChoice: choice,
                sourceJson: json_source,
                sourceUpdates: true
                //TODO: SET SOURCE UPDATES TO FALSE, SET MAXID, SET CLUEOBJECT
            }, function() {
                getClues(json_source);
                popupStart();
                confirmSubmission();
            });
        }
    } else {
        var status = document.getElementById('status');
        status.textContent = 'Please select a valid option';
    }
  }

  async function retrieveUpload(file) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        var hunt_data = JSON.parse(event.target.result);
        chrome.storage.local.set({
            clueobject: hunt_data,
            sourceUpdates: false,
            maxId: getMaxId(hunt_data.clues)
        }, function() {
            popupStart();
        });
    });
    reader.readAsText(file);
  }

  async function getClues(source) {
    //const json_url = chrome.runtime.getURL('res/hunt.json');
    try {
      fetch(source, {
        mode: "cors"
      })
      .then(res => res.json())
      .then(function(response) {
        chrome.storage.local.set({
          sourceUpdates: false,
          clueobject: response,
          maxId: getMaxId(response.clues)
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  function getMaxId(clues) {
    var max_id = 0;
    for(var i = 0; i < clues.length; i++) {
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
    chrome.storage.local.get({
        sourceChoice: 0,
        sourceJson: chrome.runtime.getURL('res/hunt.json')
    }, function(items) {
        document.getElementById('urlsource').value = "";
        if (items.sourceChoice == 0) {
            document.getElementById('sample_choice').checked = true;
        } else if (items.sourceChoice == 1) {
            document.getElementById('url_choice').checked = true;
            document.getElementById('urlsource').value = items.sourceJson;
        } else if (items.sourceChoice == 2) {
            document.getElementById('upload_choice').checked = true;
        }
    });
  }
  

  function onChanged({id}) {
    if (id === undefined) {
        var status = document.getElementById('status');
        status.textContent = 'Error, please verify the URL';
        error = 1;
    }
  }

  function confirmSubmission() {
    var status = document.getElementById('status');
    var bg = chrome.extension.getBackgroundPage();
    bg.sourceSet = true;
    updatedSource = true;
    status.textContent = 'Options saved.';
    setTimeout(function() {
        status.textContent = '';
    }, 1500);
  }

  function popupStart() {
    chrome.storage.local.get({
        clueobject: {}
    }, function(items) {
        if (items.clueobject != undefined) {
            var beg = items.clueobject.beginning;
            if (beg != undefined) {
                console.log("hi");
                chrome.tabs.create({url: 'beginning.html'});
            }
        }
    });
  }

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('submitit').addEventListener('click', save_options);
document.getElementById('resetit').addEventListener('click', restore_options);
