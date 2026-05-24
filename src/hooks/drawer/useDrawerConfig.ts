import { Home, ListChecks, List, Users } from "lucide-react";

// Hook para gestionar la configuración del drawer (cajón lateral)

export const useDrawerConfig = () => {
    const drawerWidth = 270;
    const bgColor = "#18181b";
    const accentColor = "rgb(255, 255, 255)";
    const mutedText = "#a3a3a3";
    const selectedBg = "rgba(255, 255, 255, 0.81)";
    const paperColor = "#23232a";

    const routeGroups = [
        {
            label: "Inicio",
            icon: Home,
            to: "/main",
        },
        {
            label: "Agregados",
            icon: ListChecks,
            to: "/listaAgregados",
        },
        {
            label: "Ingresados",
            icon: List,
            to: "/listaIngresados",
        },
        {
            label: "Usuarios",
            icon: Users,
            to: "/user",
        },
    ];

    return {
        drawerWidth,
        bgColor,
        accentColor,
        mutedText,
        selectedBg,
        paperColor,
        routeGroups,
    };
};