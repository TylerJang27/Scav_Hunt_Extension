import DownloadIcon from "@mui/icons-material/Download";
import { Button } from "@mui/material";
import React from "react";
import { download } from "src/providers/downloads";
import { throwIfTooLarge } from "src/types/errors";
import { HuntConfig } from "src/types/hunt_config";
import { EncryptClue, ParseConfig } from "src/utils/parse";

const generateJson = (
  huntConfig: HuntConfig,
  setErrorTooltip: (message: string) => void,
) => {
  const encryptedHunt = {
    ...huntConfig,
    clues: huntConfig.clues.map((clue) =>
      EncryptClue(clue, huntConfig.encrypted, huntConfig.name),
    ),
  };

  try {
    throwIfTooLarge(encryptedHunt);
    ParseConfig(encryptedHunt);

    const outputString = JSON.stringify(encryptedHunt, null, "  ");

    const blob_gen = new Blob([outputString], { type: "application/json" });
    const url_gen = URL.createObjectURL(blob_gen);

    download({
      url: url_gen,
      filename: `${huntConfig.name}.json`,
    });
  } catch (err: any) {
    // trunk-ignore(eslint)
    setErrorTooltip(err.message);
  }
};

export interface DownloadHuntButtonProps {
  huntConfig: HuntConfig;
  setSubmittedEver: (submitted: boolean) => void;
  setErrorTooltip: (error: string | undefined) => void;
}

export const DownloadHuntButton = (props: DownloadHuntButtonProps) => (
  <Button
    fullWidth
    color="primary"
    variant="contained"
    onClick={() => {
      props.setSubmittedEver(true);
      generateJson(props.huntConfig, props.setErrorTooltip);
    }}
    sx={{ mt: 1 }}
    startIcon={<DownloadIcon />}
    data-testid="hunt-download-button"
  >
    Download
  </Button>
);
