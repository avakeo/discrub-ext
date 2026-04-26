import {
  Checkbox,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { ExportType } from "../../../enum/export-type";
import { MediaType } from "../../../enum/media-type";
import { DiscrubSetting } from "../../../enum/discrub-setting";
import { AppSettings } from "../../../features/app/app-types";
import { setSetting } from "../../../services/chrome-service";

type ExportFormatConfigProps = {
  selectedFormat: ExportType;
  onFormatChange: (format: ExportType) => void;
  settings: AppSettings;
  onChangeSettings: (settings: AppSettings) => void;
  isDm?: boolean;
};

const DISCORD_MEDIA = [
  { value: MediaType.IMAGES, label: "Images" },
  { value: MediaType.VIDEOS, label: "Videos" },
  { value: MediaType.AUDIO, label: "Audio" },
];
const EMBED_MEDIA = [
  { value: MediaType.EMBEDDED_IMAGES, label: "Images" },
  { value: MediaType.EMBEDDED_VIDEOS, label: "Videos" },
];

const FORMAT_LABELS: Record<ExportType, string> = {
  [ExportType.JSON]: "JSON",
  [ExportType.HTML]: "HTML",
  [ExportType.CSV]: "CSV",
  [ExportType.MEDIA]: "Media Only",
  [ExportType.IMAGES]: "Images Only",
};

const MediaCheckboxGroup = ({
  title,
  types,
  active,
  onToggle,
}: {
  title: string;
  types: { value: MediaType; label: string }[];
  active: string[];
  onToggle: (value: MediaType) => void;
}) => (
  <Stack>
    <Typography variant="caption" color="text.secondary">
      {title}
    </Typography>
    {types.map(({ value, label }) => (
      <FormControlLabel
        key={value}
        sx={{ m: 0 }}
        control={
          <Checkbox
            size="small"
            checked={active.includes(value)}
            onChange={() => onToggle(value)}
          />
        }
        label={<Typography variant="body2">{label}</Typography>}
      />
    ))}
  </Stack>
);

const ExportFormatConfig = ({
  selectedFormat,
  onFormatChange,
  settings,
  onChangeSettings,
}: ExportFormatConfigProps) => {
  const downloadMedia = settings[DiscrubSetting.EXPORT_DOWNLOAD_MEDIA]
    ? settings[DiscrubSetting.EXPORT_DOWNLOAD_MEDIA].split(",").filter(Boolean)
    : [];
  const previewMedia = settings[DiscrubSetting.EXPORT_PREVIEW_MEDIA]
    ? settings[DiscrubSetting.EXPORT_PREVIEW_MEDIA].split(",").filter(Boolean)
    : [];

  const toggleMedia = async (
    setting: DiscrubSetting,
    current: string[],
    value: MediaType,
  ) => {
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    const newSettings = await setSetting(setting, updated.join(","));
    onChangeSettings(newSettings);
  };

  const isTextFormat =
    selectedFormat !== ExportType.MEDIA && selectedFormat !== ExportType.IMAGES;

  return (
    <Stack spacing={1.5} sx={{ pt: 1 }}>
      <Stack>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
          FORMAT
        </Typography>
        <RadioGroup
          row
          value={selectedFormat}
          onChange={(e) => onFormatChange(e.target.value as ExportType)}
          sx={{ gap: 0.5 }}
        >
          {Object.values(ExportType).map((t) => (
            <FormControlLabel
              key={t}
              value={t}
              sx={{ m: 0 }}
              control={<Radio size="small" />}
              label={<Typography variant="body2">{FORMAT_LABELS[t]}</Typography>}
            />
          ))}
        </RadioGroup>
      </Stack>

      {isTextFormat && (
        <>
          <Divider />
          <Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              DOWNLOAD MEDIA
            </Typography>
            <Stack direction="row" spacing={3}>
              <MediaCheckboxGroup
                title="Discord"
                types={DISCORD_MEDIA}
                active={downloadMedia}
                onToggle={(v) =>
                  toggleMedia(
                    DiscrubSetting.EXPORT_DOWNLOAD_MEDIA,
                    downloadMedia,
                    v,
                  )
                }
              />
              <MediaCheckboxGroup
                title="Embed"
                types={EMBED_MEDIA}
                active={downloadMedia}
                onToggle={(v) =>
                  toggleMedia(
                    DiscrubSetting.EXPORT_DOWNLOAD_MEDIA,
                    downloadMedia,
                    v,
                  )
                }
              />
            </Stack>
          </Stack>
        </>
      )}

      {selectedFormat === ExportType.HTML && (
        <>
          <Divider />
          <Stack>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              PREVIEW MEDIA
            </Typography>
            <Stack direction="row" spacing={3}>
              <MediaCheckboxGroup
                title="Discord"
                types={DISCORD_MEDIA}
                active={previewMedia}
                onToggle={(v) =>
                  toggleMedia(
                    DiscrubSetting.EXPORT_PREVIEW_MEDIA,
                    previewMedia,
                    v,
                  )
                }
              />
              <MediaCheckboxGroup
                title="Embed"
                types={EMBED_MEDIA}
                active={previewMedia}
                onToggle={(v) =>
                  toggleMedia(
                    DiscrubSetting.EXPORT_PREVIEW_MEDIA,
                    previewMedia,
                    v,
                  )
                }
              />
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default ExportFormatConfig;
