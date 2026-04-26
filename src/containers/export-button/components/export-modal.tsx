import { Dialog } from "@mui/material";
import ExportModalActions from "./export-modal-actions";
import React from "react";
import EnhancedDialogTitle from "../../../common-components/enhanced-dialog/enhanced-dialog-title.tsx";

type ExportModalProps = {
  onExport: () => void;
  onCancel: () => void;
  dialogOpen: boolean;
  exportDisabled: boolean;
  pauseDisabled: boolean;
  ContentComponent: React.ReactNode;
  dialogTitle: string;
};

const ExportModal = ({
  dialogOpen,
  onExport,
  exportDisabled,
  pauseDisabled,
  onCancel,
  ContentComponent,
  dialogTitle,
}: ExportModalProps) => {
  return (
    <Dialog
      hideBackdrop
      PaperProps={{ sx: { minWidth: "500px", minHeight: "500px" } }}
      open={dialogOpen}
    >
      <EnhancedDialogTitle title={dialogTitle} onClose={onCancel} />
      {ContentComponent}
      <ExportModalActions
        onExport={onExport}
        exportDisabled={exportDisabled}
        pauseDisabled={pauseDisabled}
        onCancel={onCancel}
      />
    </Dialog>
  );
};

export default ExportModal;
