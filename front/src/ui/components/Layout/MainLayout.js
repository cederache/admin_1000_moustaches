import { Content, Footer, Header, Sidebar } from ".";
import React from "react";
import NotificationSystem from "react-notification-system";
import { NOTIFICATION_SYSTEM_STYLE } from "../../../utils/constants";
import { getDeviceConfig } from "../../../utils/breakpoint";

class MainLayout extends React.Component {
    static isSidebarOpen() {
        return document
            .querySelector(".cr-sidebar")
            .classList.contains("cr-sidebar--open");
    }

    componentDidMount() {
        this.checkBreakpoint(getDeviceConfig(window.innerWidth));
    }

    // close sidebar when
    handleContentClick = (event) => {
        // close sidebar if sidebar is open and screen size is less than `md`
        let breakpoint = getDeviceConfig(window.innerWidth);
        if (
            MainLayout.isSidebarOpen() &&
            (breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md")
        ) {
            this.openSidebar("close");
        }
    };

    checkBreakpoint(breakpoint) {
        switch (breakpoint) {
            case "xs":
            case "sm":
            case "md":
                return this.openSidebar("close");

            case "lg":
            case "xl":
            default:
                return this.openSidebar("open");
        }
    }

    openSidebar(openOrClose) {
        if (openOrClose === "open") {
            return document
                .querySelector(".cr-sidebar")
                .classList.add("cr-sidebar--open");
        }
        document
            .querySelector(".cr-sidebar")
            .classList.remove("cr-sidebar--open");
    }

    render() {
        const { children } = this.props;
        return (
            <main className="cr-app bg-light">
                <Sidebar />
                <Content fluid onClick={this.handleContentClick}>
                    <Header />
                    {children}
                    <Footer />
                </Content>

                <NotificationSystem
                    dismissible={false}
                    ref={(notificationSystem) =>
                        (this.notificationSystem = notificationSystem)
                    }
                    style={NOTIFICATION_SYSTEM_STYLE}
                />
            </main>
        );
    }
}

export default MainLayout;
