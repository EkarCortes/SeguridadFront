import { useEffect } from 'react';

// Hook para gestionar los estilos de un drawer (cajón lateral) responsivo

export const useDrawerStyles = (
    drawerWidth: number,
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
        background: "rgb(117, 116, 116)",
        borderRadius: "50%",
        display: "block",
        "&:hover": {
            transform: "scale(1.05)",
            
        },
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    };

    const drawerStyles = {
        display: "block",
        "& .MuiDrawer-paper": {
            background: "#262c3e",
            color: accentColor,
            border: "none",
            overflowX: "hidden",
            borderRight: "1px solid #0F172A",
            ...(isMobile && {
                width: drawerWidth,
            }),
            ...(!isMobile && {
                width: open ? drawerWidth : 72,
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
        background: "rgb(184, 184, 184)",
        color: accentColor,
        borderRadius: "50%",
        backdropFilter: "blur(8px)",
        "&:hover": { 
            background: selectedBg,
            color: accentColor,
            transform: "scale(1.06)",
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
            background: "rgb(0, 255, 179)",
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
        ml: { xs: 0, sm: open ? `${drawerWidth}px` : "72px" },
        transition: "margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        background: "#e4e7f7",
        p: { xs: 2, sm: 4 },
       
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