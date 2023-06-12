"use client"

import GridIcon from "@mui/icons-material/GridViewRounded";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import MuiAppBar from "@mui/material/AppBar";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar/AppBar";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import React from "react";

import { selectCurrentBuilding } from "../redux/currentBuildingSlice";
import { useSelector } from "../redux/hooks";
import { drawerWidth } from "../views/BuildingDrawer";
import Branding from "./Branding";
import IconButton from "./IconButton";

interface NavBarProps {
  setSearchOpen: (open: boolean) => void;
}

// This isn't actually enforced so update this if u change the navbar
export const navHeight = 65;

const NavBar: React.FC<NavBarProps> = ({
  setSearchOpen
}) => {
  const path = usePathname();
  const currentBuilding = useSelector(selectCurrentBuilding);
  const drawerOpen = !!currentBuilding;

  return (
    <AppBar
      position="fixed"
      drawerOpen={drawerOpen}
      sx={{
        borderBottom: "1px solid #e0e0e0",
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Branding />
      <Stack direction="row" spacing={1}>
        <IconButton
          aria-label="Open search"
          onClick={() => setSearchOpen(true)}
        >
          <SearchIcon/>
        </IconButton>
        <IconButton
          aria-label="Browse buildings"
          active={path === "/browse"}
          href="/browse"
        >
          <GridIcon/>
        </IconButton>
        <IconButton
          aria-label="Go to map"
          active={path === "/map"}
          href="/map"
        >
          <MapIcon/>
        </IconButton>
      </Stack>
    </AppBar>
  )
}

interface AppBarProps extends MuiAppBarProps {
  drawerOpen?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "drawerOpen",
})<AppBarProps>(({ theme, drawerOpen }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.getContrastText(theme.palette.background.default),
  boxShadow: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0.5, 2),
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(drawerOpen && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default NavBar;
