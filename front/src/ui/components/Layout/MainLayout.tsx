import React, { useEffect } from "react";
import { Content, Footer, Header, Sidebar } from "./index";
import { getDeviceConfig } from "../../../utils/breakpoint";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const isSidebarOpen = (): boolean => {
        return document.querySelector(".cr-sidebar")?.classList.contains("cr-sidebar--open") ?? false;
    };

    const openSidebar = (openOrClose: "open" | "close"): void => {
        const sidebar = document.querySelector(".cr-sidebar");
        if (openOrClose === "open") {
            sidebar?.classList.add("cr-sidebar--open");
        } else {
            sidebar?.classList.remove("cr-sidebar--open");
        }
    };

    const checkBreakpoint = (breakpoint: string): void => {
        switch (breakpoint) {
            case "xs":
            case "sm":
            case "md":
                openSidebar("close");
                break;
            case "lg":
            case "xl":
            default:
                openSidebar("open");
                break;
        }
    };

    const handleContentClick = (): void => {
        const breakpoint = getDeviceConfig(window.innerWidth);
        if (isSidebarOpen() && (breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md")) {
            openSidebar("close");
        }
    };

    useEffect(() => {
        checkBreakpoint(getDeviceConfig(window.innerWidth));
    }, []);

    return (
        <main className="cr-app bg-light">
            <Sidebar />
            <Content fluid onClick={handleContentClick}>
                <Header />
                {children}
                <Footer />
            </Content>
        </main>
    );
};

export default MainLayout;
