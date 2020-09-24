function populateDiv(div, clue, en) {
  const p = document.createElement('p');
  p.setAttribute('class', 'lead');
  p.textContent = `${decryptSoft(clue.url, en)}`;
  const br = document.createElement('br');
  p.appendChild(br);
  var clue_content = `${decryptSoft(clue.text, en)}`;
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
    if (decryptSoft(clue.image, en).includes("res/")) {
      img.src = chrome.runtime.getURL(decryptSoft(clue.image, en));
    } else {
      img.src = decryptSoft(clue.image, en);
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
  const en = bg.encrypted;
  var userKey = document.getElementById('userInput').value;
  if (String(decryptSoft(clue.key, en)).toUpperCase() == String(userKey).toUpperCase()) {
    clue.visible = true;
  } else {
    alert("Try Again");
  }
}

function populateForm(div) {
  const frm = document.createElement('form');
  frm.setAttribute('id', 'keyForm');
  const lbl = document.createElement('label');
  lbl.setAttribute('for', 'textPrompt');
  lbl.textContent="Enter Key: ";
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
      if (bg.clue.interact == encryptSoft("submit", en)) {
        if (bg.clue.visible) {
          populateDiv(div, bg.clue, en);
        } else {
          populateForm(div);
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
        img = "https://getbootstrap.com/docs/4.5/examples/cover/";
      }
      var sheet = document.styleSheets[2];
      sheet.insertRule("body { ,height: 100%; background: url('" + img + "') no-repeat center; background-size:cover; background-position: cover;}", 0);

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