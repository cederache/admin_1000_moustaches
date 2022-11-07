import logo from "../assets/img/logo/Logo1000Moustaches.png";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import SourceLink from "./SourceLink";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";

function AuthForm({
    showLogo,
    usernameLabel,
    usernameInputProps,
    passwordLabel,
    passwordInputProps,
    confirmPasswordLabel,
    confirmPasswordInputProps,
    children,
    onLogoClick,
    ...props
}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    let isLogin = () => {
        return props.authState === STATE_LOGIN;
    };

    let renderButtonText = () => {
        const { buttonText } = props;

        if (!buttonText && isLogin) {
            return "Login";
        }

        if (!buttonText && !isLogin) {
            return "Signup";
        }

        return buttonText;
    };

    let handleSubmit = (event) => {
        const authentication = getAuth();

        if (isLogin()) {
            signInWithEmailAndPassword(authentication, username, password)
                .then((response) => {
                    console.log(response);
                    sessionStorage.setItem(
                        "Auth Token",
                        response._tokenResponse.refreshToken
                    );
                    window.location = "/";
                })
                .catch((error) => {
                    console.log("Error for signup");
                    console.error(error);
                });
        } else {
            if (confirmPassword === password) {
                createUserWithEmailAndPassword(
                    authentication,
                    username,
                    password
                )
                    .then((response) => {
                        sessionStorage.setItem(
                            "Auth Token",
                            response._tokenResponse.refreshToken
                        );
                        window.location = "/";
                    })
                    .catch((error) => {
                        console.log("Error for create user");
                        console.error(error);
                    });
            } else {
                // show wrong confirmation password notification
            }
        }
        event.preventDefault();
    };

    return (
        <Form onSubmit={handleSubmit}>
            {showLogo && (
                <SourceLink
                    className="navbar-brand d-flex justify-content-center"
                    onClick={onLogoClick}
                >
                    <img src={logo} height="100" alt="1000 Moustaches" />
                </SourceLink>
            )}
            <FormGroup>
                <Label for={usernameLabel}>{usernameLabel}</Label>
                <Input
                    {...usernameInputProps}
                    value={username}
                    onChange={(evt) => setUsername(evt.target.value)}
                />
            </FormGroup>
            <FormGroup>
                <Label for={passwordLabel}>{passwordLabel}</Label>
                <Input
                    {...passwordInputProps}
                    value={password}
                    onChange={(evt) => setPassword(evt.target.value)}
                />
            </FormGroup>
            {!isLogin() && (
                <FormGroup>
                    <Label for={confirmPasswordLabel}>
                        {confirmPasswordLabel}
                    </Label>
                    <Input
                        {...confirmPasswordInputProps}
                        value={confirmPassword}
                        onChange={(evt) => setConfirmPassword(evt.target.value)}
                    />
                </FormGroup>
            )}
            <hr />
            <Button
                size="lg"
                className="bg-gradient-theme-left border-0"
                block
                onClick={handleSubmit}
            >
                {renderButtonText()}
            </Button>

            {children}
        </Form>
    );
}

export const STATE_LOGIN = "LOGIN";
export const STATE_SIGNUP = "SIGNUP";

AuthForm.propTypes = {
    authState: PropTypes.oneOf([STATE_LOGIN, STATE_SIGNUP]).isRequired,
    showLogo: PropTypes.bool,
    usernameLabel: PropTypes.string,
    usernameInputProps: PropTypes.object,
    passwordLabel: PropTypes.string,
    passwordInputProps: PropTypes.object,
    confirmPasswordLabel: PropTypes.string,
    confirmPasswordInputProps: PropTypes.object,
    onLogoClick: PropTypes.func,
};

AuthForm.defaultProps = {
    authState: "LOGIN",
    showLogo: true,
    usernameLabel: "Email",
    usernameInputProps: {
        type: "email",
        placeholder: "ton@email.fr",
    },
    passwordLabel: "Mot de passe",
    passwordInputProps: {
        type: "password",
        placeholder: "Mot de passe",
    },
    confirmPasswordLabel: "Confirmer le mot de passe",
    confirmPasswordInputProps: {
        type: "password",
        placeholder: "Confirmer le mot de passe",
    },
    onLogoClick: () => {},
};

export default AuthForm;
