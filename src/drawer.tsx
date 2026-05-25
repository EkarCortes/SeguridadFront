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
import { PanelLeftOpen, PanelLeftClose, LogOut, Calendar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDrawer } from "./hooks/drawer/useDrawer";
import { useDrawerConfig } from "./hooks/drawer/useDrawerConfig";
import { useDrawerStyles } from "./hooks/drawer/useDrawerStyles";
import LogoutConfirmModal from "./components/LogoutConfirmModal";
import FaceCoreLogo from "./assets/FaceCore.png";
import './drawer.css';
import type { AuthResponse } from "./service/authService";

const DrawerHeader = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 66,
    padding: "0 14px 0 18px",
    flexShrink: 0,
}));

interface CustomDrawerProps {
    children: React.ReactNode;
    onLogout: () => Promise<void>;
}

export default function CustomDrawer({ onLogout, children }: CustomDrawerProps) {
    const { open, isMobile, handleOpenDrawer, handleCloseDrawer, handleNavigation } = useDrawer();
    const { drawerWidth, accentColor, mutedText, selectedBg, hoverBg, routeGroups } = useDrawerConfig();
    const {
        hamburgerButtonStyles,
        drawerStyles,
        scrollBoxStyles,
        logoutButtonStyles,
        mainContentStyles,
    } = useDrawerStyles(drawerWidth, accentColor, selectedBg, open, isMobile);

    const location = useLocation();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [topUser, setTopUser] = useState<{ username: string; rol: string } | null>(null);

    React.useEffect(() => {
        try {
            const storedAuth = localStorage.getItem('authMe');
            if (!storedAuth) return;
            const parsed = JSON.parse(storedAuth) as AuthResponse['data'];
            if (!parsed?.user?.username) return;
            setTopUser({ username: parsed.user.username, rol: parsed.user.rol });
        } catch {
            // ignore
        }
    }, []);

    const pageTitle = React.useMemo(() => {
        const matched = routeGroups.find((r) => r.to === location.pathname);
        if (matched) return matched.label;
        if (location.pathname.startsWith('/home') || location.pathname.startsWith('/inicio')) return 'Inicio';
        return 'Inicio';
    }, [location.pathname, routeGroups]);

    const dateLabel = React.useMemo(() => {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString('es-ES', { month: 'long' });
        return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}, ${now.getFullYear()}`;
    }, []);

    const handleLogoutClick = () => setShowLogoutModal(true);
    const handleLogoutCancel = () => setShowLogoutModal(false);

    const handleLogoutConfirm = async () => {
        setLogoutLoading(true);
        try {
            await onLogout();
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            setLogoutLoading(false);
            setShowLogoutModal(false);
        }
    };

    const getNavItemStyles = (isActive: boolean) => ({
        minHeight: 40,
        borderRadius: "10px",
        mb: 0.5,
        justifyContent: "flex-start",
        px: open ? 1.5 : 0,
        color: isActive ? "#ffffff" : mutedText,
        background: isActive ? selectedBg : "transparent",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
            background: isActive ? "rgba(255,255,255,0.15)" : hoverBg,
            color: "#ffffff",
        },
        transition: "background 0.15s ease, color 0.15s ease, padding 0.24s ease",
    });

    const getIconStyles = () => ({
        color: "inherit",
        minWidth: 0,
        mr: open ? 1.5 : 0,
        width: open ? "auto" : "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "margin-right 0.24s ease, width 0.24s ease",
    });

    const getTextStyles = () => ({
        opacity: open ? 1 : 0,
        maxWidth: open ? 180 : 0,
        overflow: "hidden",
        whiteSpace: "nowrap",
        flex: open ? "1 1 auto" : "0 0 auto",
        transition: "opacity 0.16s ease, max-width 0.24s ease",
        "& .MuiTypography-root": {
            fontWeight: 500,
            fontSize: 13.5,
            color: "inherit",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.01em",
        },
    });

    return (
        <>
            <Box className="drawer-layout">
                {/* Hamburguesa cuando está cerrado en desktop */}
                {!open && !isMobile && (
                    <Box sx={hamburgerButtonStyles}>
                        <IconButton
                            aria-label="abrir menú"
                            onClick={handleOpenDrawer}
                            disableRipple
                            disableFocusRipple
                            disableTouchRipple
                            sx={{
                                color: accentColor,
                                background: "transparent",
                                borderRadius: "8px",
                                width: 36,
                                height: 36,
                                "&:hover": { background: "rgba(255,255,255,0.08)" },
                                transition: "background 0.15s ease",
                            }}
                        >
                            <PanelLeftOpen size={20} strokeWidth={1.6} />
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
                        {open ? (
                            <>
                                <img
                                    src={FaceCoreLogo}
                                    alt="FaceCore"
                                    style={{
                                        height: 38,
                                        width: "auto",
                                        objectFit: "contain",
                                        opacity: 0.9,
                                        userSelect: "none",
                                        pointerEvents: "none",
                                    }}
                                />
                                <IconButton
                                    aria-label="cerrar menú"
                                    onClick={handleCloseDrawer}
                                    disableRipple
                                    disableFocusRipple
                                    disableTouchRipple
                                    sx={{
                                        color: accentColor,
                                        background: "transparent",
                                        borderRadius: "8px",
                                        width: 34,
                                        height: 34,
                                        flexShrink: 0,
                                        "&:hover": { background: "rgba(255,255,255,0.08)" },
                                        transition: "background 0.15s ease",
                                    }}
                                >
                                    <PanelLeftClose size={20} strokeWidth={1.6} />
                                </IconButton>
                            </>
                        ) : null}
                    </DrawerHeader>

                    <Divider sx={{ background: "rgba(255,255,255,0.1)", mx: 1.5 }} />

                    <Box sx={scrollBoxStyles}>
                        <List sx={{ p: 0 }}>
                            {routeGroups.map((route) => {
                                const isActive = location.pathname === route.to;
                                const RouteIcon = route.icon;
                                return (
                                    <ListItem disablePadding sx={{ display: "block" }} key={route.label}>
                                        <ListItemButton
                                            component={Link}
                                            to={route.to}
                                            onClick={() => handleNavigation()}
                                            sx={getNavItemStyles(isActive)}
                                            disableRipple
                                        >
                                            <ListItemIcon sx={getIconStyles()}>
                                                <RouteIcon size={18} strokeWidth={1.6} />
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

                    <Divider sx={{ background: "rgba(255,255,255,0.1)", mx: 1.5 }} />

                    <Box sx={{ display: "flex", justifyContent: "center", px: 1.5, pb: 2.5, pt: 1.5 }}>
                        <Box
                            component="button"
                            onClick={handleLogoutClick}
                            sx={{
                                ...logoutButtonStyles,
                                opacity: logoutLoading ? 0.6 : 1,
                                cursor: logoutLoading ? 'not-allowed' : 'pointer',
                            }}
                            disabled={logoutLoading}
                        >
                            <Box sx={{ display: "inline-flex", flexShrink: 0 }}>
                                <LogOut size={16} strokeWidth={1.6} />
                            </Box>
                            <Box
                                component="span"
                                sx={{
                                    ml: open ? 1 : 0,
                                    maxWidth: open ? 160 : 0,
                                    opacity: open ? 1 : 0,
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    transition: "opacity 0.16s ease, max-width 0.24s ease, margin-left 0.24s ease",
                                    transitionDelay: open ? "80ms" : "0ms",
                                }}
                            >
                                {logoutLoading ? 'Cerrando...' : 'Cerrar sesión'}
                            </Box>
                        </Box>
                    </Box>
                </MuiDrawer>

                <Box sx={mainContentStyles} className="drawer-content">
                    <Box className="drawer-panel">
                        <Box className="topbar">
                            <Box className="topbar-left">
                                {isMobile && (
                                    <IconButton
                                        aria-label="abrir menú"
                                        onClick={handleOpenDrawer}
                                        disableRipple
                                        size="small"
                                        sx={{
                                            color: "#0f172a",
                                            background: "transparent",
                                            borderRadius: "8px",
                                            width: 32,
                                            height: 32,
                                            flexShrink: 0,
                                            mr: 0.5,
                                            "&:hover": { background: "rgba(15,23,42,0.06)" },
                                        }}
                                    >
                                        <PanelLeftOpen size={18} strokeWidth={1.6} />
                                    </IconButton>
                                )}
                                <Box className="topbar-title">{pageTitle}</Box>
                                <Box className="topbar-separator" />
                                <Box className="topbar-date">
                                    <Calendar size={13} strokeWidth={1.6} />
                                    {dateLabel}
                                </Box>
                            </Box>

                            {topUser && (
                                <Box className="topbar-right">
                                    <Box className="topbar-userText">
                                        <Box className="topbar-username">{topUser.username}</Box>
                                        <Box className="topbar-role">{topUser.rol}</Box>
                                    </Box>
                                    <Box className="topbar-avatar">
                                        {topUser.username.slice(0, 1).toUpperCase()}
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        <Box className="page-content">
                            {children}
                        </Box>
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
