import { useEffect } from 'react';

// Hook para gestionar los estilos de un drawer (cajón lateral) responsivo

export const useDrawerStyles = (
    drawerWidth: number,
    accentColor: string,
    _selectedBg: string,
    open: boolean,
    isMobile: boolean
) => {
    const collapsedWidth = 56;

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
        top: 18,
        left: 0,
        width: collapsedWidth,
        zIndex: 1401,
        display: "flex",
        background: "transparent",
        borderRadius: 0,
        transition: "none",
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
            borderRight: "1px solid #262c3e",
            ...(isMobile && {
                width: drawerWidth,
            }),
            ...(!isMobile && {
                width: open ? drawerWidth : collapsedWidth,
                transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                zIndex: 1300,
            }),
        },
    };

    const closeButtonStyles = {
        zIndex: 1,
        position: "absolute" as const,
        top: 20,
        right: 20,
        background: "transparent",
        color: accentColor,
        borderRadius: 0,
        backdropFilter: "none",
        "&:hover": { 
            background: "transparent",
            transform: "none",
        },
        "&.Mui-focusVisible": {
            background: "transparent",
        },
        transition: "none",
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
            width: "8px",
        },
        "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.06)",
            borderRadius: "999px",
            margin: "10px 0",
        },
        "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.22)",
            borderRadius: "999px",
            "&:hover": {
                background: "rgba(255, 255, 255, 0.32)",
            }
        },
        scrollbarWidth: "thin" as const,
        scrollbarColor: "rgba(255, 255, 255, 0.22) rgba(255, 255, 255, 0.06)",
    };

    const logoutButtonStyles = {
        background: "rgb(223, 67, 67)",
        color: "#ffffff",
        borderRadius: open ? 12 : "50%",
        px: open ? 3 : 0,
        py: open ? 1.5 : 0,
        fontWeight: 600,
        fontSize: open ? 14 : 12,
        cursor: "pointer",
        "&:hover": { 
            background:"linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            transform: "translateY(-2px) scale(1.02)",
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
        ml: { xs: 0, sm: open ? `${drawerWidth}px` : `${collapsedWidth}px` },
        transition: "margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        background: "transparent",
        p: 0,
       
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
    

    return {
        hamburgerButtonStyles,
        drawerStyles,
        closeButtonStyles,
        scrollBoxStyles,
        logoutButtonStyles,
        mainContentStyles,
        iconStyles,
    };
};