import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BeginningPage } from "./components/CluePage";
import { provider } from "./providers/chrome";

const loadBeginningFromStorage = (callback: any) => {
  console.log("LOADING BEGININNG FROM STORAGE");
  provider.storage.local.get("huntConfig", function (items) {
    callback(items);
  });
};

const Beginning = () => {
  const [huntName, setHuntName] = useState<string>("Scavenger Hunt");
  const [beginningText, setBeginningText] = useState<string>(
    "Empty beginning text. Please reset the hunt."
  );

  useEffect(()=>loadBeginningFromStorage((items: any) => {
    if (items.huntConfig) {
      const {background, beginning, name} = items.huntConfig;
      // Set background image
      const sheet = document.styleSheets[3];
      sheet.insertRule(
        "body { ,height: 100%; background: url('" +
          background +
          "') no-repeat center; background-size: cover; background-position: cover;}",
        0
      );
      // Set beginning text
      setBeginningText(beginning);
      setHuntName(name);
    } else {
      console.warn("No hunt information found. Please reset the hunt.");
    }
  }), []);

  return <BeginningPage title={huntName} message={beginningText} />;
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Beginning />
  </React.StrictMode>
);
