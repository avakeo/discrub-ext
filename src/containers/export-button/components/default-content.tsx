import { DialogContent, DialogContentText, Typography } from "@mui/material";
import ExportProgress from "./export-progress.tsx";
import { AppSettings } from "../../../features/app/app-types";
import EnhancedTabs, {
  EnhancedTab,
} from "../../../common-components/enhanced-tabs/enhanced-tabs.tsx";
import ExportFormatConfig from "./export-format-config.tsx";
import { ExportType } from "../../../enum/export-type.ts";

type DefaultContentProps = {
  isExporting: boolean;
  messageCount: number;
  isDm: boolean;
  settings: AppSettings;
  onChangeSettings: (settings: AppSettings) => void;
  selectedFormat: ExportType;
  onFormatChange: (format: ExportType) => void;
};

const DefaultContent = ({
  isExporting,
  messageCount,
  isDm,
  settings,
  onChangeSettings,
  selectedFormat,
  onFormatChange,
}: DefaultContentProps) => {
  const exportTab: EnhancedTab = {
    label: "Export",
    getComponent: () => (
      <ExportFormatConfig
        selectedFormat={selectedFormat}
        onFormatChange={onFormatChange}
        settings={settings}
        onChangeSettings={onChangeSettings}
        isDm={isDm}
      />
    ),
  };

  return (
    <DialogContent>
      {!isExporting && (
        <>
          <DialogContentText mb={1}>
            <Typography variant="h6">
              <strong>{messageCount}</strong> messages are available to export
            </Typography>
          </DialogContentText>
          <EnhancedTabs tabs={[exportTab]} />
        </>
      )}
      {isExporting && <ExportProgress />}
    </DialogContent>
  );
};

export default DefaultContent;
