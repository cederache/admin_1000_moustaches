import { STATE_LOGIN, STATE_SIGNUP } from "./components/AuthForm";
import GAListener from "./components/GAListener";
import { EmptyLayout, LayoutRoute, MainLayout } from "./components/Layout";
import PageSpinner from "./components/PageSpinner";
import React from "react";
import componentQueries from "react-component-queries";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./styles/reduction.scss";
import { app } from "./firebase-config";

const AuthPage = React.lazy(() => import("./pages/AuthPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const AnimalsPage = React.lazy(() => import("./pages/AnimalsPage"));
const AnimalDetailPage = React.lazy(() => import("./pages/AnimalDetailPage"));
const VeterinariansPage = React.lazy(() => import("./pages/VeterinariansPage"));
const VeterinarianDetailPage = React.lazy(() =>
    import("./pages/VeterinarianDetailPage")
);
const HostFamiliesPage = React.lazy(() => import("./pages/HostFamiliesPage"));
const HostFamilyDetailPage = React.lazy(() =>
    import("./pages/HostFamilyDetailPage")
);

const getBasename = () => {
    return `/${process.env.PUBLIC_URL.split("/").pop()}`;
};

class App extends React.Component {
    render() {
        console.log(this.props);
        return (
            <BrowserRouter basename={getBasename()}>
                <GAListener>
                    <Switch>
                        <React.Suspense fallback={<PageSpinner />}>
                            <LayoutRoute
                                exact
                                path="/login"
                                layout={EmptyLayout}
                                component={(props) => (
                                    <AuthPage
                                        {...props}
                                        authState={STATE_LOGIN}
                                    />
                                )}
                            />
                            <LayoutRoute
                                isPrivate={true}
                                exact
                                path="/"
                                layout={MainLayout}
                                component={DashboardPage}
                            />
                            <LayoutRoute
                                isPrivate={true}
                                exact
                                path="/animals"
                                layout={MainLayout}
                                component={AnimalsPage}
                            />
                            <LayoutRoute
                                isPrivate={true}
                                path="/animals/:id"
                                layout={MainLayout}
                                component={AnimalDetailPage}
                            />
                            <LayoutRoute
                                isPrivate={true}
                                exact
                                path="/veterinarians"
                                layout={MainLayout}
                                component={VeterinariansPage}
                            />
                            <LayoutRoute
                                isPrivate={true}
                                path="/veterinarians/:id"
                                layout={MainLayout}
                                component={VeterinarianDetailPage}
                            />
                            <LayoutRoute
                                isPrivate={true}
                                exact
                                path="/hostFamilies"
                                layout={MainLayout}
                                component={HostFamiliesPage}
                            />
                            <LayoutRoute
                                isPrivate={true}
                                path="/hostFamilies/:id"
                                layout={MainLayout}
                                component={HostFamilyDetailPage}
                            />
                            <Redirect to="/" />
                        </React.Suspense>
                    </Switch>
                </GAListener>
            </BrowserRouter>
        );
    }
}

const query = ({ width }) => {
    if (width < 575) {
        return { breakpoint: "xs" };
    }

    if (576 < width && width < 767) {
        return { breakpoint: "sm" };
    }

    if (768 < width && width < 991) {
        return { breakpoint: "md" };
    }

    if (992 < width && width < 1199) {
        return { breakpoint: "lg" };
    }

    if (width > 1200) {
        return { breakpoint: "xl" };
    }

    return { breakpoint: "xs" };
};

export default componentQueries(query)(App);
