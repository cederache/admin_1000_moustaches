import React, { FC } from "react";
import { Button, Col, Row } from "reactstrap";
import { MdRefresh, MdOutlineModeEdit, MdSave, MdDelete } from "react-icons/md";

interface HostFamilyDetailPageActionsProps {
    hostFamilyId: string;
    isEditing: boolean;
    canEdit: boolean;
    onEdit: () => void;
    onSave: () => void;
    onRefresh: () => void;
    onDelete: () => void;
}

const HostFamilyDetailPageActions: FC<HostFamilyDetailPageActionsProps> = ({
    hostFamilyId,
    isEditing,
    canEdit,
    onEdit,
    onSave,
    onRefresh,
    onDelete,
}) => (
    <Row className="justify-content-end">
        <Col xs="auto">
            {hostFamilyId !== "new" && isEditing && (
                <Button color="danger" onClick={onDelete}>
                    <MdDelete />
                </Button>
            )}
            {!isEditing && canEdit && (
                <Button className="ms-2" color="primary" onClick={onEdit}>
                    <MdOutlineModeEdit />
                </Button>
            )}
            {isEditing && (
                <Button className="ms-2" color="success" onClick={onSave}>
                    <MdSave />
                </Button>
            )}
            {hostFamilyId !== "new" && (
                <Button className="ms-2" onClick={onRefresh}>
                    <MdRefresh />
                </Button>
            )}
        </Col>
    </Row>
);

export default HostFamilyDetailPageActions;
