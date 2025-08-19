import * as React from "react";

export const useDrawer = () => {
    const [open, setOpen] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) setOpen(false);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleToggleDrawer = () => setOpen(!open);
    const handleOpenDrawer = () => setOpen(true);
    const handleCloseDrawer = () => setOpen(false);

    const handleNavigation = (callback?: () => void) => {
        if (isMobile) {
            setOpen(false);
        }
        callback?.();
    };

    return {
        open,
        isMobile,
        handleToggleDrawer,
        handleOpenDrawer,
        handleCloseDrawer,
        handleNavigation,
    };
};