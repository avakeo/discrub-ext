import { useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useExportSlice } from "../../../features/export/use-export-slice";
import { useAppSlice } from "../../../features/app/use-app-slice";
import { useMessageSlice } from "../../../features/message/use-message-slice";

const MenuBar = ({
  menuIndex,
  setMenuIndex,
}: {
  menuIndex: number;
  setMenuIndex: (index: number) => Promise<void>;
}) => {
  const { state: exportState } = useExportSlice();
  const isExporting = exportState.isExporting();
  const isGenerating = exportState.isGenerating();

  const { state: appState } = useAppSlice();
  const task = appState.task();
  const { active } = task || {};

  const { state: messageState } = useMessageSlice();
  const isLoading = messageState.isLoading();

  const menuDisabled = !!(isExporting || isGenerating || active || isLoading);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | Maybe>(null);
  const menuOpen = !!anchorEl;

  const menuItems = [
    { name: "Channel Messages", icon: <ChatIcon /> },
    { name: "Direct Messages", icon: <EmailIcon /> },
    { name: "Tags", icon: <LoyaltyIcon /> },
    { name: "Settings", icon: <ManageAccountsIcon /> },
  ];

  const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <Box
      sx={{ marginLeft: "5px !important", marginTop: "5px !important" }}
      display="flex"
    >
      <Button
        disabled={menuDisabled}
        color="secondary"
        startIcon={menuOpen ? <MenuOpenIcon /> : <MenuIcon />}
        onClick={handleMenuClick}
      >
        Menu
      </Button>

      <Menu
        sx={{ textTransform: "none" }}
        open={menuOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {menuItems.map((menuItem, i) => (
          <MenuItem
            key={menuItem.name}
            disabled={menuIndex === i}
            onClick={() => {
              setMenuIndex(i);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>{menuItem.icon}</ListItemIcon>
            <ListItemText>{menuItem.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default MenuBar;
