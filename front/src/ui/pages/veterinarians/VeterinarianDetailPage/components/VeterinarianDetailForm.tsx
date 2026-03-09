import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, CardHeader, Col, Input, Label, Row } from "reactstrap";
import SourceLink from "../../../../components/SourceLink";
import BooleanNullableDropdown from "../../../../components/BooleanNullableDropdown";
import PriceLevelDropdown from "../../../../components/PriceLevelDropdown";
import Veterinarian from "../../../../../logic/entities/Veterinarian";
import { MdDirections } from "react-icons/md";

interface VeterinarianDetailFormProps {
    veterinarian: Veterinarian;
    isEditing: boolean;
    isNew: boolean;
    geocodeFound: boolean | null;
    onVeterinarianChange: (updates: Partial<Veterinarian>) => void;
}

const VeterinarianDetailForm: FC<VeterinarianDetailFormProps> = ({ veterinarian, isEditing, isNew, geocodeFound, onVeterinarianChange }) => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <h2>{isNew ? t("veterinarians.newVeterinarian") : veterinarian.name}</h2>
            </CardHeader>
            <CardBody>
                {isNew && (
                    <Row>
                        <Col xs={12}>
                            <Label>Nom</Label>
                            <Input value={veterinarian.name || ""} disabled={!isEditing} onChange={(evt) => onVeterinarianChange({ name: evt.target.value })} />
                        </Col>
                    </Row>
                )}
                <Row>
                    <Col xs={6}>
                        <Row>
                            <Col xs={12}>
                                <Label>Téléphone</Label>
                                <Input value={veterinarian.phone} disabled={!isEditing} onChange={(evt) => onVeterinarianChange({ phone: evt.target.value })} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Label>E-mail</Label>
                                <Input value={veterinarian.mail} disabled={!isEditing} onChange={(evt) => onVeterinarianChange({ mail: evt.target.value })} />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6}>
                        <Label>
                            {veterinarian.address !== undefined && (
                                <SourceLink link={`https://www.google.com/maps/place/${veterinarian.address}`}>
                                    <span>
                                        Adresse <MdDirections />
                                    </span>
                                </SourceLink>
                            )}
                            {veterinarian.address === undefined && <span>Adresse</span>}
                        </Label>
                        <Input
                            type="textarea"
                            value={veterinarian.address}
                            disabled={!isEditing}
                            onChange={(evt) => onVeterinarianChange({ address: evt.target.value })}
                        />
                        {geocodeFound != null && (
                            <p className={geocodeFound ? "text-success" : "text-danger"}>
                                <small>{geocodeFound ? t("veterinarians.addressValid") : t("veterinarians.addressNotFound")}</small>
                            </p>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <Row>
                            <Col xs={6}>
                                <Label>Gestion des urgences</Label>
                            </Col>
                            <Col xs={6}>
                                <Label>Niveau de prix</Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <BooleanNullableDropdown
                                    value={veterinarian.emergencies ?? null}
                                    disabled={!isEditing}
                                    onChange={(newValue) => onVeterinarianChange({ emergencies: newValue ?? undefined })}
                                />
                            </Col>
                            <Col xs={6}>
                                <PriceLevelDropdown
                                    value={veterinarian.priceLevel}
                                    disabled={!isEditing}
                                    onChange={(newValue) => onVeterinarianChange({ priceLevel: newValue })}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6}>
                        <Label>Méthode de confirmation de rendez-vous</Label>
                        <Input
                            type="textarea"
                            value={veterinarian.appointmentConfirmationProcedure}
                            disabled={!isEditing}
                            onChange={(evt) => onVeterinarianChange({ appointmentConfirmationProcedure: evt.target.value })}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <Label>Date de paiement</Label>
                        <Input
                            type="textarea"
                            value={veterinarian.invoicePaymentDate}
                            disabled={!isEditing}
                            onChange={(evt) => onVeterinarianChange({ invoicePaymentDate: evt.target.value })}
                        />
                    </Col>
                    <Col xs={6}>
                        <Label>Moyen de paiement</Label>
                        <Input
                            type="textarea"
                            value={veterinarian.paymentMethod}
                            disabled={!isEditing}
                            onChange={(evt) => onVeterinarianChange({ paymentMethod: evt.target.value })}
                        />
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default VeterinarianDetailForm;
