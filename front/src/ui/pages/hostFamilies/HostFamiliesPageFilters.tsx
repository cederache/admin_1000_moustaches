import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Col, Label, Row } from "reactstrap";
import { MdFilterAlt } from "react-icons/md";
import Switch from "../../components/Switch";
import Dropdown from "../../components/Dropdown";
import HostFamily from "../../../logic/entities/HostFamily";
import HostFamilyKind from "../../../logic/entities/HostFamilyKind";
import User from "../../../logic/entities/User";

export class Filter {
    value: any;
    type: FilterType;

    constructor(value: any, type: FilterType) {
        this.value = value;
        this.type = type;
    }

    check(hostFamily: HostFamily): boolean {
        return FilterType.check(this.type, this.value, hostFamily);
    }
}

export enum FilterType {
    MEMBERSHIP_LATE = "En retard de cotisation uniquement",
    HAS_A_VEHICULE = "Véhiculé·e uniquement",
    ON_A_BREAK = "Statut",
    TEMPORARY = "Tampon",
    REFERENT = "Référent·e",
    TYPE = "Type de FA",
}

export namespace FilterType {
    export function isSwitch(filter: FilterType): boolean {
        switch (filter) {
            case FilterType.MEMBERSHIP_LATE:
            case FilterType.HAS_A_VEHICULE:
                return true;
            default:
                return false;
        }
    }

    export function check(filter: FilterType, value: any, hostFamily: HostFamily): boolean {
        if (value === null || value === undefined) return true;
        switch (filter) {
            case FilterType.MEMBERSHIP_LATE:
                return value === true ? hostFamily.membershipUpToDate === false : true;
            case FilterType.HAS_A_VEHICULE:
                return value === true ? hostFamily.hasVehicule === value : true;
            case FilterType.ON_A_BREAK:
                return hostFamily.onBreak === value;
            case FilterType.TEMPORARY:
                return hostFamily.isTemporary === value;
            case FilterType.REFERENT:
                return hostFamily.referent?.id === value;
            case FilterType.TYPE:
                return hostFamily.hostFamilyKinds?.map((hfk) => hfk.id).includes(value) ?? false;
        }
    }
}

interface HostFamiliesPageFiltersProps {
    filters: Filter[];
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
    hostFamilyKinds: HostFamilyKind[];
    referents: User[];
    isLoading: boolean;
}

const HostFamiliesPageFilters: FC<HostFamiliesPageFiltersProps> = ({
    filters,
    setFilters,
    hostFamilyKinds,
    referents,
    isLoading,
}) => {
    const { t } = useTranslation();

    const filterBody = (filter: Filter) => {
        switch (filter.type) {
            case FilterType.HAS_A_VEHICULE:
            case FilterType.MEMBERSHIP_LATE:
                return (
                    <Col key={filter.type} className="mb-0">
                        <Label>
                            {filter.type === FilterType.MEMBERSHIP_LATE
                                ? t("hostFamilies.filter.membershipLate")
                                : t("hostFamilies.filter.hasVehicule")}
                        </Label>
                        <br />
                        <Switch
                            disabled={isLoading}
                            id={filter.type}
                            isOn={filter.value}
                            handleToggle={() => {
                                setFilters((previous) =>
                                    previous.map((f) => (f.type === filter.type ? new Filter(!f.value, f.type) : f))
                                );
                            }}
                        />
                    </Col>
                );
            case FilterType.ON_A_BREAK:
                return (
                    <Col key={filter.type} className="mb-0">
                        <Label>{t("hostFamilies.filter.status")}</Label>
                        <Dropdown
                            withNewLine={true}
                            color="primary"
                            value={filter.value}
                            values={[true, false, null]}
                            valueDisplayName={(onBreak: boolean | null) =>
                                onBreak === null
                                    ? t("hostFamilies.filter.statusAll")
                                    : onBreak === true
                                    ? t("hostFamilies.filter.statusPaused")
                                    : t("hostFamilies.filter.statusActive")
                            }
                            valueActiveCheck={(onBreak: boolean | null) => onBreak === filter.value}
                            key="onBreak"
                            onChange={(newBreak) =>
                                setFilters((previous) =>
                                    previous.map((f) => (f.type === filter.type ? new Filter(newBreak, f.type) : f))
                                )
                            }
                        />
                    </Col>
                );
            case FilterType.REFERENT:
                return (
                    <Col key={filter.type} className="mb-0">
                        <Label>{t("hostFamilies.filter.referent")}</Label>
                        <Dropdown
                            withNewLine={true}
                            color="primary"
                            value={referents.find((usr) => usr.id === filter.value)}
                            values={[...referents, undefined]}
                            valueDisplayName={(usr) => (usr === undefined ? "-" : `${usr?.name} ${usr?.firstname}`)}
                            valueActiveCheck={(usr) => usr?.id === filter.value}
                            key="referents"
                            onChange={(newUser) =>
                                setFilters((previous) =>
                                    previous.map((f) => (f.type === filter.type ? new Filter(newUser?.id, f.type) : f))
                                )
                            }
                        />
                    </Col>
                );
            case FilterType.TYPE:
                return (
                    <Col key={filter.type} className="mb-0">
                        <Label>{t("hostFamilies.filter.typeFA")}</Label>
                        <Dropdown
                            withNewLine={true}
                            color="primary"
                            value={hostFamilyKinds.find((hfk) => hfk.id === filter.value)}
                            values={[...hostFamilyKinds, null]}
                            valueDisplayName={(hfk) => (hfk === null ? "-" : hfk?.name ?? "")}
                            valueActiveCheck={(hfk) => hfk?.id === filter.value}
                            key="hostFamilyKind"
                            onChange={(newHFK) =>
                                setFilters((previous) =>
                                    previous.map((f) => (f.type === filter.type ? new Filter(newHFK?.id, f.type) : f))
                                )
                            }
                        />
                    </Col>
                );
            case FilterType.TEMPORARY:
                return (
                    <Col key={filter.type} className="mb-0">
                        <Label>{t("hostFamilies.filter.temporary")}</Label>
                        <Dropdown
                            withNewLine={true}
                            color="primary"
                            value={filter.value}
                            values={[true, false, null]}
                            valueDisplayName={(temporary) =>
                                temporary === null
                                    ? t("hostFamilies.filter.statusAll")
                                    : temporary === true
                                    ? t("hostFamilies.filter.temporaryYes")
                                    : t("hostFamilies.filter.temporaryNo")
                            }
                            valueActiveCheck={(temporary) => temporary === filter.value}
                            key="temporay"
                            onChange={(newTemporary) =>
                                setFilters((previous) =>
                                    previous.map((f) => (f.type === filter.type ? new Filter(newTemporary, f.type) : f))
                                )
                            }
                        />
                    </Col>
                );
        }
    };

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col xs="auto" className="mb-0 border-end">
                        <MdFilterAlt />
                    </Col>
                    <Col>
                        <Row>{filters.filter((f) => FilterType.isSwitch(f.type)).map((filter) => filterBody(filter))}</Row>
                        <Row>{filters.filter((f) => !FilterType.isSwitch(f.type)).map((filter) => filterBody(filter))}</Row>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
};

export default HostFamiliesPageFilters;
