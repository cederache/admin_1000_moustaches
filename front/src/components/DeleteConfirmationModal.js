import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import PropTypes from "../utils/propTypes";

const DeleteConfirmationModal = ({
    show,
    handleClose,
    bodyEntityName,
    ...props
}) => {
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

DeleteConfirmationModal.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    bodyEntityName: PropTypes.string,
};

export default DeleteConfirmationModal;
