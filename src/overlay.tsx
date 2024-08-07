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
  markdown: "",
};

const loadSolvedClueFromStorage = (
  huntNameCallback: (item: string) => void,
  numCluesCallback: (item: number | undefined) => void,
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
      const { name, encrypted, background, beginning, clues, options } =
        items.huntConfig;

      if (items.currentProgress === 0) {
        huntNameCallback(name);
        encryptedCallback(false);
        huntBackgroundCallback(background);
        clueCallback({
          id: 0,
          url: "",
          text: beginning,
          // TODO(Tyler): Do we want to support markdown for beginning text?
          markdown: "",
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
      numCluesCallback(options.inOrder ? clues.length : undefined);
      encryptedCallback(encrypted);
      huntBackgroundCallback(background);
      clueCallback(decryptedClue);
    },
  );
};

// NOTE(Tyler): Overlay popup testing is not supported via playwright: https://github.com/microsoft/playwright/issues/5593
const Overlay = () => {
  const [huntName, setHuntName] = useState<string>("Scavenger Hunt");
  const [numClues, setNumClues] = useState<number | undefined>();
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
        setNumClues,
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
      numClues={numClues}
      error={error}
      previewOnly={true}
      backgroundURL={backgroundURL}
      isBeginning={isBeginning}
    />
  );
};

Render(<Overlay />);
