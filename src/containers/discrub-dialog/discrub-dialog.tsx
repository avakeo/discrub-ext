import { useState, useEffect } from "react";
import MenuBar from "./components/menu-bar";
import CloseWindowButton from "./components/close-window-button";
import { Stack, Typography, Box } from "@mui/material";
import { useMessageSlice } from "../../features/message/use-message-slice";
import { useGuildSlice } from "../../features/guild/use-guild-slice";
import { useChannelSlice } from "../../features/channel/use-channel-slice";
import { useDmSlice } from "../../features/dm/use-dm-slice";
import { useAppSlice } from "../../features/app/use-app-slice";
import { useUserSlice } from "../../features/user/use-user-slice";
import { useTheme } from "@mui/material";
import Tags from "../tags/tags";
import ChannelMessages from "../channel-messages/channel-messages";
import DirectMessages from "../direct-messages/direct-messages";
import Settings from "./components/settings";
import { initializeSettings } from "../../services/chrome-service";
import { useExportSlice } from "../../features/export/use-export-slice.ts";
import version from "../../version.ts";

function DiscrubDialog() {
  const { palette } = useTheme();
  const [menuIndex, setMenuIndex] = useState(0);

  const { resetAdvancedFilters, resetMessageData, resetFilters } =
    useMessageSlice();

  const { setExportUserMap } = useExportSlice();
  const { resetGuild } = useGuildSlice();
  const { resetDm } = useDmSlice();
  const { resetChannel } = useChannelSlice();
  const { setDiscrubPaused, setSettings } = useAppSlice();

  const { getUserData } = useUserSlice();

  const handleChangeMenuIndex = async (index: number) => {
    resetAdvancedFilters();
    resetMessageData();
    resetGuild();
    resetDm();
    resetChannel();
    resetFilters();
    setDiscrubPaused(false);
    setMenuIndex(index);
  };

  useEffect(() => {
    const init = async () => {
      const settings = await initializeSettings();
      setSettings(settings);
      setExportUserMap(JSON.parse(settings.cachedUserMap));
    };
    getUserData();
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: palette.background.default,
        border: `1px solid ${palette.secondary.dark}`,
        wordWrap: "break-word",
        overflow: "hidden",
        borderRadius: "6px",
        boxShadow: "10px 11px 7px -1px rgba(0,0,0,0.41)",
        height: "615px",
        maxHeight: "615px",
        maxWidth: "720px",
        width: "720px",
        p: 0,
        m: 0,
      }}
    >
      <MenuBar menuIndex={menuIndex} setMenuIndex={handleChangeMenuIndex} />
      {menuIndex === 0 && <ChannelMessages />}
      {menuIndex === 1 && <DirectMessages />}
      {menuIndex === 2 && <Tags />}
      {menuIndex === 3 && <Settings />}

      <Box sx={{ position: "fixed", top: "23px", right: "310px", opacity: 1 }}>
        <Stack
          direction="row"
          alignContent="center"
          justifyContent="center"
          spacing={1}
        >
          <Typography color="primary.main" variant="body2">
            {version}
          </Typography>
        </Stack>
      </Box>
      <CloseWindowButton />
    </Box>
  );
}

export default DiscrubDialog;
