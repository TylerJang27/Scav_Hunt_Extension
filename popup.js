function populateDiv(div, clue, en) {
  div.textContent = `${decryptSoft(clue.url, en)}: ${decryptSoft(clue.text, en)}`
  // add image
  if (clue.image != undefined) {
    const img = document.createElement('img');
    if (decryptSoft(clue.image, en).includes("res/")) {
      img.src = chrome.runtime.getURL(decryptSoft(clue.image, en));
    } else {
      img.src = decryptSoft(clue.image, en);
    }
    
    //add alt text
    if (clue.alt != undefined) {
      img.alt = decryptSoft(clue.alt, en);
    }
    div.appendChild(img, en);
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
  frm.appendChild(txt_input);
  frm.appendChild(submit_btn);

  div.appendChild(frm);
}

document.addEventListener('DOMContentLoaded', function () {
    const bg = chrome.extension.getBackgroundPage() //gets access to background.js background page window
    const div = document.createElement('div')
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
      div.textContent = 'Keep looking!'
    }
    document.body.appendChild(div)
    //document.getElementById("clue").appendChild(div);



    // Object.keys(bg.clue).forEach(function (url) {
    //   const div = document.createElement('div')
    //   div.textContent = `${url}: ${bg.clue[url]}`

    //   //TODO 3: RATHER THAN POPULATE WITH DIV AND STUFF, POPULATE WITH THE CORRECT STUFF

    //   document.body.appendChild(div)
    // })
  
  }, false)

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