import React from "react";
import { createRoot } from "react-dom/client";

function populateDiv(div: any, clue: any, en: boolean) {
  const p = document.createElement("p");
  p.setAttribute("class", "lead");
  p.textContent = `${decryptSoft(clue.url, en, clue.version)}`;
  const br = document.createElement("br");
  p.appendChild(br);
  var clue_content = `${decryptSoft(clue.text, en, clue.version)}`;
  var clue_lines;
  if (clue_content.includes("\n")) {
    clue_lines = clue_content.split("\n");
  } else {
    clue_lines = [clue_content];
  }

  var lastp = p;
  for (var i = 0; i < clue_lines.length; i++) {
    var p2 = document.createElement("p");
    p2.setAttribute("class", "lead");
    p2.textContent = clue_lines[i];
    lastp.appendChild(p2);
    lastp = p2;
  }
  div.appendChild(p);

  // add image
  if (clue.image != undefined) {
    const img = document.createElement("img");
    img.setAttribute("display", "block");
    img.setAttribute("height", "75%");
    img.setAttribute("width", "75%");
    if (decryptSoft(clue.image, en, clue.version).includes("res/")) {
      img.src = chrome.runtime.getURL(
        decryptSoft(clue.image, en, clue.version)
      );
    } else {
      img.src = decryptSoft(clue.image, en, clue.version);
    }

    //add alt text
    if (clue.alt != undefined) {
      img.alt = decryptSoft(clue.alt, en, clue.version);
    }
    div.appendChild(img);
  }
}

function validateKey() {
  const bg = chrome.extension.getBackgroundPage() as any;
  const clue = bg.clue;
  const en = clue.encrypted;
  var userKey = (document.getElementById("userInput") as any).value;
  if (
    String(decryptSoft(clue.key, en, clue.version)).toUpperCase() ==
    String(userKey).toUpperCase()
  ) {
    clue.visible = true;
  } else {
    alert("Try Again");
  }
}

function populateForm(div: any, clue: any, en: boolean) {
  const frm = document.createElement("form");
  frm.setAttribute("id", "keyForm");
  const lbl = document.createElement("label");
  lbl.setAttribute("for", "textPrompt");
  if (clue.prompt == undefined) {
    lbl.textContent = "Enter Key: ";
  } else {
    lbl.textContent = decryptSoft(clue.prompt, en, clue.version);
  }
  const br = document.createElement("br");
  const txt_input = document.createElement("input");
  txt_input.setAttribute("type", "text");
  txt_input.setAttribute("id", "userInput");
  txt_input.setAttribute("name", "userInput");
  const submit_btn = document.createElement("input");
  submit_btn.setAttribute("type", "submit");
  submit_btn.setAttribute("id", "submit");
  submit_btn.setAttribute("name", "submit");
  submit_btn.addEventListener("click", validateKey);

  frm.appendChild(lbl);
  frm.appendChild(br);
  frm.appendChild(txt_input);
  frm.appendChild(submit_btn);

  div.appendChild(frm);
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const bg = chrome.extension.getBackgroundPage() as any; //gets access to background.js background page window
    const div = document.createElement("div");
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
      div.textContent = "Please return to the previous page and try again!";
    }
    document.getElementById("hunt-clue")?.appendChild(div);

    //set correct title and background image
    chrome.storage.local.get(
      {
        clueobject: "",
        maxId: 0,
      },
      function (items) {
        var hunt_data = items.clueobject; //TODO: ADD TITLE AND SUCH
        var img = hunt_data.background;
        if (img == undefined) {
          img =
            "https://images.unsplash.com/photo-1583425921686-c5daf5f49e4a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=889&q=80";
        }
        var sheet = document.styleSheets[2];
        sheet.insertRule(
          "body { ,height: 100%; background: url('" +
            img +
            "') no-repeat center; background-size: cover; background-position: cover;}",
          0
        );

        var title = hunt_data.name;
        if (title == undefined) {
          title = "Scavenger Hunt";
        }
        document.getElementById("hunt-title")!.textContent = title;

        handleMaxId(bg.clue, div, items.maxId);
      }
    );
  },
  false
);

function handleMaxId(clue: any, div: any, max: number) {
  if (max == clue.id) {
    const br = document.createElement("br");
    const a = document.createElement("a");
    a.textContent = "Feedback Survey";
    a.setAttribute("href", "https://forms.gle/3ZhvtKasc3WZZF9V7");
    a.setAttribute("class", "survey");
    div.appendChild(br);
    div.appendChild(a);
  }
}

// TODO: TYLER REFACTOR INTO UTILS
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

const Popup = () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="description" content="" />
        <meta
          name="author"
          content="Mark Otto, Jacob Thornton, and Bootstrap contributors, Tyler Jang"
        />
        <meta name="generator" content="Jekyll v4.1.1" />
        <title>Scavenger Hunt</title>

        <link
          rel="canonical"
          href="https://getbootstrap.com/docs/4.5/examples/cover/"
        />

        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
          integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
          crossOrigin="anonymous"
        />
        <link href="assets/hunt.css" rel="stylesheet" />
        <link href="assets/popuper.css" rel="stylesheet" />
      </head>
      <body className="text-center">
        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
          <header className="masthead mb-auto">
            <div className="inner">
              <h3 className="masthead-brand justify-content-center">
                Scavenger Hunt
              </h3>
            </div>
          </header>

          <main role="main" className="inner cover">
            <div className="card border-1 shadow my-5">
              <h1 className="cover-heading" id="hunt-title">
                Scavenger Hunt
              </h1>
              <p className="lead" id="hunt-clue"></p>
              <script src="popup.js" charSet="utf-8"></script>
            </div>
          </main>

          <footer className="mastfoot mt-auto">
            <div className="inner">
              <p>
                <a href="https://github.com/TylerJang27/Scav_Hunt_Extension">
                  Scavenger Hunt Extension
                </a>
                <br />
                Cover template for{" "}
                <a href="https://getbootstrap.com/">Bootstrap</a>, by{" "}
                <a href="https://twitter.com/mdo">@mdo</a>.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
