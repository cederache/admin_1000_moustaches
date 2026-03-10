import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Col, Label, Row } from "reactstrap";
import { MdFilterAlt } from "react-icons/md";
import Switch from "../../components/Switch";
import Veterinarian from "../../../logic/entities/Veterinarian";

export class Filter {
    value: any;
    type: FilterType;

    constructor(value: any, type: FilterType) {
        this.value = value;
        this.type = type;
    }

    check(veterinarian: Veterinarian): boolean {
        return FilterType.check(this.type, this.value, veterinarian);
    }
}

export enum FilterType {
    EMERGENCIES = "Gère les urgences",
}

export namespace FilterType {
    export function check(filter: FilterType, value: any, veterinarian: Veterinarian): boolean {
        if (value === null || value === undefined) return true;
        switch (filter) {
            case FilterType.EMERGENCIES:
                return veterinarian.emergencies === value;
        }
    }
}

interface VeterinariansPageFiltersProps {
    filters: Filter[];
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
}

const VeterinariansPageFilters: FC<VeterinariansPageFiltersProps> = ({ filters, setFilters }) => {
    const { t } = useTranslation();

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col xs="auto" className="mb-0 border-end">
                        <MdFilterAlt />
                    </Col>
                    {filters.map((filter) => (
                        <Col key={filter.type} className="mb-0">
                            <Label>{t("veterinarians.filter.emergencies")}</Label>
                            <Switch
                                id={filter.type}
                                isOn={filter.value === true}
                                disabled={false}
                                handleToggle={() => {
                                    setFilters((prevFilters) =>
                                        prevFilters.map((f) => (f.type === filter.type ? new Filter(!f.value, f.type) : f))
                                    );
                                }}
                            />
                        </Col>
                    ))}
                </Row>
            </CardBody>
        </Card>
    );
};

export default VeterinariansPageFilters;
