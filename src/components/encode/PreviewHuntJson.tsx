import { TextField } from "@mui/material";
import React from "react";
import { HuntConfig } from "src/types/hunt_config";

export interface PreviewHuntJsonProps {
  huntConfig: HuntConfig;
}

export const PreviewHuntJson = (props: PreviewHuntJsonProps) => (
  <TextField
    variant="outlined"
    aria-label="Preview JSON"
    InputProps={{
      inputProps: { style: { color: "#fff" } },
    }}
    minRows={23}
    maxRows={23}
    multiline
    value={JSON.stringify(props.huntConfig, null, "  ")}
    sx={{
      fontFamily: "system-ui",
      fontSize: "0.9rem",
      color: "white",
      mt: 1,
    }}
    data-testid="hunt-preview-pane"
  />
);
