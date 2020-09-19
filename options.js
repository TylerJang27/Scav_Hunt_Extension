//import saveAs from 'file-saver';

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
        // chrome.downloads.download({
        //     url: document.getElementById('urlsource').value,
        //     filename: "url_hunt.json",
        //     conflictAction: "overwrite"
        // }, id => {
        //     currentId = id;
        // });
        json_source = document.getElementById('urlsource').value;
        status.textContent = "Save successful.";
    } else if (file_selected) {
        choice = 2;
        document.getElementById('urlsource').value = "";
        //TODO: FIX
        //const reader = new FileReader();
        
        var status = document.getElementById('status');
        //status.textContent = "hello " + document.getElementById('myfile').value;

        // var FileSaver = require('file-saver');
        // var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
        // FileSaver.saveAs(blob, "hello world.txt");

        status.textContent = "Many apologies, but the file upload feature is not yet working, please select a different option.";
    }

    if (choice >= 0 && error == 0) {
        chrome.storage.sync.set({
            sourceChoice: choice,
            sourceJson: json_source,
            sourceUpdates: true
        }, function() {
            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            var bg = chrome.extension.getBackgroundPage();
            bg.sourceSet = true;
            updatedSource = true;
            status.textContent = 'Options saved.';
            setTimeout(function() {
                status.textContent = '';
            }, 1500);
        });
    } else {
        var status = document.getElementById('status');
        status.textContent = 'Please select a valid option';
    }
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
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
            document.getElementById('myfile').value = items.sourceJson;
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

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('submitit').addEventListener('click', save_options);
document.getElementById('resetit').addEventListener('click', restore_options);
