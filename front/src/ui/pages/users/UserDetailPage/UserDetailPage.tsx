import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import Page, { CustomBreadcrumbItem } from "../../../components/Page";
import toast from "react-hot-toast";
import User from "../../../../logic/entities/User";
import { useNavigate, useParams } from "react-router-dom";
import { setLoggedUser, useLoggedUser } from "../../../../hooks/useLoggedUser";
import { useUser } from "../../../../hooks/users/useUser";
import { useCreateUser } from "../../../../hooks/users/useCreateUser";
import { useUpdateUser } from "../../../../hooks/users/useUpdateUser";
import { useDeleteUser } from "../../../../hooks/users/useDeleteUser";
import UserDetailPageActions from "./components/UserDetailPageActions";
import UserDetailForm from "./components/UserDetailForm";

interface UserDetailPageProps {
    [key: string]: any;
}

const UserDetailPage: FC<UserDetailPageProps> = ({ props }) => {
    const { t } = useTranslation();
    const { id: paramUserId } = useParams();
    const userId = paramUserId ?? "new";
    const numericId = userId === "new" ? null : parseInt(userId, 10);
    const validId = numericId != null && !Number.isNaN(numericId) ? numericId : null;

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false);
    const [formUser, setFormUser] = useState<User | null>(null);

    const { loggedUser } = useLoggedUser();
    const navigate = useNavigate();

    const { data: user, isPending: isUserPending, isError: isUserError, refetch: refetchUser } = useUser(validId);
    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();

    const isNewUser = userId === "new";

    useEffect(() => {
        if (isNewUser && formUser === null) {
            setFormUser(new User(-1, "", "", "", false));
            setIsEditing(true);
        }
    }, [isNewUser]);

    const handleStartEditing = () => {
        if (user) {
            setFormUser({ ...user });
            setIsEditing(true);
        }
    };

    const handleRefresh = () => {
        if (isNewUser) {
            setFormUser(new User(-1, "", "", "", false));
            setIsEditing(true);
        } else {
            refetchUser();
        }
    };

    const onUserChange = (updates: Partial<User>) => {
        const target = isNewUser ? formUser : formUser ?? user;
        if (target) setFormUser({ ...target, ...updates });
    };

    const save = () => {
        const userToSave = isNewUser ? formUser : formUser ?? user;
        if (userToSave == null) return;

        setIsEditing(false);

        if (isNewUser) {
            createUserMutation.mutate(userToSave, {
                onSuccess: (updatedUser) => {
                    toast.success(t("users.message.userCreated"));
                    navigate(`/users/${updatedUser.id}`);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(`${t("common.errorCreate")}\n${err}`);
                },
            });
        } else {
            updateUserMutation.mutate(userToSave, {
                onSuccess: (updatedUser) => {
                    toast.success(t("users.message.userUpdated"));
                    if (loggedUser?.id === updatedUser.id) {
                        setLoggedUser(updatedUser);
                    }
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(`${t("common.errorUpdate")}\n${err}`);
                },
            });
        }
    };

    const deleteV = () => {
        const userToDelete = isNewUser ? formUser : user;
        if (userToDelete == null) return;

        deleteUserMutation.mutate(userToDelete, {
            onSuccess: () => {
                toast.success(t("users.message.userDeleted"));
                navigate("/users");
            },
            onError: (err) => {
                console.error(err);
                toast.error(`${t("common.errorDelete")}\n${err}`);
            },
        });
    };

    const displayUser = isNewUser ? formUser : (isEditing ? formUser : user) ?? user;

    let content = <div>{t("common.loading")}</div>;

    if (isNewUser) {
        if (formUser) {
            content = (
                <div>
                    <UserDetailPageActions
                        userId={userId}
                        isEditing={isEditing}
                        onEdit={handleStartEditing}
                        onSave={save}
                        onRefresh={handleRefresh}
                        onDelete={() => setShowDeleteConfirmationModal(true)}
                    />
                    <br />
                    <UserDetailForm
                        user={formUser}
                        isEditing={isEditing}
                        isNew={true}
                        onUserChange={onUserChange}
                    />
                </div>
            );
        }
    } else if (isUserPending && !user) {
        content = <div>{t("common.loading")}</div>;
    } else if (isUserError || (user === undefined && !isUserPending)) {
        content = <div>{t("users.userNotFound")}</div>;
    } else if (displayUser) {
        content = (
            <div>
                <UserDetailPageActions
                    userId={userId}
                    isEditing={isEditing}
                    onEdit={handleStartEditing}
                    onSave={save}
                    onRefresh={handleRefresh}
                    onDelete={() => setShowDeleteConfirmationModal(true)}
                />
                <br />
                <UserDetailForm
                    user={displayUser}
                    isEditing={isEditing}
                    isNew={false}
                    onUserChange={onUserChange}
                />
            </div>
        );
    }

    return (
        <Page
            className="UserPage"
            title={t("users.detailTitle")}
            breadcrumbs={[
                { name: t("users.breadcrumb"), to: "/users" } as CustomBreadcrumbItem,
                { name: t("users.breadcrumbDetail"), active: true } as CustomBreadcrumbItem,
            ]}
        >
            {content}
            <DeleteConfirmationModal
                show={showDeleteConfirmationModal}
                handleClose={(confirmed) => {
                    setShowDeleteConfirmationModal(false);
                    if (confirmed) deleteV();
                }}
                bodyEntityName={t("users.entityName")}
            />
        </Page>
    );
};
export default UserDetailPage;
