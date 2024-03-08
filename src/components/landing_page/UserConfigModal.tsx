import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { ExitableModal } from "src/components/reusable/ExitableModal";
import { ClueDisplayMode, UserConfig } from "src/types/progress";

export interface UserConfigModalProps {
  isOpen: boolean;
  userConfigState: UserConfig;
  setUserConfigState: (settings: UserConfig) => void;
  onClose: () => void;
}

export const UserConfigModal = (props: UserConfigModalProps) => {
  const { isOpen, userConfigState, setUserConfigState, onClose } = props;

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
          value={userConfigState.displayMode}
          label="Display Mode"
          labelId="display-mode-select-label"
          color="secondary"
          variant="outlined"
          onChange={(e: SelectChangeEvent) => {
            setUserConfigState({
              ...userConfigState,
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
