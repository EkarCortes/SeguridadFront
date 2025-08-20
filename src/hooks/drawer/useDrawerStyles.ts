import { useEffect } from 'react';

export const useDrawerStyles = (
    drawerWidth: number,
    paperColor: string,
    accentColor: string,
    selectedBg: string,
    open: boolean,
    isMobile: boolean
) => {
    // Aplicar estilos globales al body para evitar el fondo blanco
    useEffect(() => {
        document.body.style.backgroundColor = "#18181b";
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.documentElement.style.backgroundColor = "#18181b";
        
        return () => {
            // Cleanup no es necesario ya que estos estilos deben persistir
        };
    }, []);

    const hamburgerButtonStyles = {
        position: "fixed" as const,
        top: 20,
        left: 15,
        zIndex: 1401,
        background: "linear-gradient(135deg, #313136 0%, #1e1e24 100%)",
        borderRadius: "50%",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)",
        display: "block",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.4), 0 6px 16px rgba(0, 0, 0, 0.2)",
        },
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    };

    const drawerStyles = {
        display: "block",
        "& .MuiDrawer-paper": {
            background: "#23232a",
            color: accentColor,
            border: "none",
            boxShadow: open 
                ? "8px 0 32px rgba(0, 0, 0, 0.3), 4px 0 16px rgba(0, 0, 0, 0.15)" 
                : "4px 0 20px rgba(0, 0, 0, 0.25)",
            overflowX: "hidden",
            borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            ...(isMobile && {
                width: drawerWidth,
                borderRadius: "0 20px 20px 0",
            }),
            ...(!isMobile && {
                width: open ? drawerWidth : 72,
                transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                zIndex: 1300,
                borderRadius: open ? "0 16px 16px 0" : "0 20px 20px 0",
            }),
        },
    };

    const closeButtonStyles = {
        zIndex: 1,
        position: "absolute" as const,
        top: 20,
        right: 20,
        background: "rgba(79, 79, 89, 0.7)",
        color: accentColor,
        borderRadius: "50%",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        "&:hover": { 
            background: `linear-gradient(135deg, ${selectedBg} 0%, #23232a 100%)`,
            color: accentColor,
            transform: "scale(1.06)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        },
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        width: 38,
        height: 38,
    };

    const scrollBoxStyles = {
        flex: 1,
        overflowY: "auto" as const,
        overflowX: "hidden" as const,
        px: open ? 2 : 1,
        mt: 3,
        height: `calc(100vh - 100px - 16px - 90px)`,
        "&::-webkit-scrollbar": { 
            width: "6px",
            borderRadius: "3px",
        },
        "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "3px",
            margin: "8px 0",
        },
        "&::-webkit-scrollbar-thumb": { 
            background: "linear-gradient(180deg, #4a4a55 0%, #2a2a30 100%)",
            borderRadius: "3px",
            "&:hover": {
                background: "linear-gradient(180deg, #5a5a65 0%, #3a3a40 100%)",
            }
        },
        scrollbarWidth: "thin" as const,
        scrollbarColor: `#4a4a55 transparent`,
    };

    const logoutButtonStyles = {
        background: open 
            ? "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" 
            : "rgba(220, 38, 38, 0.8)",
        color: "#ffffff",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: open ? 12 : "50%",
        px: open ? 3 : 0,
        py: open ? 1.5 : 0,
        fontWeight: 600,
        fontSize: open ? 14 : 12,
        cursor: "pointer",
        boxShadow: "0 4px 15px rgba(220, 38, 38, 0.3), 0 2px 8px rgba(220, 38, 38, 0.15)",
        "&:hover": { 
            background: open 
                ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" 
                : "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
            transform: "translateY(-2px) scale(1.02)",
            boxShadow: "0 8px 25px rgba(220, 38, 38, 0.4), 0 4px 12px rgba(220, 38, 38, 0.2)",
        },
        width: open ? "auto" : 48,
        height: 48, // Altura fija igual que los otros botones
        minWidth: open ? 140 : 48,
        textAlign: "center" as const,
        marginTop: 2,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: open ? 1 : 0,
        backdropFilter: "blur(10px)",
        "& .MuiSvgIcon-root": {
            fontSize: open ? "1.2rem" : "1.4rem",
            transition: "font-size 0.3s ease",
        }
    };

    const mainContentStyles = {
        flex: 1,
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column" as const,
        ml: { xs: 0, sm: open ? `${drawerWidth}px` : "72px" },
        transition: "margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        background: "linear-gradient(135deg, #18181b 0%, #0f0f12 100%)",
        p: { xs: 2, sm: 4 },
        position: "relative",
        "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
            pointerEvents: "none",
        }
    };

    // Estilos específicos para los iconos cuando está cerrado
    const iconStyles = {
        color: accentColor,
        minWidth: 0,
        mr: open ? 3 : "auto",
        justifyContent: "center",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "& .MuiSvgIcon-root": {
            fontSize: open ? "1.3rem" : "1.6rem",
            filter: open ? "none" : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
        }
    };

    // Estilos para los botones de navegación - TODOS con el mismo tamaño
    const navigationButtonStyles = (isActive: boolean) => ({
        minHeight: 48, // Altura fija igual para todos
        maxHeight: 48, // Máxima altura fija para evitar que se estiren
        borderRadius: open ? 12 : "50%",
        mb: open ? 1 : 1.5,
        mx: open ? 0 : "auto",
        justifyContent: open ? "initial" : "center",
        px: open ? 2.5 : 0,
        width: open ? "100%" : 48,
        height: 48, // Altura fija exacta
        color: isActive ? "#ffffff" : accentColor,
        background: isActive 
            ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
            : "transparent",
        border: isActive 
            ? "1px solid rgba(59, 130, 246, 0.3)" 
            : "1px solid transparent",
        backdropFilter: isActive ? "blur(10px)" : "none",
        boxShadow: isActive 
            ? "0 4px 15px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(59, 130, 246, 0.15)"
            : "none",
        "&:hover": {
            background: isActive 
                ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
            color: "#ffffff",
            transform: "translateY(-1px) scale(1.02)",
            boxShadow: isActive 
                ? "0 8px 25px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(59, 130, 246, 0.2)"
                : "0 4px 15px rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        // Forzar que los elementos internos no cambien la altura
        "& .MuiListItemText-root": {
            margin: 0,
            "& .MuiTypography-root": {
                lineHeight: 1,
            }
        },
        "& .MuiListItemIcon-root": {
            minWidth: open ? "auto" : 0,
            margin: 0,
        }
    });

    return {
        hamburgerButtonStyles,
        drawerStyles,
        closeButtonStyles,
        scrollBoxStyles,
        logoutButtonStyles,
        mainContentStyles,
        iconStyles,
        navigationButtonStyles,
    };
};