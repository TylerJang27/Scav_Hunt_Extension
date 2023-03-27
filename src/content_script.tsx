// TODO: TYLER DOES THIS NEED TO BE A TSX OR TS?
function checkForUpdates() {
  chrome.storage.local.get(
    {
      sourceUpdates: false,
    },
    function (items) {
      if (items.sourceUpdates) {
        chrome.storage.local.get(
          {
            sourceJson: chrome.runtime.getURL("res/hunt.json"),
          },
          function (items) {
            //should only be necessary if error or race condition
            getClues(items.sourceJson);
          }
        );
      } else {
        handleJson();
      }
    }
  );
}

async function getClues(source: string) {
  //const json_url = chrome.runtime.getURL('res/hunt.json');
  try {
    fetch(source, {
      mode: "cors",
    })
      .then((res) => res.json())
      .then(function (response) {
        chrome.storage.local.set(
          {
            sourceUpdates: false,
            clueobject: response,
            maxId: getMaxId(response.clues),
          },
          function () {
            handleJson();
          }
        );
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

function handleJson() {
  var match_data: any = {};
  var hunt_data: any = {};
  try {
    chrome.storage.local.get(
      {
        clueobject: "",
      },
      function (items) {
        hunt_data = items.clueobject;
        var clues = hunt_data.clues;
        var en = hunt_data.encrypted;
        if (en == undefined) {
          en = false;
        }

        if (clues == undefined || hunt_data == "") {
          match_data["error"] =
            "Please set or reset the Scavenger Hunt source in Options.";
        } else {
          for (var i = 0; i < clues.length; i++) {
            var obj = clues[i];
            //error handling for bad clue definitions
            if (obj.id == undefined) {
              match_data["error"] =
                "Missing ID, please contact the Scavenger Hunt manager";
              break;
            }
            if (obj.text == undefined && obj.html == undefined) {
              match_data["error"] =
                "Missing text or HTML, please contact the Scavenger Hunt manager";
              break;
            }
            if (obj.url == undefined) {
              match_data["error"] =
                "Missing URL, please contact the Scavenger Hunt manager";
              break;
            }
            if (obj.interact == "submit" && obj.key == undefined) {
              match_data["error"] =
                "Missing submit key, please contact the Scavenger Hunt manager";
              break;
            }

            //check if url matches a clue
            let reg = new RegExp(decryptSoft(obj.url, en, hunt_data.version));
            var matches = window.location.href.match(reg);
            var included = window.location.href.includes(
              decryptSoft(obj.url, en, hunt_data.version)
            );
            if (matches == null && !included) {
              //skip to next clue
              continue;
            } else {
              //populate match with clue info
              match_data = populate_match_data(obj, hunt_data.version);
              if (
                (items.clueobject.silent == undefined ||
                  !items.clueobject.silent) &&
                (obj.found == undefined || !obj.found)
              ) {
                alert(
                  "You found a clue! Click on the Scavenger Hunt icon to view the message."
                );
                hunt_data.clues[i]["found"] = true;
                chrome.storage.local.set({
                  clueobject: hunt_data,
                });
              }
              break;
            }
          }
        }

        //can do highlighting here too, may have to do some request stuff correctly for popups, etc. (but that's stage 2)
        match_data["encrypted"] = en;
        chrome.runtime.sendMessage(match_data);
      }
    );
  } catch (error) {
    console.error(
      "Unknown json error, please contact the Scavenger Hunt manager. Source data: " +
        hunt_data
    );
  }
}

//populates match_data and specifies default values
function populate_match_data(this_clue: any, version: string) {
  var match_data: any = {};
  match_data["url"] = this_clue.url;
  match_data["id"] = this_clue.id;
  if (this_clue.text != undefined) {
    match_data["text"] = this_clue.text;
  } else {
    match_data["html"] = this_clue.html;
  }

  if (this_clue.image != undefined) {
    match_data["image"] = this_clue.image;
  }

  if (this_clue.alt != undefined) {
    match_data["alt"] = this_clue.alt;
  }

  if (this_clue.interact != undefined) {
    //TODO: MAKE ENUM
    match_data["interact"] = this_clue.interact;
  } else {
    match_data["interact"] = "always";
  }

  if (this_clue.prompt != undefined) {
    match_data["prompt"] = this_clue.prompt;
  }

  if (this_clue.key != undefined) {
    match_data["key"] = this_clue.key;
  }

  match_data["version"] = version;

  //if (match_data["type"] == "clickable") // check if clickable or button
  return match_data;
}

function decryptSoft(blah: any, encrypted: boolean, version: string) {
  if (encrypted) {
    if (version == "0.9") {
      var level1 = "";
      for (var k = 0; k < blah.length; k += 2) {
        level1 += blah.charAt(k);
      }
      return atob(level1);
    } else {
      var level1 = "";
      for (var k = 0; k < blah.length; k += 2) {
        level1 += blah.charAt(k);
      }
      return atob(level1);
    }
  }
  return blah;
}

checkForUpdates();
//handleJson();

//TODO: Implement highlighting, check https://stackoverflow.com/questions/35412645/automatically-highlight-specific-word-in-browser
