import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
} from "firebase/auth";
import React, { useState, FC, ReactElement, ReactNode } from "react";
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

interface InputProps {
    name: string;
    placeholder: string;
    type: string;
    autoComplete: string;
}

interface AuthFormProps {
    authState: AuthFormState;
    showLogo?: boolean;
    usernameLabel?: string;
    passwordLabel?: string;
    confirmPasswordLabel?: string;
    confirmPasswordInputProps?: InputProps;
    children?: ReactNode;
    onLogoClick?: () => void;
    [key: string]: any;
}

export enum AuthFormState {
    LOGIN = "LOGIN",
    SIGNUP = "SIGNUP",
}

const AuthForm: FC<AuthFormProps> = ({
    authState = AuthFormState.LOGIN,
    usernameLabel,
    usernameInputProps,
    passwordLabel,
    passwordInputProps,
    confirmPasswordLabel,
    confirmPasswordInputProps,
    children,
    onLogoClick = () => {},
    ...props
}): ReactElement => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showForgotPasswordModal, setShowForgotPasswordModal] =
        useState(false);

    const [notificationSystem, setNotificationSystem] =
        useState<NotificationSystem | null>(null);

    let isLogin = () => {
        return authState == AuthFormState.LOGIN;
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
                    message: `Une erreur s'est produite pendant la réinitialisation du mot de passe. Veillez réessayer. Si l'erreur persiste, merci de contacter le service informatique.\n${error}`,
                    level: "error",
                });
                setShowForgotPasswordModal(false);
            });
    };

    let handleSubmit = () => {
        if (isLogin()) {
            signInWithEmailAndPassword(auth, username, password)
                .then((response) => {
                    notificationSystem?.addNotification({
                        message: "Connexion réussie.\nBienvenue",
                        level: "success",
                    });
                    sessionStorage.setItem(
                        "Auth Token",
                        response.user.refreshToken
                    );
                    window.location.href = "/";
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
                    if (users.find((usr) => usr.email === username) == null) {
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
                                    response.user.refreshToken
                                );
                                window.location.href = "/";
                            })
                            .catch((error) => {
                                console.log("Error for create user");
                                console.error(error);
                                notificationSystem?.addNotification({
                                    message: `Une erreur s'est produite pendant la création de l'utilisateur·ice. Merci de ressayer. Si l'erreur persiste, merci de contacter le service informatique.\n${error}`,
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
    };

    let handleFormSubmit = (e: any) => {
        e.preventDefault();
        handleSubmit();
    };

    return (
        <>
            <Form onSubmit={handleFormSubmit}>
                <SourceLink
                    link={"/"}
                    className="navbar-brand d-flex justify-content-center"
                    onClick={onLogoClick}
                >
                    <img src={logo} height="100" alt="1000 Moustaches" />
                </SourceLink>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                        name="email"
                        type="email"
                        placeholder="ton@email.fr"
                        value={username}
                        onChange={(evt) => setUsername(evt.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Mot de passe</Label>
                    <Input
                        name="password"
                        type="password"
                        placeholder="Mot de passe"
                        autoComplete={
                            isLogin() ? "current-password" : "new-password"
                        }
                        value={password}
                        onChange={(evt) => setPassword(evt.target.value)}
                    />
                </FormGroup>
                {!isLogin() && (
                    <FormGroup>
                        <Label for="confirmPassword">
                            Confirmer le mot de passe
                        </Label>
                        <Input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirmer le mot de passe"
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
};

export default AuthForm;
