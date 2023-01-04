import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";
import PropTypes from "prop-types";
import React, { useState } from "react";
import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "reactstrap";
import logo from "../assets/img/logo/Logo1000Moustaches.png";
import UsersManager from "../managers/users.manager";
import SourceLink from "./SourceLink";

import NotificationSystem from "react-notification-system";
import { auth } from "../firebase-config";
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
    const [showForgotPasswordModal, setShowForgotPasswordModal] =
        useState(false);

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

    let handleForgotPassword = () => {
        sendPasswordResetEmail(auth, username)
            .then((response) => {
                console.log(response);
                notificationSystem?.addNotification({
                    message: `Un mail a été envoyé l'adresse ${username} pour réinitialiser le mot de passe`,
                    level: "success",
                });
                setShowForgotPasswordModal(false);
            })
            .catch((error) => {
                console.error(error);
                notificationSystem?.addNotification({
                    message:
                        `Une erreur s'est produite pendant la réinitialisation du mot de passe. Veillez réessayer. Si l'erreur persiste, merci de contacter le service informatique.\n${error}`,
                    level: "error",
                });
                setShowForgotPasswordModal(false);
            });
    };

    let handleSubmit = (event) => {
        if (isLogin()) {
            signInWithEmailAndPassword(auth, username, password)
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
                        createUserWithEmailAndPassword(auth, username, password)
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
                                        `Une erreur s'est produite pendant la création de l'utilisateur·ice. Merci de ressayer. Si l'erreur persiste, merci de contacter le service informatique.\n${error}`,
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
                {isLogin() && (
                    <Label
                        className="can-click"
                        onClick={() => setShowForgotPasswordModal(true)}
                    >
                        Mot de passe oublié ?
                    </Label>
                )}
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

            <Modal isOpen={showForgotPasswordModal} {...props}>
                <ModalHeader>
                    <h1>Mot de passe oublié ?</h1>
                </ModalHeader>
                <ModalBody>
                    Merci d'entrer le mail du compte pour recevoir un lien de
                    modification de mot passe.
                    <Input
                        value={username}
                        onChange={(evt) => setUsername(evt.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="danger"
                        onClick={() => setShowForgotPasswordModal(false)}
                    >
                        Annuler
                    </Button>
                    <Button
                        color="success"
                        onClick={() => handleForgotPassword()}
                    >
                        Confirmer
                    </Button>
                </ModalFooter>
            </Modal>
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
