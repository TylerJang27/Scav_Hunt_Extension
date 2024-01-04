import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React from "react";
import { ExitableModal } from "src/components/reusable/ExitableModal";
import { ClueDisplayMode } from "src/types/progress";

export interface HuntSettings {
  displayMode: ClueDisplayMode;
}

export interface HuntSettingsModalProps {
  isOpen: boolean;
  settingsState: HuntSettings;
  setSettingsState: (settings: HuntSettings) => void;
  onClose: () => void;
}

export const HuntSettingsModal = (props: HuntSettingsModalProps) => {
  const { isOpen, settingsState, setSettingsState, onClose } = props;

  return (
    <ExitableModal
      open={isOpen}
      onClose={() => {
        onClose();
      }}
      modalTitle="Hunt Settings"
    >
      <FormControl fullWidth>
        <InputLabel id="display-mode">Display Mode</InputLabel>
        <Select
          id="hunt-display-mode-select"
          data-testid="hunt-display-mode-select"
          value={settingsState.displayMode}
          label="Display Mode"
          labelId="display-mode-select-label"
          color="secondary"
          variant="outlined"
          onChange={(e: SelectChangeEvent) => {
            setSettingsState({
              ...settingsState,
              displayMode: e.target.value as ClueDisplayMode,
            });
            // NOTE(Tyler): If we add other settings, or we want to make this save on edit, we should reconsider this.
            onClose();
          }}
        >
          <MenuItem key={"Overlay"} value={"Overlay"}>
            Overlay
          </MenuItem>
          <MenuItem key={"Tab"} value={"Tab"}>
            Open Tab
          </MenuItem>
        </Select>
      </FormControl>
    </ExitableModal>
  );
};
