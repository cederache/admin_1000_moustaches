import React, { FC } from "react";
import { Button, Col, Row } from "reactstrap";
import { MdRefresh, MdOutlineModeEdit, MdSave, MdDelete } from "react-icons/md";

interface UserDetailPageActionsProps {
    userId: string;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onRefresh: () => void;
    onDelete: () => void;
}

const UserDetailPageActions: FC<UserDetailPageActionsProps> = ({
    userId,
    isEditing,
    onEdit,
    onSave,
    onRefresh,
    onDelete,
}) => (
    <Row className="justify-content-end">
        <Col xs="auto">
            {userId !== "new" && isEditing && (
                <Button color="danger" onClick={onDelete}>
                    <MdDelete />
                </Button>
            )}
            {userId !== "new" && !isEditing && (
                <Button className="ms-2" color="primary" onClick={onEdit}>
                    <MdOutlineModeEdit />
                </Button>
            )}
            {isEditing && (
                <Button className="ms-2" color="success" onClick={onSave}>
                    <MdSave />
                </Button>
            )}
            <Button className="ms-2" onClick={onRefresh}>
                <MdRefresh />
            </Button>
        </Col>
    </Row>
);

export default UserDetailPageActions;
