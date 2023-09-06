import UploadIcon from "@mui/icons-material/Upload";
import { Button } from "@mui/material";
import React, { ChangeEvent } from "react";
import { HuntConfig } from "src/types/hunt_config";
import { ParseConfig } from "src/utils/parse";

const onUpload = (
  e: ChangeEvent<HTMLInputElement>,
  setHuntConfig: (huntConfig: HuntConfig) => void,
  setUploadError: (error: string | undefined) => void,
) => {
  if (!e.target.files) {
    return;
  }
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    try {
      // trunk-ignore(eslint/@typescript-eslint/no-unsafe-assignment)
      const huntData = JSON.parse(event.target?.result as string);
      const huntConfig = ParseConfig(huntData);
      if (huntConfig.encrypted) {
        setUploadError(
          "Can only upload draft hunts that have encrypted: false",
        );
      } else {
        setUploadError(undefined);
        setHuntConfig(huntConfig);
      }
    } catch (err: any) {
      // trunk-ignore(eslint)
      setUploadError(err.message);
    }
  });
  reader.readAsText(file);
};

export interface UploadDraftButtonProps {
  setHuntConfig: (huntConfig: HuntConfig) => void;
  setUploadError: (error: string | undefined) => void;
}

export const UploadDraftButton = (props: UploadDraftButtonProps) => (
  <Button
    color="secondary"
    variant="contained"
    component="label"
    startIcon={<UploadIcon />}
  >
    Upload Draft
    <input
      type="file"
      accept=".json,jsn,.json5"
      onChange={(e) => {
        onUpload(e, props.setHuntConfig, props.setUploadError);
      }}
      hidden
    />
  </Button>
);
