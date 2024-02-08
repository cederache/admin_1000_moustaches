import React, { FC, ReactElement } from "react";
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
    return (
        <Modal isOpen={show} {...props}>
            <ModalHeader closeButton>
                <h1>Confirmer la suppression</h1>
            </ModalHeader>
            <ModalBody>
                Vous êtes sur le point de supprimer {bodyEntityName || ""}.
                Êtes-vous sûr ?
            </ModalBody>
            <ModalFooter>
                <Button color="success" onClick={() => handleClose(false)}>
                    Annuler
                </Button>
                <Button color="danger" onClick={() => handleClose(true)}>
                    Confirmer
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default DeleteConfirmationModal;
