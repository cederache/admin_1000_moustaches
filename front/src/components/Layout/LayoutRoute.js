import React from "react";
import { Redirect, Route, useLocation } from "react-router-dom";

const LayoutRoute = ({
    isPrivate,
    component: Component,
    layout: Layout,
    ...rest
}) => {
    const location = useLocation();
    if (isPrivate) {
        return (
            <Route
                {...rest}
                render={(props) =>
                    sessionStorage.getItem("Auth Token") ? (
                        <Layout {...props}>
                            <Component {...props} />
                        </Layout>
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location },
                            }}
                        />
                    )
                }
            />
        );
    }
    return (
        <Route
            {...rest}
            render={(props) => (
                <Layout {...props}>
                    <Component {...props} />
                </Layout>
            )}
        />
    );
};

export default LayoutRoute;
