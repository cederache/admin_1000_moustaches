import React from "react";
import componentQueries from "react-component-queries";
import { BrowserRouter, Switch } from "react-router-dom";
import { STATE_LOGIN, STATE_SIGNUP } from "./components/AuthForm";
import GAListener from "./components/GAListener";
import { EmptyLayout, LayoutRoute, MainLayout } from "./components/Layout";
import PageSpinner from "./components/PageSpinner";
import "./styles/reduction.scss";

const AuthPage = React.lazy(() => import("./pages/AuthPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const AnimalsPage = React.lazy(() => import("./pages/animals/AnimalsPage"));
const AnimalDetailPage = React.lazy(() =>
    import("./pages/animals/AnimalDetailPage")
);
const VeterinariansPage = React.lazy(() =>
    import("./pages/veterinarians/VeterinariansPage")
);
const VeterinarianDetailPage = React.lazy(() =>
    import("./pages/veterinarians/VeterinarianDetailPage")
);
const HostFamiliesPage = React.lazy(() =>
    import("./pages/hostFamilies/HostFamiliesPage")
);
const HostFamilyDetailPage = React.lazy(() =>
    import("./pages/hostFamilies/HostFamilyDetailPage")
);
const UsersPage = React.lazy(() => import("./pages/users/UsersPage"));
const UserDetailPage = React.lazy(() => import("./pages/users/UserDetailPage"));

const getBasename = () => {
    return `/${process.env.PUBLIC_URL.split("/").pop()}`;
};

class App extends React.Component {
    render() {
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
                                exact
                                path="/signup"
                                layout={EmptyLayout}
                                component={(props) => (
                                    <AuthPage
                                        {...props}
                                        authState={STATE_SIGNUP}
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
                            <LayoutRoute
                                isPrivate={true}
                                exact
                                path="/users"
                                layout={MainLayout}
                                component={UsersPage}
                            />
                            <LayoutRoute
                                isPrivate={true}
                                path="/users/:id"
                                layout={MainLayout}
                                component={UserDetailPage}
                            />
                            {/* <Redirect to="/" /> */}
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
