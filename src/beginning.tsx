import React, { useEffect, useState } from "react";
import { BeginningPage } from "src/components/CluePage";
import { logger } from "src/logger";
import { loadStorageValue } from "src/providers/storage";
import { LoadStorageCallback } from "src/providers/types";
import { SomeProgress } from "src/types/progress";
import { Render } from "src/utils/root";

const loadBeginningFromStorage = (callback: LoadStorageCallback) => {
  logger.debug("Loading beginning from storage");
  loadStorageValue("huntConfig", callback);
};

const Beginning = () => {
  const [huntName, setHuntName] = useState<string>("Scavenger Hunt");
  const [beginningText, setBeginningText] = useState<string>(
    "Empty beginning text. Please reset the hunt.",
  );

  useEffect(
    () =>
      loadBeginningFromStorage((items: SomeProgress) => {
        if (items.huntConfig) {
          const { background, beginning, name } = items.huntConfig;
          // Set background image
          const sheet = document.styleSheets[3];
          sheet.insertRule(
            "body { ,height: 100%; background: url('" +
              background +
              "') no-repeat center; background-size: cover; background-position: cover;}",
            0,
          );
          // Set beginning text
          setBeginningText(beginning);
          setHuntName(name);
        } else {
          logger.warn("No hunt information found. Please reset the hunt.");
        }
      }),
    [],
  );

  return <BeginningPage title={huntName} message={beginningText} />;
};

Render(<Beginning />);
