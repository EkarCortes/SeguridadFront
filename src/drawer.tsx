import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router-dom";
import { useDrawer } from "./hooks/drawer/useDrawer";
import { useDrawerConfig } from "./hooks/drawer/useDrawerConfig";
import { useDrawerStyles } from "./hooks/drawer/useDrawerStyles";
import './drawer.css';

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    position: "relative",
    padding: theme.spacing(0, 1),
    flexDirection: "column",
    textAlign: "center",
}));

interface CustomDrawerProps {
    onLogout: () => void;
    children: React.ReactNode;
}

export default function CustomDrawer({ onLogout, children }: CustomDrawerProps) {
    const { open, isMobile, handleOpenDrawer, handleCloseDrawer, handleNavigation } = useDrawer();
    const { drawerWidth, bgColor, accentColor, mutedText, selectedBg, paperColor, routeGroups } = useDrawerConfig();
    const {
        hamburgerButtonStyles,
        drawerStyles,
        closeButtonStyles,
        scrollBoxStyles,
        logoutButtonStyles,
        mainContentStyles,
    } = useDrawerStyles(drawerWidth, paperColor, accentColor, selectedBg, open, isMobile);
    
    const location = useLocation();

    const getNavigationItemStyles = (isActive: boolean) => ({
        minHeight: 48,
        borderRadius: 2,
        mb: 1,
        justifyContent: open ? "initial" : "center",
        px: 2.5,
        color: isActive ? accentColor : mutedText,
        background: isActive ? selectedBg : "transparent",
        "&:hover": {
            background: selectedBg,
            color: accentColor,
        },
        transition: "background 0.2s, color 0.2s",
    });

    const getIconStyles = () => ({
        color: accentColor,
        minWidth: 0,
        mr: open ? 3 : "auto",
        justifyContent: "center",
    });

    const getTextStyles = () => ({
        opacity: open ? 1 : 0,
        fontWeight: 700,
        fontSize: 18,
        color: accentColor,
    });

    return (
        <Box sx={{ display: "flex" }}>
            {/* Botón hamburguesa */}
            {!open && (
                <Box sx={hamburgerButtonStyles}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleOpenDrawer}
                        sx={{
                            color: accentColor,
                            "&:hover": { background: selectedBg, color: accentColor },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
            )}

            <MuiDrawer
                variant={isMobile ? "temporary" : "permanent"}
                open={open}
                onClose={handleCloseDrawer}
                ModalProps={{ keepMounted: true }}
                sx={drawerStyles}
            >
                <DrawerHeader>
                    {open && (
                        <IconButton
                            color="inherit"
                            aria-label="close drawer"
                            onClick={handleCloseDrawer}
                            sx={closeButtonStyles}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    )}
                </DrawerHeader>

                <Divider sx={{ background: "#27272a", mx: 2 }} />

                <Box sx={scrollBoxStyles}>
                    <List>
                        {routeGroups.map((route) => {
                            const isActive = location.pathname === route.to;
                            return (
                                <ListItem disablePadding sx={{ display: "block" }} key={route.label}>
                                    <ListItemButton
                                        component={Link}
                                        to={route.to}
                                        onClick={() => handleNavigation()}
                                        sx={getNavigationItemStyles(isActive)}
                                    >
                                        <ListItemIcon sx={getIconStyles()}>
                                            {<route.icon />}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={route.label}
                                            sx={getTextStyles()}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>

                <Divider sx={{ background: "#27272a", mx: 2 }} />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        px: 2,
                        pb: 3,
                    }}
                >
                    <Box
                        component="button"
                        onClick={onLogout}
                        sx={logoutButtonStyles}
                    >
                        {open ? (
                            <>
                                <LogoutIcon sx={{ mr: 1 }} />
                                Cerrar sesión
                            </>
                        ) : (
                            <LogoutIcon />
                        )}
                    </Box>
                </Box>
            </MuiDrawer>

            <Box sx={mainContentStyles}>
                <Box
                    sx={{
                        flex: 1,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "stretch",
                        justifyContent: "flex-start",
                        background: "transparent",
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
}