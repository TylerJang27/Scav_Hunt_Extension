import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ExitableModal } from "src/components/reusable/ExitableModal";
import { ClueConfig, IntractiveConfig } from "src/types/hunt_config";
import { ParseClue } from "src/utils/parse";

export interface CreateClueModalProps {
  isOpen: boolean;
  createdClue: ClueConfig;
  setCreatedClue: (clue: ClueConfig) => void;
  onSave: (clue: ClueConfig) => void;
  onClose: () => void;
}

export const CreateClueModal = (props: CreateClueModalProps) => {
  const { isOpen, createdClue, setCreatedClue, onSave, onClose } = props;
  const [createdClueError, setCreatedClueError] = useState<
    string | undefined
  >();

  useEffect(() => {
    // When the modal is first open, discard any outstanding errors.
    if (isOpen) {
      setCreatedClueError(undefined);
    }
  }, [isOpen]);

  return (
    <ExitableModal
      open={isOpen}
      onClose={() => {
        onClose();
        setCreatedClueError(undefined);
      }}
      modalTitle="Create New Clue"
    >
      <FormControl sx={{ display: "flex" }}>
        <FormControl>
          <TextField
            label="URL"
            variant="outlined"
            required
            error={
              Boolean(createdClueError) && createdClue.url.trim().length === 0
            }
            value={createdClue.url}
            onChange={(e) => {
              setCreatedClue({ ...createdClue, url: e.target.value });
            }}
            sx={{ mt: 1 }}
            aria-describedby="url-helper-text"
            data-testid="clue-url-field"
          />
          <FormHelperText id="url-helper-text">
            Regex or substring match
          </FormHelperText>
        </FormControl>
        <FormControl>
          <TextField
            label="Text"
            variant="outlined"
            multiline
            required
            error={
              Boolean(createdClueError) &&
              (createdClue.text ?? "").trim().length === 0
            }
            value={createdClue.text}
            onChange={(e) => {
              setCreatedClue({ ...createdClue, text: e.target.value });
            }}
            sx={{ mt: 1 }}
            aria-describedby="text-helper-text"
            data-testid="clue-text-field"
          />
          <FormHelperText id="text-helper-text">
            Clue to display when this URL is visited
          </FormHelperText>
        </FormControl>
        <FormControl>
          <TextField
            label="Image URL"
            variant="outlined"
            value={createdClue.image}
            onChange={(e) => {
              setCreatedClue({ ...createdClue, image: e.target.value });
            }}
            sx={{ mt: 1 }}
            aria-describedby="image-url-helper-text"
          />
          <FormHelperText id="image-url-helper-text">
            Optional image to display when this URL is visited
          </FormHelperText>
        </FormControl>
        <FormControl>
          <TextField
            label="Image Alt"
            variant="outlined"
            value={createdClue.alt}
            onChange={(e) => {
              setCreatedClue({ ...createdClue, alt: e.target.value });
            }}
            sx={{ mt: 1 }}
            aria-describedby="image-alt-helper-text"
          />
          <FormHelperText id="image-alt-helper-text">
            Alt text for the above image
          </FormHelperText>
        </FormControl>
        <FormControl>
          <TextField
            label="Interactive Prompt"
            variant="outlined"
            value={createdClue.interactive?.prompt}
            onChange={(e) => {
              setCreatedClue({
                ...createdClue,
                interactive: {
                  ...createdClue.interactive,
                  prompt: e.target.value,
                } as IntractiveConfig,
              });
            }}
            sx={{ mt: 1 }}
            multiline
            aria-describedby="prompt-helper-text"
            data-testid="clue-prompt-field"
          />
          <FormHelperText id="prompt-helper-text">
            An optional question the user must answer before viewing the clue
            text
          </FormHelperText>
        </FormControl>
        <FormControl>
          <TextField
            label="Interactive Key"
            variant="outlined"
            value={createdClue.interactive?.key}
            onChange={(e) => {
              setCreatedClue({
                ...createdClue,
                interactive: {
                  ...createdClue.interactive,
                  key: e.target.value,
                },
              });
            }}
            required={Boolean(createdClue.interactive?.prompt) ?? false}
            error={
              Boolean(createdClueError) &&
              Boolean(createdClue.interactive?.prompt) &&
              (createdClue.interactive?.prompt ?? "").trim().length === 0
            }
            sx={{ mt: 1 }}
            aria-describedby="key-helper-text"
            data-testid="clue-key-field"
          />
          <FormHelperText id="key-helper-text">
            Case-sensitive answer to the prompt
          </FormHelperText>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => {
            try {
              // Validate the clue and check for errors
              ParseClue(createdClue);
              onSave(createdClue);
              setCreatedClueError(undefined);
            } catch (err: any) {
              // trunk-ignore(eslint)
              setCreatedClueError(err.message);
            }
          }}
          data-testid="clue-save-button"
        >
          Save
        </Button>
        {createdClueError && <Alert severity="error">{createdClueError}</Alert>}
      </FormControl>
    </ExitableModal>
  );
};
