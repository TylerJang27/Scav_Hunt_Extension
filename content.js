function checkForUpdates() {
  chrome.storage.sync.get({
    sourceUpdates: false
  }, function(items) {
    console.log("here is my update status: " + items.sourceUpdates);
    if (items.sourceUpdates) {
      chrome.storage.sync.get({
        sourceJson: chrome.runtime.getURL('res/hunt.json'),
      }, function(items) {
        console.log("retrieving clues...");
        getClues(items.sourceJson);
      });
    } else {
      console.log("No updates");
      handleJson();
    }
  });
}

async function getClues(source) {
  //const json_url = chrome.runtime.getURL('res/hunt.json');
  console.log("source is: " + source);
  try {
    fetch(source, {
      mode: "cors"
    })
    .then(res => res.json())
    .then(function(response) {
      chrome.storage.sync.set({
        sourceUpdates: false,
        clueobject: response
      }, function() {
        handleJson();
      });
    });
  } catch (error) {
    console.error(error);
  }
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
        console.log("Looping through " + clues.length);
        for(var i = 0; i < clues.length; i++) {
          var obj = clues[i]
          //error handling for bad clue definitions
          if (clues[i].id == undefined) {
            match_data["error"] = "Missing ID, please contact the Scavenger Hunt manager";
            break;
          }
          if (clues[i].text == undefined && clues[i].html == undefined) {
            match_data["error"] = "Missing text or HTML, please contact the Scavenger Hunt manager";
            break;
          }
          if (clues[i].url == undefined) {
            match_data["error"] = "Missing URL, please contact the Scavenger Hunt manager";
            break;
          }
          if (clues[i].interact == "submit" && clues[i].key == undefined) {
            match_data["error"] = "Missing submit key, please contact the Scavenger Hunt manager";
            break;
          }
    
          //check if url matches a clue
          console.log(decryptSoft(clues[i].url, en));
          let reg = new RegExp(decryptSoft(clues[i].url, en))
          var matches = window.location.href.match(reg);
    
          if (matches == null) {
            //skip to next clue
            continue;
          } else {
            //populate match with clue info
            match_data = populate_match_data(clues[i], en);
            break
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
  match_data = {}
  match_data["url"] = this_clue.url;
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
      return (atob(levelc));
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
handleJson();

//TODO: Implement highlighting, check https://stackoverflow.com/questions/35412645/automatically-highlight-specific-word-in-browser
