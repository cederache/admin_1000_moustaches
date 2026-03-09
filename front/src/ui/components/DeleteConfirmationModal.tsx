import React, { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface DeleteConfirmationModalProps {
    show: boolean;
    handleClose: (value: boolean) => void;
    bodyEntityName?: string;
    [key: string]: any;
}

const DeleteConfirmationModal: FC<DeleteConfirmationModalProps> = ({
    show,
    handleClose,
    bodyEntityName,
    ...props
}): ReactElement => {
    const { t } = useTranslation();
    return (
        <Modal isOpen={show} {...props}>
            <ModalHeader closeButton>
                <h1>{t("common.confirmDelete.title")}</h1>
            </ModalHeader>
            <ModalBody>
                {t("common.confirmDelete.body", { entity: bodyEntityName || "" })}
            </ModalBody>
            <ModalFooter>
                <Button color="success" onClick={() => handleClose(false)}>
                    {t("common.cancel")}
                </Button>
                <Button color="danger" onClick={() => handleClose(true)}>
                    {t("common.confirm")}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default DeleteConfirmationModal;
