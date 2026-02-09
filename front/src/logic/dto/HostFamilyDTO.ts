import HostFamily from "../entities/HostFamily";
import AnimalToHostFamilyDTO from "./AnimalToHostFamilyDTO";
import HostFamilyKindDTO from "./HostFamilyKindDTO";
import UserDTO from "./UserDTO";

class HostFamilyDTO {
    id: number;
    name: string;
    firstname: string;
    phone?: string;
    mail?: string;
    socialNetworkAlias?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    driverLicense?: boolean;
    hasVehicule?: boolean;
    nbChildren?: number;
    childrenInfos?: string;
    animalsInfos?: string;
    canProvideVeterinaryCare?: boolean;
    canProvideSociabilisation?: boolean;
    canHostDisableAnimal?: boolean;
    canProvideNightCare?: boolean;
    observations?: string;
    housingInformations?: string;
    canIsolate?: boolean;
    hostConditions?: string;
    onBreak: boolean;
    membershipUpToDate: boolean;
    isTemporary: boolean;
    situation?: string;
    isAvailable?: boolean;

    referent?: UserDTO;
    hostFamilyKinds?: HostFamilyKindDTO[];
    animalRelations?: AnimalToHostFamilyDTO[];

    constructor(hostFamily: any) {
        this.id = hostFamily.id;
        this.name = hostFamily.name;
        this.firstname = hostFamily.firstname;
        this.phone = hostFamily.phone;
        this.mail = hostFamily.mail;
        this.socialNetworkAlias = hostFamily.socialNetworkAlias;
        this.address = hostFamily.address;
        this.latitude = hostFamily.latitude;
        this.longitude = hostFamily.longitude;
        this.driverLicense = hostFamily.driverLicense;
        this.hasVehicule = hostFamily.hasVehicule;
        this.nbChildren = hostFamily.nbChildren;
        this.childrenInfos = hostFamily.childrenInfos;
        this.animalsInfos = hostFamily.animalsInfos;
        this.canProvideVeterinaryCare = hostFamily.canProvideVeterinaryCare;
        this.canProvideSociabilisation = hostFamily.canProvideSociabilisation;
        this.canHostDisableAnimal = hostFamily.canHostDisableAnimal;
        this.canProvideNightCare = hostFamily.canProvideNightCare;
        this.observations = hostFamily.observations;
        this.housingInformations = hostFamily.housingInformations;
        this.canIsolate = hostFamily.canIsolate;
        this.hostConditions = hostFamily.hostConditions;
        this.onBreak = hostFamily.onBreak;
        this.membershipUpToDate = hostFamily.membershipUpToDate;
        this.isTemporary = hostFamily.isTemporary;
        this.situation = hostFamily.situation;
        this.isAvailable = hostFamily.isAvailable;

        this.referent = !!hostFamily.referent ? new UserDTO(hostFamily.referent) : undefined;
        this.hostFamilyKinds = hostFamily.hostFamilyKinds?.map((hostFamilyKind: any) => new HostFamilyKindDTO(hostFamilyKind));
        this.animalRelations = hostFamily.animalRelations?.map((animalRelation: any) => new AnimalToHostFamilyDTO(animalRelation));
    }

    toEntity(): HostFamily {
        return new HostFamily(
            this.id,
            this.name,
            this.firstname,
            this.onBreak,
            this.membershipUpToDate,
            this.phone,
            this.mail,
            this.socialNetworkAlias,
            this.address,
            this.latitude,
            this.longitude,
            this.driverLicense,
            this.hasVehicule,
            this.nbChildren,
            this.childrenInfos,
            this.animalsInfos,
            this.canProvideVeterinaryCare,
            this.canProvideSociabilisation,
            this.canHostDisableAnimal,
            this.canProvideNightCare,
            this.observations,
            this.housingInformations,
            this.canIsolate,
            this.hostConditions,
            this.isTemporary,
            this.situation,

            this.referent?.toEntity(),
            this.isAvailable,
            this.hostFamilyKinds?.map((hostFamilyKind) => hostFamilyKind.toEntity()),
            this.animalRelations?.map((animalRelation) => animalRelation.toEntity())
        );
    }
}

export default HostFamilyDTO;
