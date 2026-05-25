import { useEffect } from 'react';

export const useDrawerStyles = (
    drawerWidth: number,
    accentColor: string,
    _selectedBg: string,
    open: boolean,
    isMobile: boolean
) => {
    const collapsedWidth = 56;

    useEffect(() => {
        document.body.style.backgroundColor = "#262c3e";
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.documentElement.style.backgroundColor = "#262c3e";
    }, []);

    const hamburgerButtonStyles = {
        position: "fixed" as const,
        top: 14,
        left: 0,
        width: collapsedWidth,
        zIndex: 1401,
        display: "flex",
        background: "transparent",
        alignItems: "center",
        justifyContent: "center",
    };

    const drawerStyles = {
        display: "block",
        "& .MuiDrawer-paper": {
            background: "#262c3e",
            color: accentColor,
            border: "none",
            overflowX: "hidden",
            willChange: "width",
            boxShadow: "none",
            ...(isMobile
                ? { width: Math.min(drawerWidth, 240) }
                : {
                    width: open ? drawerWidth : collapsedWidth,
                    transition: "width 240ms cubic-bezier(0.4, 0, 0.6, 1)",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    zIndex: 1300,
                }
            ),
        },
    };

    const closeButtonStyles = {
        position: "absolute" as const,
        top: 16,
        right: 14,
        color: accentColor,
        background: "transparent",
        borderRadius: "8px",
        width: 34,
        height: 34,
        "&:hover": { background: "rgba(255,255,255,0.08)" },
        "&.Mui-focusVisible": { background: "transparent" },
        transition: "background 0.15s ease",
    };

    const scrollBoxStyles = {
        flex: 1,
        overflowY: "auto" as const,
        overflowX: "hidden" as const,
        px: open ? 1.5 : 0.75,
        mt: 2,
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.15)",
            borderRadius: "999px",
        },
        scrollbarWidth: "thin" as const,
        scrollbarColor: "rgba(255,255,255,0.15) transparent",
        transition: "padding 0.24s ease",
    };

    const logoutButtonStyles = {
        background: "transparent",
        color: "rgba(239, 68, 68, 0.9)",
        border: "1px solid rgba(239, 68, 68, 0.4)",
        borderRadius: "10px",
        px: open ? 2 : 0,
        py: 0,
        fontWeight: 600,
        fontSize: 13,
        fontFamily: "'Inter', sans-serif",
        cursor: "pointer",
        "&:hover": {
            background: "rgba(239, 68, 68, 0.1)",
            borderColor: "rgba(239, 68, 68, 0.7)",
        },
        width: open ? "100%" : 40,
        height: 40,
        marginTop: 2,
        transition: "background 0.15s ease, border-color 0.15s ease, width 0.24s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: open ? 1 : 0,
        userSelect: "none" as const,
    };

    // Usa isMobile directamente en lugar de breakpoints MUI para evitar el desfase
    const mainContentStyles = {
        flex: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column" as const,
        ml: isMobile ? 0 : `${open ? drawerWidth : collapsedWidth}px`,
        transition: "margin-left 240ms cubic-bezier(0.4, 0, 0.6, 1)",
        willChange: "margin-left",
        background: "transparent",
        p: 0,
    };

    return {
        hamburgerButtonStyles,
        drawerStyles,
        closeButtonStyles,
        scrollBoxStyles,
        logoutButtonStyles,
        mainContentStyles,
        collapsedWidth,
    };
};
