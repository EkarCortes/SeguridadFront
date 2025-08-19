import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';


export const useDrawerConfig = () => {
    const drawerWidth = 270;
    const bgColor = "#18181b";
    const accentColor = "#fff";
    const mutedText = "#a3a3a3";
    const selectedBg = "#3f3f46";
    const paperColor = "#23232a";

    const routeGroups = [
        {
            label: "Inicio",
            icon: HomeIcon,
            to: "/main",
        },
        {
            label: "Agregados",
            icon: PlaylistAddCheckIcon,
            to: "/listaAgregados",
        },
        {
            label: "Ingresados",
            icon: ListAltIcon,
            to: "/listaIngresados",
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