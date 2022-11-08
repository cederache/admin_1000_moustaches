import logo from "../assets/img/logo/Logo1000Moustaches.png";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import SourceLink from "./SourceLink";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import UsersManager from "../managers/users.manager";

import NotificationSystem from "react-notification-system";
import { NOTIFICATION_SYSTEM_STYLE } from "../utils/constants";

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

    const [notificationSystem, setNotificationSystem] = useState(
        React.createRef()
    );

    let isLogin = () => {
        return props.authState === STATE_LOGIN;
    };

    let renderButtonText = () => {
        const { buttonText } = props;

        if (buttonText) {
            return buttonText;
        }

        if (isLogin()) {
            return "Connexion";
        } else {
            return "Inscription";
        }
    };

    let handleSubmit = (event) => {
        const authentication = getAuth();

        if (isLogin()) {
            signInWithEmailAndPassword(authentication, username, password)
                .then((response) => {
                    notificationSystem?.addNotification({
                        message: "Connexion réussie.\nBienvenue",
                        level: "success",
                    });
                    sessionStorage.setItem(
                        "Auth Token",
                        response._tokenResponse.refreshToken
                    );
                    window.location = "/";
                })
                .catch((error) => {
                    console.log("Error for signup");
                    console.error(error);
                    notificationSystem?.addNotification({
                        message:
                            "Connexion impossible. Merci de vérifier l'email et le mot de passe.\nEn cas de problème, merci de contacter le service informatique.",
                        level: "error",
                    });
                });
        } else {
            if (confirmPassword === password) {
                // Check if user is prepared in database
                UsersManager.getAll().then((users) => {
                    if (
                        users.find((usr) => usr.email === username).length === 0
                    ) {
                        notificationSystem?.addNotification({
                            message:
                                "Le compte doit être préparé avec cet e-mail. Merci de contacter un administrateur.",
                            level: "warning",
                        });
                        return;
                    } else {
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
                                notificationSystem?.addNotification({
                                    message:
                                        "Une erreur s'est produite pendant la création de l'utilisateur. Merci de ressayer. Si l'erreur persiste, merci de contacter le service informatique.",
                                    level: "error",
                                });
                            });
                    }
                });
            } else {
                notificationSystem?.addNotification({
                    message: "La confirmation de mot de passe n'est pas bonne",
                    level: "warning",
                });
            }
        }
        event.preventDefault();
    };

    return (
        <>
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
                        autoComplete={
                            isLogin() ? "current-password" : "new-password"
                        }
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
                            autoComplete={"off"}
                            value={confirmPassword}
                            onChange={(evt) =>
                                setConfirmPassword(evt.target.value)
                            }
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

                {!isLogin() && (
                    <>
                        <br />
                        <em>
                            Un administrateur doit déjà avoir créé votre compte
                            avant de pouvoir vous inscrire
                        </em>
                    </>
                )}

                {children}
            </Form>

            <NotificationSystem
                dismissible={false}
                ref={(notificationSystem) => {
                    setNotificationSystem(notificationSystem);
                }}
                style={NOTIFICATION_SYSTEM_STYLE}
            />
        </>
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
