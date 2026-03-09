import { createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useState, FC, ReactElement, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, NavLink, } from "reactstrap";
import logo from "../../assets/img/logo/Logo1000Moustaches.png";
import UsersManager from "../../managers/users.manager";
import SourceLink from "./SourceLink";
import Permissions from "../../logic/entities/Permissions";
import { MdOutlineFileOpen } from "react-icons/md";

import { auth } from "../../firebase-config";
import AuthManager from "../../managers/auth.manager";
import toast from "react-hot-toast";

type PagePermissions = {
    permission?: Permissions;
};

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
    onLogoClick = () => { },
    ...props
}): ReactElement => {
    const { t } = useTranslation();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

    const [pagePermissions, setPagePermissions] = useState<PagePermissions>({});


    let isLogin = () => {
        return authState === AuthFormState.LOGIN;
    };

    let renderButtonText = () => {
        const { buttonText } = props;

        if (buttonText) {
            return buttonText;
        }

        if (isLogin()) {
            return t("auth.login");
        } else {
            return t("auth.signup");
        }
    };

    let handleForgotPassword = () => {
        sendPasswordResetEmail(auth, username)
            .then((response) => {
                toast.success(t("auth.message.passwordResetSent", { email: username }));
                setShowForgotPasswordModal(false);
            })
            .catch((error) => {
                console.error(error);
                toast.error(`${t("auth.message.errorPasswordReset")}\n${error}`);
                setShowForgotPasswordModal(false);
            });
    };

    let handleSubmit = () => {
        if (isLogin()) {
            AuthManager.login(username, password)
                .then(() => {
                    toast.success(t("auth.message.loginSuccess"));
                    window.location.href = "/";
                })
                .catch((error) => {
                    console.error("Error for login");
                    console.error(error);
                    toast.error(t("auth.message.loginError"));
                });
        } else {
            if (confirmPassword === password) {
                // Check if user is prepared in database
                UsersManager.getAll().then((users) => {
                    if (users.find((usr) => usr.email === username) === null) {
                        toast.error(t("auth.message.accountNotPrepared"));
                        return;
                    } else {
                        createUserWithEmailAndPassword(auth, username, password)
                            .then((response) => {
                                sessionStorage.setItem("Auth Token", response.user.refreshToken);
                                window.location.href = "/";
                            })
                            .catch((error) => {
                                console.error("Error for create user");
                                console.error(error);
                                toast.error(`${t("auth.message.errorCreateUser")}\n${error}`);
                            });
                    }
                });
            } else {
                toast.error(t("auth.message.passwordMismatch"));
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
                <SourceLink link={"/"} className="navbar-brand d-flex justify-content-center" onClick={onLogoClick}>
                    <img src={logo} height="100" alt={t("auth.logoAlt")} />
                </SourceLink>
                <FormGroup>
                    <Label for="email">{t("auth.email")}</Label>
                    <Input name="email" type="email" placeholder={t("auth.placeholder.email")} value={username} onChange={(evt) => setUsername(evt.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label for="password">{t("auth.password")}</Label>
                    <Input
                        name="password"
                        type="password"
                        placeholder={t("auth.placeholder.password")}
                        autoComplete={isLogin() ? "current-password" : "new-password"}
                        value={password}
                        onChange={(evt) => setPassword(evt.target.value)}
                    />
                </FormGroup>
                {!isLogin() && (
                    <FormGroup>
                        <Label for="confirmPassword">{t("auth.confirmPassword")}</Label>
                        <Input
                            name="confirmPassword"
                            type="password"
                            placeholder={t("auth.placeholder.confirmPassword")}
                            autoComplete={"off"}
                            value={confirmPassword}
                            onChange={(evt) => setConfirmPassword(evt.target.value)}
                        />
                    </FormGroup>
                )}
                <hr />
                {isLogin() && (
                    <Label className="can-click" onClick={() => setShowForgotPasswordModal(true)}>
                        {t("auth.forgotPassword.label")}
                    </Label>
                )}
                <Button type="submit" size="lg" className="bg-gradient-theme-left border-0" block onClick={handleSubmit}>
                    {renderButtonText()}
                </Button>

                {!isLogin() && (
                    <>
                        <br />
                        <em>{t("auth.signupHint")}</em>
                    </>
                )}

                {children}

                <div className="text-center mt-3">
                    <NavLink
                        id="privacy-policy"
                        href="/privacypolicylogin"
                        target="_blank"
                        className="text-black text-decoration-none small"
                    >
                        <MdOutlineFileOpen className="me-2" />
                        {t("auth.legal")}
                    </NavLink>
                </div>
            </Form>



            <Modal isOpen={showForgotPasswordModal} {...props}>
                <ModalHeader>
                    <h1>{t("auth.forgotPassword.modalTitle")}</h1>
                </ModalHeader>
                <ModalBody>
                    {t("auth.forgotPassword.modalBody")}
                    <Input value={username} onChange={(evt) => setUsername(evt.target.value)} />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => setShowForgotPasswordModal(false)}>
                        {t("common.cancel")}
                    </Button>
                    <Button color="success" onClick={() => handleForgotPassword()}>
                        {t("common.confirm")}
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default AuthForm;
