function checkForUpdates() {
  chrome.storage.sync.get({
    sourceUpdates: false
  }, function(items) {
    if (items.sourceUpdates) {
      chrome.storage.sync.get({
        sourceJson: chrome.runtime.getURL('res/hunt.json'),
      }, function(items) {
        getClues(items.sourceJson);
      });
    } else {
      handleJson();
    }
  });
}

async function getClues(source) {
  //const json_url = chrome.runtime.getURL('res/hunt.json');
  try {
    fetch(source, {
      mode: "cors"
    })
    .then(res => res.json())
    .then(function(response) {
      chrome.storage.sync.set({
        sourceUpdates: false,
        clueobject: response,
        maxId: getMaxId(response.clues)
      }, function() {
        handleJson();
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

function handleJson() {
  var match_data = {};
  hunt_data = "";
  try {
    chrome.storage.sync.get({
      clueobject: "",
    }, function(items) {
      hunt_data = items.clueobject;
      var clues = hunt_data.clues;
      var en = hunt_data.encrypted;
      if (en == undefined) {
        en = false;
      }

      if (clues == undefined || hunt_data == "") {
        match_data["error"] = "Please set or reset the Scavenger Hunt source in Options.";
      } else {
        for(var i = 0; i < clues.length; i++) {
          var obj = clues[i];
          //error handling for bad clue definitions
          if (obj.id == undefined) {
            match_data["error"] = "Missing ID, please contact the Scavenger Hunt manager";
            break;
          }
          if (obj.text == undefined && obj.html == undefined) {
            match_data["error"] = "Missing text or HTML, please contact the Scavenger Hunt manager";
            break;
          }
          if (obj.url == undefined) {
            match_data["error"] = "Missing URL, please contact the Scavenger Hunt manager";
            break;
          }
          if (obj.interact == "submit" && obj.key == undefined) {
            match_data["error"] = "Missing submit key, please contact the Scavenger Hunt manager";
            break;
          }
    
          //check if url matches a clue
          let reg = new RegExp(decryptSoft(obj.url, en));
          var matches = window.location.href.match(reg);
    
          if (matches == null) {
            //skip to next clue
            continue;
          } else {
            //populate match with clue info
            match_data = populate_match_data(obj, en);
            break;
          }
        }
      }
    
      //can do highlighting here too, may have to do some request stuff correctly for popups, etc. (but that's stage 2)
      match_data["encrypted"] = en;
      chrome.runtime.sendMessage(match_data);
    });
  } catch (error) {
    console.error("Unknown json error, please contact the Scavenger Hunt manager. Source data: " + hunt_data);
  }
}

//populates match_data and specifies default values
function populate_match_data(this_clue, en) {
  match_data = {};
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
  
  if (this_clue.interact != undefined) { //TODO: MAKE ENUM
    match_data["interact"] = this_clue.interact;
  } else {
    match_data["interact"] = encryptSoft("always", en);
  }

  if (this_clue.key != undefined) {
    match_data["key"] = this_clue.key;
  }

  //if (match_data["type"] == "clickable") // check if clickable or button
  return match_data;
}

function decryptSoft(blah, encrypted) {
  if (encrypted) {
      level1 = "";
      for (var k = 0; k < blah.length; k += 2) {
          level1 += blah.charAt(k);
      }
      return (atob(level1));
  }
  return blah;
}

function encryptSoft(text, encrypted) {
  if (encrypted) {
      var level1 = btoa(text);
      var level2 = level1.split("");
      var level3 = "";
      for (var k = 0; k < level2.length-1; k++) {
          level3 += level1.charAt(k) + Math.random().toString(36).charAt(2);
      }
      return (level3 + level2[level2.length - 1]);
  }
  return text;
}

checkForUpdates();
//handleJson();

//TODO: Implement highlighting, check https://stackoverflow.com/questions/35412645/automatically-highlight-specific-word-in-browser
