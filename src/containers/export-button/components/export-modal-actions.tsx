import { Button, DialogActions } from "@mui/material";
import PauseButton from "../../../components/pause-button";
import CancelButton from "../../../components/cancel-button";

type ActionsProps = {
  onExport: () => void;
  onCancel: () => void;
  exportDisabled: boolean;
  pauseDisabled: boolean;
};

const ExportModalActions = ({
  onExport,
  onCancel,
  exportDisabled,
  pauseDisabled,
}: ActionsProps) => (
  <DialogActions>
    <CancelButton onCancel={onCancel} />
    <PauseButton disabled={pauseDisabled} />
    <Button
      disabled={exportDisabled}
      variant="contained"
      disableElevation
      onClick={onExport}
    >
      Export
    </Button>
  </DialogActions>
);

export default ExportModalActions;
