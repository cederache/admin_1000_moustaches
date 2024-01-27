import React, { FC } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { Row, Col, Card } from "reactstrap";
import AuthForm, { AuthFormState } from "../components/AuthForm";

interface AuthPageProps extends RouteComponentProps {
    authState: AuthFormState;
}

const AuthPage: FC<AuthPageProps> = ({ authState }) => {
    const history = useHistory();

    const handleAuthState = (authState: AuthFormState): void => {
        if (authState === AuthFormState.LOGIN) {
            // Go to page /login
            history.push("/login");
        } else {
            history.push("/signup");
        }
    };

    const handleLogoClick = (): void => {
        history.push("/");
    };

    return (
        <Row
            style={{
                height: "100vh",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Col md={6} lg={4}>
                <Card body>
                    <AuthForm
                        authState={authState}
                        onChangeAuthState={handleAuthState}
                        onLogoClick={handleLogoClick}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default AuthPage;
