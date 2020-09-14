import { encryptSoft, encryptHard, decryptSoft } from './encrypt.js';

function populateDiv(div, clue) {
  div.textContent = `${decryptSoft(clue.url)}: ${decryptSoft(clue.text)}`
  // add image
  if (clue.image != undefined) {
    const img = document.createElement('img');
    if (decryptSoft(clue.image).includes("res/")) {
      img.src = chrome.runtime.getURL(decryptSoft(clue.image));
    } else {
      img.src = decryptSoft(clue.image);
    }
    
    //add alt text
    if (clue.alt != undefined) {
      img.alt = decryptSoft(clue.alt);
    }
    div.appendChild(img);
  }
}

function validateKey() {
  const clue = chrome.extension.getBackgroundPage().clue;
  var userKey = document.getElementById('userInput').value;
  if (String(decryptSoft(clue.key)).toUpperCase() == String(userKey).toUpperCase()) {
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

    if (bg.clue.url != undefined) {
      if (bg.clue.interact == encryptSoft("submit")) {
        if (bg.clue.visible) {
          populateDiv(div, bg.clue);
        } else {
          populateForm(div);
        }
      } else {
        populateDiv(div, bg.clue);
      }
    } else {
      //if control flow is correct, this should not be hit
      div.textContent = 'Keep looking!'
    }
    document.body.appendChild(div)



    // Object.keys(bg.clue).forEach(function (url) {
    //   const div = document.createElement('div')
    //   div.textContent = `${url}: ${bg.clue[url]}`

    //   //TODO 3: RATHER THAN POPULATE WITH DIV AND STUFF, POPULATE WITH THE CORRECT STUFF

    //   document.body.appendChild(div)
    // })
  



    // document.querySelector('button').addEventListener('click', onclick, false)
    
    // function onclick () {
    //   chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, 'hi', setCount)
    //   })
    // }
    
    // function setCount (res) {
    //   const div = document.createElement('div')
    //   div.textContent = `${res.count} bears`
    //   document.body.appendChild(div)
    // }
  }, false)