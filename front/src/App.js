import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { AuthFormState } from "./ui/components/AuthForm";
import { EmptyLayout, LayoutRoute, MainLayout } from "./ui/components/Layout";
import PageSpinner from "./ui/components/PageSpinner";
import "./ui/styles/reduction.scss";
import { Routes } from "react-router";

const AuthPage = React.lazy(() => import("./ui/pages/AuthPage"));
const DashboardPage = React.lazy(() => import("./ui/pages/DashboardPage"));
const AnimalsPage = React.lazy(() => import("./ui/pages/animals/AnimalsPage"));
const AnimalDetailPage = React.lazy(() => import("./ui/pages/animals/AnimalDetailPage"));
const VeterinariansPage = React.lazy(() => import("./ui/pages/veterinarians/VeterinariansPage"));
const VeterinarianDetailPage = React.lazy(() => import("./ui/pages/veterinarians/VeterinarianDetailPage"));
const HostFamiliesPage = React.lazy(() => import("./ui/pages/hostFamilies/HostFamiliesPage"));
const HostFamilyDetailPage = React.lazy(() => import("./ui/pages/hostFamilies/HostFamilyDetailPage"));
const UsersPage = React.lazy(() => import("./ui/pages/users/UsersPage"));
const UserDetailPage = React.lazy(() => import("./ui/pages/users/UserDetailPage"));
const PrivacyPolicy = React.lazy(() => import("./ui/pages/PrivacyPolicy"));

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    exact
                    path="/login"
                    element={
                        <React.Suspense fallback={<PageSpinner />}>
                            <LayoutRoute layout={EmptyLayout} component={(props) => <AuthPage {...props} authState={AuthFormState.LOGIN} />} />
                        </React.Suspense>
                    }
                />
                <Route
                    exact
                    path="/signup"
                    element={
                        <React.Suspense fallback={<PageSpinner />}>
                            <LayoutRoute layout={EmptyLayout} component={(props) => <AuthPage {...props} authState={AuthFormState.SIGNUP} />} />
                        </React.Suspense>
                    }
                />
                <Route
                    index
                    exact
                    path="/"
                    element={
                        <React.Suspense fallback={<PageSpinner />}>
                            <LayoutRoute isPrivate layout={MainLayout} component={DashboardPage} />
                        </React.Suspense>
                    }
                />
                <Route
                    exact
                    path="/animals"
                    element={
                        <React.Suspense fallback={<PageSpinner />}>
                            <LayoutRoute isPrivate layout={MainLayout} component={AnimalsPage} />
                        </React.Suspense>
                    }
                />
                <Route
                    path="/animals/:id"
                    element={
                        <React.Suspense fallback={<PageSpinner />}>
                            <LayoutRoute isPrivate layout={MainLayout} component={AnimalDetailPage} />
                        </React.Suspense>
                    }
                />
                <Route
                    exact
                    path="/veterinarians"
                    element={
                        <React.Suspense fallback={<PageSpinner />}>
                            <LayoutRoute isPrivate layout={MainLayout} component={VeterinariansPage} />
                        </React.Suspense>
                    }
                />
                <Route
                    path="/veterinarians/:id"
                    element={
                        <React.Suspense fallback={<PageSpinner />}>
                            <LayoutRoute isPrivate layout={MainLayout} component={VeterinarianDetailPage} />
                        </React.Suspense>
                    }
                />
                <Route
                    exact
                    path="/hostFamilies"
                    element={
                        <React.Suspense fallback={<PageSpinner />}>
                            <LayoutRoute isPrivate layout={MainLayout} component={HostFamiliesPage} />
                        </React.Suspense>
                    }
                />
                <Route
                    path="/hostFamilies/:id"
                    element={
                        <React.Suspense fallback={<PageSpinner />}>
                            <LayoutRoute isPrivate layout={MainLayout} component={HostFamilyDetailPage} />
                        </React.Suspense>
                    }
                />
                <Route
                    exact
                    path="/users"
                    element={
                        <React.Suspense fallback={<PageSpinner />}>
                            <LayoutRoute isPrivate layout={MainLayout} component={UsersPage} />
                        </React.Suspense>
                    }
                />
                <Route
                    path="/users/:id"
                    element={
                        <React.Suspense fallback={<PageSpinner />}>
                            <LayoutRoute isPrivate layout={MainLayout} component={UserDetailPage} />
                        </React.Suspense>
                    }
                />
                <Route
                    path="/privacypolicy"
                    element={
                        <React.Suspense fallback={<PageSpinner />}>
                            <LayoutRoute isPrivate layout={MainLayout} component={PrivacyPolicy} />
                        </React.Suspense>
                    }
                />
                <Route
                    path="/privacypolicylogin"
                    element={
                        <React.Suspense fallback={<PageSpinner />}>
                            <LayoutRoute layout={EmptyLayout} component={PrivacyPolicy} />
                        </React.Suspense>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;