import React from "react";
import componentQueries from "react-component-queries";
import { BrowserRouter, Switch } from "react-router-dom";
import { AuthFormState } from "./ui/components/AuthForm";
import { EmptyLayout, LayoutRoute, MainLayout } from "./ui/components/Layout";
import PageSpinner from "./ui/components/PageSpinner";
import "./ui/styles/reduction.scss";

const AuthPage = React.lazy(() => import("./ui/pages/AuthPage"));
const DashboardPage = React.lazy(() => import("./ui/pages/DashboardPage"));
const AnimalsPage = React.lazy(() => import("./ui/pages/animals/AnimalsPage"));
const AnimalDetailPage = React.lazy(() =>
    import("./ui/pages/animals/AnimalDetailPage")
);
const VeterinariansPage = React.lazy(() =>
    import("./ui/pages/veterinarians/VeterinariansPage")
);
const VeterinarianDetailPage = React.lazy(() =>
    import("./ui/pages/veterinarians/VeterinarianDetailPage")
);
const HostFamiliesPage = React.lazy(() =>
    import("./ui/pages/hostFamilies/HostFamiliesPage")
);
const HostFamilyDetailPage = React.lazy(() =>
    import("./ui/pages/hostFamilies/HostFamilyDetailPage")
);
const UsersPage = React.lazy(() => import("./ui/pages/users/UsersPage"));
const UserDetailPage = React.lazy(() =>
    import("./ui/pages/users/UserDetailPage")
);

const getBasename = () => {
    return `/${import.meta.env.VITE_PUBLIC_URL?.split("/").pop()}`;
};

class App extends React.Component {
    render() {
        return (
            <BrowserRouter basename={getBasename()}>
                <Switch>
                    <React.Suspense fallback={<PageSpinner />}>
                        <LayoutRoute
                            exact
                            path="/login"
                            layout={EmptyLayout}
                            component={(props) => (
                                <AuthPage
                                    {...props}
                                    authState={AuthFormState.LOGIN}
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
                                    authState={AuthFormState.SIGNUP}
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
