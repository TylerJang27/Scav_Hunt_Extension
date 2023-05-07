import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { BeginningPage } from "./components/CluePage";

const loadBeginningFromStorage = (callback: any) => {
  chrome.storage.local.get("huntConfig", function (items) {
    callback(items);
  });
};

const Beginning = () => {
  const [huntName, setHuntName] = useState<string>("Scavenger Hunt");
  const [beginningText, setBeginningText] = useState<string>(
    "Empty beginning text. Please reset the hunt."
  );

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
      console.warn("No hunt information found. Please reset the hunt.");
    }
  });

  // TODO: TYLER MAKE THESE INTO REUSABLE COMPONENTS
  return <BeginningPage title={huntName} message={beginningText} />;
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Beginning />
  </React.StrictMode>
);
