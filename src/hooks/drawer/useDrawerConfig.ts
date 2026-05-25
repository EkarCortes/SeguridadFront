import { Home, ListChecks, List, Users } from "lucide-react";

export const useDrawerConfig = () => {
    const drawerWidth = 220;
    const accentColor = "rgb(255, 255, 255)";
    const mutedText = "#94a3b8";
    const selectedBg = "rgba(255, 255, 255, 0.11)";
    const hoverBg = "rgba(255, 255, 255, 0.06)";

    const routeGroups = [
        { label: "Inicio",      icon: Home,       to: "/inicio" },
        { label: "Agregados",   icon: ListChecks, to: "/listaAgregados" },
        { label: "Ingresados",  icon: List,       to: "/listaIngresados" },
        { label: "Usuarios",    icon: Users,      to: "/user" },
    ];

    return { drawerWidth, accentColor, mutedText, selectedBg, hoverBg, routeGroups };
};
