function populateDiv(div, clue, en) {
  const p = document.createElement('p');
  p.setAttribute('class', 'lead');
  p.textContent = `${decryptSoft(clue.url, en, clue.version)}`;
  const br = document.createElement('br');
  p.appendChild(br);
  var clue_content = `${decryptSoft(clue.text, en, clue.version)}`;
  if (clue_content.includes("\n")) {
    clue_lines = clue_content.split("\n");
  } else {
    clue_lines = [clue_content];
  }
  
  var lastp = p;
  for (i = 0; i < clue_lines.length; i++) {
    var p2 = document.createElement('p');
    p2.setAttribute('class', 'lead');
    p2.textContent = clue_lines[i];
    lastp.appendChild(p2);
    lastp = p2;
  }
  div.appendChild(p);

  // add image
  if (clue.image != undefined) {
    const img = document.createElement('img');
    img.setAttribute('display', 'block');
    img.setAttribute('height', '75%');
    img.setAttribute('width', '75%');
    if (decryptSoft(clue.image, en, clue.version).includes("res/")) {
      img.src = chrome.runtime.getURL(decryptSoft(clue.image, en, clue.version));
    } else {
      img.src = decryptSoft(clue.image, en, clue.version);
    }
    
    //add alt text
    if (clue.alt != undefined) {
      img.alt = decryptSoft(clue.alt, en);
    }
    div.appendChild(img);
  }
}

function validateKey() {
  const bg = chrome.extension.getBackgroundPage();
  const clue = bg.clue;
  const en = clue.encrypted;
  var userKey = document.getElementById('userInput').value;
  if (String(decryptSoft(clue.key, en, clue.version)).toUpperCase() == String(userKey).toUpperCase()) {
    clue.visible = true;
  } else {
    alert("Try Again");
  }
}

function populateForm(div, clue, en) {
  const frm = document.createElement('form');
  frm.setAttribute('id', 'keyForm');
  const lbl = document.createElement('label');
  lbl.setAttribute('for', 'textPrompt');
  if (clue.prompt == undefined) {
    lbl.textContent="Enter Key: ";
  } else {
    lbl.textContent=decryptSoft(clue.prompt, en, clue.version);
  }
  const br = document.createElement('br');
  const txt_input = document.createElement('input');
  txt_input.setAttribute('type', 'text');
  txt_input.setAttribute('id', 'userInput');
  txt_input.setAttribute('name', 'userInput');
  const submit_btn = document.createElement('input');
  submit_btn.setAttribute('type', 'submit');
  submit_btn.setAttribute('id', 'submit');
  submit_btn.setAttribute('name', 'submit');
  submit_btn.addEventListener("click", validateKey);

  frm.appendChild(lbl);
  frm.appendChild(br);
  frm.appendChild(txt_input);
  frm.appendChild(submit_btn);

  div.appendChild(frm);
}

document.addEventListener('DOMContentLoaded', function () {
    const bg = chrome.extension.getBackgroundPage(); //gets access to background.js background page window
    const div = document.createElement('div');
    var en = bg.clue.encrypted;
    if (bg.clue.url != undefined) {
      if (bg.clue.interact == "submit") {
        if (bg.clue.visible) {
          populateDiv(div, bg.clue, en);
        } else {
          populateForm(div, bg.clue, en);
        }
      } else {
        populateDiv(div, bg.clue, en);
      }
    } else {
      //if control flow is correct, this should not be hit
      div.textContent = 'Please return to the previous page and try again!'
    }
    document.getElementById("hunt-clue").appendChild(div);

    //set correct title and background image
    chrome.storage.sync.get({
      clueobject: "",
      maxId: 0
    }, function(items) {
      var hunt_data = items.clueobject; //TODO: ADD TITLE AND SUCH
      var img = hunt_data.background;
      if (img == undefined) {
        img = "https://images.unsplash.com/photo-1583425921686-c5daf5f49e4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=889&q=80";
      }
      var sheet = document.styleSheets[2];
      sheet.insertRule("body { ,height: 100%; background: url('" + img + "') no-repeat center; background-size: cover; background-position: cover;}", 0);

      var title = hunt_data.name;
      if (title == undefined) {
        title = "Scavenger Hunt";
      }
      document.getElementById("hunt-title").textContent=title;

      handleMaxId(bg.clue, div, items.maxId);
    });

  }, false)

  function handleMaxId(clue, div, max) {
    if (max == clue.id) {
      const br = document.createElement('br');
      const a = document.createElement('a');
      a.textContent="Feedback Survey";
      a.setAttribute("href", "https://forms.gle/3ZhvtKasc3WZZF9V7");
      a.setAttribute("class", "survey");
      div.appendChild(br);
      div.appendChild(a);
    }
  }

function decryptSoft(blah, encrypted, version) {
  if (encrypted) {
    if (version == "0.9") {
      level1 = "";
      for (var k = 0; k < blah.length; k += 2) {
          level1 += blah.charAt(k);
      }
      return (atob(level1));
    } else {
      level1 = "";
      for (var k = 0; k < blah.length; k += 2) {
          level1 += blah.charAt(k);
      }
      return (atob(level1));
    }
  }
  return blah;
}