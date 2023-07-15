import React, { useEffect, useState } from "react";
import { CluePage } from "src/components/CluePage";
import { loadStorageValues } from "src/providers/storage";
import {
  EMPTY_OR_INVALID_HUNT,
  UNKNOWN_ERROR_RESET_HUNT,
} from "src/types/errors";
import { ClueConfig } from "src/types/hunt_config";
import { nonNull } from "src/utils/helpers";
import { DecryptClue } from "src/utils/parse";
import { Render } from "src/utils/root";

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
  errorCallback: any,
) => {
  loadStorageValues(["huntConfig", "currentProgress"], (items: any) => {
    if (!items.huntConfig || !nonNull(items.currentProgress)) {
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
      encrypted,
      name,
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
    const sheet = document.styleSheets[4];
    sheet.insertRule(
      "body { ,height: 100%; background: url('" +
        background +
        "') no-repeat center; background-size: cover; background-position: cover;}",
      0,
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
        setError,
      ),
    [],
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

Render(<Popup />);
