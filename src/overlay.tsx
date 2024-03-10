import React, { useEffect, useState } from "react";
import { ClueOverlay } from "src/components/reusable/CluePage";
import { loadStorageValues } from "src/providers/storage";
import { EMPTY_OR_INVALID_HUNT } from "src/types/errors";
import { ClueConfig } from "src/types/hunt_config";
import { SomeProgress } from "src/types/progress";
import { nonNull } from "src/utils/helpers";
import { DecryptClue } from "src/utils/parse";
import { Render } from "src/utils/root";

const DEFAULT_LOADING_CLUE = {
  id: -1,
  url: "https://chrome.google.com/webstore/detail/scavenger-hunt/opcgbolmjikeaokbmldpfhemaamnfggf/related?hl=en-US",
  text: "",
};

const loadSolvedClueFromStorage = (
  huntNameCallback: (item: string) => void,
  encryptedCallback: (item: boolean) => void,
  huntBackgroundCallback: (item: string) => void,
  clueCallback: (item: ClueConfig) => void,
  errorCallback: (item: string) => void,
  beginningCallback: (item: boolean) => void,
) => {
  loadStorageValues(
    ["huntConfig", "currentProgress"],
    (items: SomeProgress) => {
      if (!items.huntConfig || !nonNull(items.currentProgress)) {
        errorCallback(EMPTY_OR_INVALID_HUNT);
        return;
      }
      const { name, encrypted, background, beginning, clues } =
        items.huntConfig;

      if (items.currentProgress === 0) {
        huntNameCallback(name);
        encryptedCallback(false);
        huntBackgroundCallback(background);
        clueCallback({
          id: 0,
          url: "",
          text: beginning,
        });
        beginningCallback(true);
        return;
      }

      const decryptedClue = DecryptClue(
        clues[items.currentProgress! - 1],
        encrypted,
        name,
      );

      huntNameCallback(name);
      encryptedCallback(encrypted);
      huntBackgroundCallback(background);
      clueCallback(decryptedClue);
    },
  );
};

// NOTE(Tyler): Overlay popup testing is not supported via playwright: https://github.com/microsoft/playwright/issues/5593
const Overlay = () => {
  const [huntName, setHuntName] = useState<string>("Scavenger Hunt");
  const [encrypted, setEncrypted] = useState<boolean>(false);
  const [decryptedClue, setDecryptedClue] =
    useState<ClueConfig>(DEFAULT_LOADING_CLUE);
  const [error, setError] = useState<string | undefined>();
  const [backgroundURL, setBackgroundURL] = useState<string>("");
  const [isBeginning, setIsBeginning] = useState<boolean>(false);

  useEffect(
    () =>
      loadSolvedClueFromStorage(
        setHuntName,
        setEncrypted,
        setBackgroundURL,
        setDecryptedClue,
        setError,
        setIsBeginning,
      ),
    [],
  );
  return (
    <ClueOverlay
      huntName={huntName}
      encrypted={encrypted}
      clue={decryptedClue}
      error={error}
      previewOnly={true}
      backgroundURL={backgroundURL}
      isBeginning={isBeginning}
    />
  );
};

Render(<Overlay />);
