// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     const re = new RegExp('bear', 'gi')
//     const matches = document.documentelement.innerHTML.match(re);
//     sendResponse({count: matches.length})
//     //alert(request)
// })

// const re = new RegExp('bear', 'gi')
// const matches = document.documentElement.innerHTML.match(re) || []

async function getClues() {
  const json_url = chrome.runtime.getURL('res/hunt.json');
  try {
    let res = await fetch(json_url);
    let data = await res.json();
    //TODO: ENCRYPT WITH JSON
    console.log(data);
    handleJson(data);
  } catch (error) {
    console.error(error);
  }
}

function handleJson(hunt_data) {
  var clues = hunt_data.clues;

  var match_data = {};

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
    if (clues[i].url == undefined && clues[i].id != 0) {
      match_data["error"] = "Missing URL, please contact the Scavenger Hunt manager";
      break;
    }

    //check if url matches a clue
    let reg = new RegExp(clues[i].url)
    var matches = window.location.href.match(reg);

    if (matches == null) {
      //skip to next clue
      continue;
    } else {
      //populate match with clue info
      match_data = populate_match_data(clues[i]);
      break
    }
  }

  //can do highlighting here to, may have to do some request stuff correctly for popups, etc. (but that's stage 2)

  //TODO 1B: PASS THE CORRECT INFO ALONG
  chrome.runtime.sendMessage(match_data);
}

function populate_match_data(this_clue) {
  match_data = {}
  match_data["url"] = this_clue.url;
  if (this_clue.text != undefined) {
    match_data["text"] = this_clue.text;
    console.log("sending text");
  } else {
    match_data["html"] = this_clue.html;
  }

  if (this_clue.image != undefined) {
    match_data["image"] = this_clue.image;
  }
  
  if (this_clue.interact != undefined) { //TODO: MAKE ENUM
    match_data["interact"] = this_clue.interact;
  } else {
    match_data["interact"] = "always";
  }

  //if (match_data["type"] == "clickable") // check if clickable or button
  return match_data;
}

getClues();



  // {
  // url: window.location.href,
  // count: matches.length
  //url
  //html source (optional)
  //text (optional)
  //number
  //image (optional)
  //interact (always, clickable)
// }
// )

//need to do some document getElementById or the innerHTML search and stuff



//from https://stackoverflow.com/questions/35412645/automatically-highlight-specific-word-in-browser
// var all = document.getElementsByTagName("*");
// highlight_words('Bryant', all);

// function highlight_words(keywords, element) {
//     if(keywords) {
//         var textNodes;
//         keywords = keywords.replace(/\W/g, '');
//         var str = keywords.split(" ");
//         $(str).each(function() {
//             var term = this;
//             var textNodes = $(element).contents().filter(function() { return this.nodeType === 3 });
//             textNodes.each(function() {
//                 var content = $(this).text();
//                 var regex = new RegExp(term, "gi");
//                 content = content.replace(regex, '<span class="highlight">' + term + '</span>');
//                 $(this).replaceWith(content);
//             });
//         });
//     }
// }