import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import React, { PropsWithChildren } from "react";

export interface FormModalProps {
  open: boolean;
  onClose: () => void;
  modalTitle: React.ReactNode;
}

export const ExitableModal = (props: PropsWithChildren<FormModalProps>) => (
  <Dialog open={props.open} fullWidth>
    <DialogTitle sx={{ p: 2, m: 0 }}>
      {props.modalTitle}
      <IconButton
        size="small"
        onClick={props.onClose}
        sx={{
          float: "right",
        }}
        aria-label="Close Modal"
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>{props.children}</DialogContent>
  </Dialog>
);
