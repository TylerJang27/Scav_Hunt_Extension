import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { CluePage } from "./components/CluePage";
import { ClueConfig } from "./types/hunt_config";
import {
  EMPTY_OR_INVALID_HUNT,
  UNKNOWN_ERROR_RESET_HUNT,
} from "./types/errors";
import { DEFAULT_BACKGROUND, DecryptClue } from "./utils/parse";

const DEFAULT_LOADING_CLUE = {
  id: -1,
  url: "https://chrome.google.com/webstore/detail/scavenger-hunt/opcgbolmjikeaokbmldpfhemaamnfggf/related?hl=en-US",
  text: "",
};

const loadSolvedClueFromStorage = (
  huntNameCallback: any,
  encryptedCallback: any,
  huntBackgroundCallback: any,
  clueCallback: any,
  errorCallback: any
) => {
  chrome.storage.local.get(["huntConfig", "currentProgress"], function (items) {
    console.log("GETTING STORAGE");
    if (!items.huntConfig || items.currentProgress === undefined) {
      errorCallback(EMPTY_OR_INVALID_HUNT);
      return;
    }

    if (items.currentProgress === 0) {
      // TODO: TYLER SHOULD WE OPEN THE OPTIONS PAGE? OR A TUTORIAL?
      errorCallback(UNKNOWN_ERROR_RESET_HUNT);
      return;
    }

    const { name, encrypted, background, clues } = items.huntConfig;
    const decryptedClue = DecryptClue(
      clues[items.currentProgress - 1],
      encrypted
    );

    huntNameCallback(name);
    encryptedCallback(encrypted);
    huntBackgroundCallback(background);
    clueCallback(decryptedClue);
  });
};

const Popup = () => {
  const [huntName, setHuntName] = useState<string>("Scavenger Hunt");
  const [encrypted, setEncrypted] = useState<boolean>(false);
  const [decryptedClue, setDecryptedClue] =
    useState<ClueConfig>(DEFAULT_LOADING_CLUE);
  const [error, setError] = useState<string | undefined>();

  // TODO: TYLER MAKE THIS MORE REACT-IVE
  const backgroundCallback = (background: string) => {
    const sheet = document.styleSheets[2];
    sheet.insertRule(
      "body { ,height: 100%; background: url('" +
        background +
        "') no-repeat center; background-size: cover; background-position: cover;}",
      0
    );
  };

  // TODO: TYLER MAKE SURE EVERYWHERE ELSE HAS THE USE EFFECT IT NEEDS
  useEffect(
    () =>
      loadSolvedClueFromStorage(
        setHuntName,
        setEncrypted,
        backgroundCallback,
        setDecryptedClue,
        setError
      ),
    []
  );
  return (
    <CluePage
      huntName={huntName}
      encrypted={encrypted}
      clue={decryptedClue}
      error={error}
    />
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
