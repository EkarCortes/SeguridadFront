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
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Link, useLocation } from "react-router-dom";
import './drawer.css';

// Colores del login
const drawerWidth = 270;
const bgColor = "#18181b"; // bg-neutral-950
const accentColor = "#fff"; // text-white
const mutedText = "#a3a3a3"; // text-neutral-400
const selectedBg = "#3f3f46"; // un gris más claro para selección
const paperColor = "#23232a"; // Agrega esta línea para definir el color del Drawer

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

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    "& .MuiDrawer-paper": {
        background: paperColor,
        color: accentColor,
        border: "none",
        boxShadow: "2px 0 12px #0004",
        width: open ? drawerWidth : 64,
        transition: theme.transitions.create(["width", "background", "color"], {
            easing: theme.transitions.easing.easeInOut,
            duration: 500,
        }),
        overflowX: "hidden",
        [theme.breakpoints.up("sm")]: {
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 1300,
        },
        [theme.breakpoints.down("sm")]: {
            width: drawerWidth,
            position: "relative",
        },
    },
}));

// Ejemplo de rutas (ajusta según tus necesidades)
const routeGroups = [
    {
        label: "Inicio",
        icon: <HomeIcon />,
        to: "/main",
    },
    {
        label: "Lista de Agregados",
        icon: <PlaylistAddCheckIcon />,
        to: "/listaAgregados",
    },
    {
        label: "Form de Agregar",
        icon: <AddBoxIcon />,
        to: "/formAgregados",
    },
    {
        label: "Lista de Ingresados",
        icon: <ListAltIcon />,
        to: "/listaIngresados",
    },
   
   
];

interface CustomDrawerProps {
    onLogout: () => void;
    children: React.ReactNode;
}

export default function CustomDrawer({ onLogout, children }: CustomDrawerProps) {
    const [open, setOpen] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
    const location = useLocation();

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) setOpen(false);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", background: bgColor }}>
            {/* Botón hamburguesa */}
            {!open && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 16,
                        left: 16,
                        zIndex: 1401,
                        background: paperColor,
                        borderRadius: "50%",
                        boxShadow: "0 2px 8px #0003",
                        display: "block",
                        backgroundColor: "#313136",
                    }}
                >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setOpen(true)}
                        sx={{
                            color: accentColor,
                            "&:hover": { background: selectedBg, color: accentColor },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
            )}
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={open}
                onClose={() => setOpen(false)}
                ModalProps={{ keepMounted: true }}
            >
                <DrawerHeader>
                    {open && (
                        <IconButton
                            color="inherit"
                            aria-label="close drawer"
                            onClick={() => setOpen(false)}
                            sx={{
                                zIndex: 1,
                                position: "absolute",
                                top: 16,
                                right: 16,
                                background: paperColor,
                                color: accentColor,
                                "&:hover": { background: selectedBg, color: accentColor },
                            }}
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    )}
                </DrawerHeader>
                <Divider sx={{ background: "#27272a", mx: 2 }} />
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        overflowX: "hidden",
                        px: 0,
                        mt: 2,
                        height: `calc(100vh - 80px - 8px - 80px)`,
                        "&::-webkit-scrollbar": { width: "8px" },
                        "&::-webkit-scrollbar-thumb": { background: "#18181b" },
                        scrollbarWidth: "thin",
                        scrollbarColor: `#18181b ${paperColor}`,
                    }}
                >
                    <List>
                        {routeGroups.map((route) => (
                            <ListItem disablePadding sx={{ display: "block" }} key={route.label}>
                                <ListItemButton
                                    component={Link}
                                    to={route.to}
                                    sx={{
                                        minHeight: 48,
                                        borderRadius: 2,
                                        mb: 1,
                                        justifyContent: open ? "initial" : "center",
                                        px: 2.5,
                                        color:
                                            location.pathname === route.to
                                                ? accentColor
                                                : mutedText,
                                        background:
                                            location.pathname === route.to
                                                ? selectedBg
                                                : "transparent",
                                        "&:hover": {
                                            background: selectedBg,
                                            color: accentColor,
                                        },
                                        transition: "background 0.2s, color 0.2s",
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: accentColor,
                                            minWidth: 0,
                                            mr: open ? 3 : "auto",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {route.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={route.label}
                                        sx={{
                                            opacity: open ? 1 : 0,
                                            fontWeight: 700,
                                            fontSize: 18,
                                            color: accentColor,
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
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
                    <div
                        onClick={onLogout}
                        className={`cursor-pointer font-bold text-white flex items-center justify-center gap-2 shadow-md transition-colors duration-200 mt-2 rounded px-${open ? "6" : "2"} py-2 hover:bg-[#3f3f46]`}
                        style={{
                            background: "",
                            border: "none",
                            width: open ? "auto" : 44,
                            textAlign: "center",
                            fontSize: 16,
                            padding: open ? "8px 16px" : "8px",
                            backgroundColor: "#313136"
                        }}
                    >
                        {open ? (
                            <>
                                <LogoutIcon sx={{ marginRight: 8 }} />
                                Cerrar sesión
                            </>
                        ) : (
                            <LogoutIcon />
                        )}
                    </div>
                </Box>
            </Drawer>
            {/* Contenido principal */}
            <Box
                sx={{
                    flex: 1,
                    minHeight: "100vh",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    // Solo aplica marginLeft cuando NO es móvil y el Drawer está abierto
                    marginLeft: { sm: open ? `${drawerWidth}px` : '64px', xs: 0 },
                    transition: "margin-left 0.3s",
                    background: bgColor,
                    p: { xs: 1, sm: 4 },
                }}
            >
                {/* Aquí se cargan dinámicamente las pantallas */}
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