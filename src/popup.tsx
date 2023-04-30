import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { CluePage } from "./components/CluePage";

// TODO: TYLER ADAPT FOR THE CONTENT
function populateDiv(div: any, clueobj: any) {
  if (clueobj == undefined || clueobj.beginning == undefined) {
    div.textContent =
      "An unexpected error has occurred. Please contact the hunt manager.";
  } else {
    const p = document.createElement("p");
    p.setAttribute("class", "lead");

    var clue_content = clueobj.beginning;
    var clue_lines = [];
    console.log(clue_content);
    if (clue_content.includes("\n")) {
      console.log("splitting");
      clue_lines = clue_content.split("\n");
    } else {
      console.log("not splitting");
      clue_lines = [clue_content];
    }
    console.log(clue_lines);

    var lastp = p;
    for (var i = 0; i < clue_lines.length; i++) {
      var p2 = document.createElement("p");
      p2.setAttribute("class", "lead");
      p2.textContent = clue_lines[i];
      lastp.appendChild(p2);
      lastp = p2;
    }
    div.appendChild(p);
  }
}

// TODO: REMOVE
const loadBeginningFromStorage = (callback: any) => {
  chrome.storage.local.get("huntConfig", function (items) {
      callback(items);
    }
  )
};

// TODO: USE
const loadSolvedClueFromStorage = (callback: any) => {
  chrome.storage.local.get(
    ["huntConfig",
    "currentProgress"],
    function (items) {
      callback(items);
    });
};

const Popup = () => {
  const [huntName, setHuntName] = useState<string>("Scavenger Hunt");
  const [beginningText, setBeginningText] = useState<string>("Empty beginning text. Please reset the hunt.");

  loadBeginningFromStorage((items: any) => {
    if (items.huntConfig) {
      const huntConfig = items.huntConfig;
      // Set background image
      const sheet = document.styleSheets[2];
      sheet.insertRule(
        "body { ,height: 100%; background: url('" +
          huntConfig.background +
          "') no-repeat center; background-size: cover; background-position: cover;}",
        0
      );
      // Set beginning text
      setBeginningText(huntConfig.beginning);
      setHuntName(huntConfig.name);
    } else {
      console.log(items);
      console.warn("No hunt information found. Please reset the hunt.");
    }
  });

  // TODO: TYLER PASS MORE THINGS HERE
  return (
    <CluePage title={huntName} message={beginningText}/>);
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
