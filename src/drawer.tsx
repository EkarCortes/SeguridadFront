import * as React from "react";
import { useState } from "react";
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
import { PanelLeftOpen, PanelLeftClose, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDrawer } from "./hooks/drawer/useDrawer";
import { useDrawerConfig } from "./hooks/drawer/useDrawerConfig";
import { useDrawerStyles } from "./hooks/drawer/useDrawerStyles";
import LogoutConfirmModal from "./components/LogoutConfirmModal";
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
    children: React.ReactNode;
    onLogout: () => Promise<void>;
}

export default function CustomDrawer({ onLogout, children }: CustomDrawerProps) {
    const { open, isMobile, handleOpenDrawer, handleCloseDrawer, handleNavigation } = useDrawer();
    const { drawerWidth, accentColor, mutedText, selectedBg, routeGroups } = useDrawerConfig();
    const {
        hamburgerButtonStyles,
        drawerStyles,
        closeButtonStyles,
        scrollBoxStyles,
        logoutButtonStyles,
        mainContentStyles,
    } = useDrawerStyles(drawerWidth, accentColor, selectedBg, open, isMobile);
    
    const location = useLocation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = async () => {
        setLogoutLoading(true);
        try {
            await onLogout(); 
        } catch (error) {
            console.error('Error en logout desde drawer:', error);
        } finally {
            setLogoutLoading(false);
            setShowLogoutModal(false);
        }
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    const getNavigationItemStyles = (isActive: boolean) => ({
        minHeight: 48,
        borderRadius: 2,
        mb: 1,
        justifyContent: open ? "initial" : "center",
        px: open ? 2.5 : 1.5,
        color: isActive ? accentColor : mutedText,
        background: isActive ? selectedBg : "transparent",
        "&:hover": {
            background: isActive ? selectedBg : "transparent",
            color: accentColor,
            transform: open ? "translateX(2px)" : "scale(1.06)",
            opacity: 0.95,
        },
        transition: "background 0.2s, color 0.2s, transform 0.15s ease, opacity 0.15s ease",
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
        <>
            <Box className="drawer-layout">
                {/* Botón hamburguesa */}
                {!open && (
                    <Box sx={hamburgerButtonStyles}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleOpenDrawer}
                            disableRipple
                            disableFocusRipple
                            disableTouchRipple
                            sx={{
                                color: accentColor,
                                background: "transparent",
                                "&:hover": {
                                    background: "transparent",
                                    color: accentColor,
                                    transform: "scale(1.08)",
                                    opacity: 0.9,
                                },
                                "&:active": { background: "transparent" },
                                "&.Mui-focusVisible": { background: "transparent" },
                                transition: "transform 0.15s ease, opacity 0.15s ease",
                            }}
                        >
                            <PanelLeftOpen size={22} strokeWidth={1.6} />
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
                                disableRipple
                                disableFocusRipple
                                disableTouchRipple
                                sx={closeButtonStyles}
                            >
                                <PanelLeftClose size={22} strokeWidth={1.6} />
                            </IconButton>
                        )}
                    </DrawerHeader>

                    <Divider sx={{ background: "#9ec5f1", mx: 2 }} />

                    <Box sx={scrollBoxStyles}>
                        <List>
                            {routeGroups.map((route) => {
                                const isActive = location.pathname === route.to;
                                const RouteIcon = route.icon;
                                return (
                                    <ListItem disablePadding sx={{ display: "block" }} key={route.label}>
                                        <ListItemButton
                                            component={Link}
                                            to={route.to}
                                            onClick={() => handleNavigation()}
                                            sx={getNavigationItemStyles(isActive)}
                                        >
                                            <ListItemIcon sx={getIconStyles()}>
                                                <RouteIcon size={20} strokeWidth={1.6} />
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

                    <Divider sx={{ background: "#9ec5f1", mx: 2 }} />

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
                            onClick={handleLogoutClick}
                            sx={{
                                ...logoutButtonStyles,
                                opacity: logoutLoading ? 0.6 : 1,
                                cursor: logoutLoading ? 'not-allowed' : 'pointer',
                                '&:disabled': {
                                    opacity: 0.6,
                                    cursor: 'not-allowed'
                                }
                            }}
                            disabled={logoutLoading}
                        >
                            {open ? (
                                <>
                                    <Box sx={{ display: "inline-flex", mr: 1 }}>
                                        <LogOut size={18} strokeWidth={1.6} />
                                    </Box>
                                    {logoutLoading ? 'Cerrando...' : 'Cerrar sesión'}
                                </>
                            ) : (
                                <LogOut size={20} strokeWidth={1.6} />
                            )}
                        </Box>
                    </Box>
                </MuiDrawer>

                <Box sx={mainContentStyles} className="drawer-content">
                    <Box className="drawer-panel">
                        {children}
                    </Box>
                </Box>
            </Box>

            <LogoutConfirmModal
                isOpen={showLogoutModal}
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
                loading={logoutLoading}
            />
        </>
    );
}