import AnimalToHostFamily from "./AnimalToHostFamily";
import HostFamilyKind from "./HostFamilyKind";
import User from "./User";

class HostFamily {
    id?: number;
    name?: string;
    firstname?: string;
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
    onBreak?: boolean;
    membershipUpToDate?: boolean;
    isTemporary?: boolean;
    situation?: string;
    isAvailable?: boolean;

    referent?: User;
    hostFamilyKinds?: HostFamilyKind[];
    animalToHostFamilies?: AnimalToHostFamily[];

    displayName: string;

    static copy(hf: HostFamily): HostFamily {
        return new HostFamily(
            hf.id,
            hf.name,
            hf.firstname,
            hf.onBreak,
            hf.membershipUpToDate,
            hf.phone,
            hf.mail,
            hf.socialNetworkAlias,
            hf.address,
            hf.latitude,
            hf.longitude,
            hf.driverLicense,
            hf.hasVehicule,
            hf.nbChildren,
            hf.childrenInfos,
            hf.animalsInfos,
            hf.canProvideVeterinaryCare,
            hf.canProvideSociabilisation,
            hf.canHostDisableAnimal,
            hf.canProvideNightCare,
            hf.observations,
            hf.housingInformations,
            hf.canIsolate,
            hf.hostConditions,
            hf.isTemporary,
            hf.situation,
            hf.referent,
            hf.isAvailable,
            hf.hostFamilyKinds,
            hf.animalToHostFamilies
        );
    }

    constructor(
        id?: number,
        name?: string,
        firstname?: string,
        onBreak?: boolean,
        membershipUpToDate?: boolean,
        phone?: string,
        mail?: string,
        socialNetworkAlias?: string,
        address?: string,
        latitude?: number,
        longitude?: number,
        driverLicense?: boolean,
        hasVehicule?: boolean,
        nbChildren?: number,
        childrenInfos?: string,
        animalsInfos?: string,
        canProvideVeterinaryCare?: boolean,
        canProvideSociabilisation?: boolean,
        canHostDisableAnimal?: boolean,
        canProvideNightCare?: boolean,
        observations?: string,
        housingInformations?: string,
        canIsolate?: boolean,
        hostConditions?: string,
        isTemporary?: boolean,
        situation?: string,
        referent?: User,
        isAvailable?: boolean,
        hostFamilyKinds?: HostFamilyKind[],
        animalToHostFamilies?: AnimalToHostFamily[]
    ) {
        this.id = id;
        this.name = name;
        this.firstname = firstname;
        this.phone = phone;
        this.mail = mail;
        this.socialNetworkAlias = socialNetworkAlias;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.driverLicense = driverLicense;
        this.hasVehicule = hasVehicule;
        this.nbChildren = nbChildren;
        this.childrenInfos = childrenInfos;
        this.animalsInfos = animalsInfos;
        this.canProvideVeterinaryCare = canProvideVeterinaryCare;
        this.canProvideSociabilisation = canProvideSociabilisation;
        this.canHostDisableAnimal = canHostDisableAnimal;
        this.canProvideNightCare = canProvideNightCare;
        this.observations = observations;
        this.housingInformations = housingInformations;
        this.canIsolate = canIsolate;
        this.hostConditions = hostConditions;
        this.onBreak = onBreak;
        this.membershipUpToDate = membershipUpToDate;
        this.isTemporary = isTemporary;
        this.situation = situation;
        this.isAvailable = isAvailable;

        this.referent = referent;
        this.hostFamilyKinds = hostFamilyKinds ?? [];
        this.animalToHostFamilies = animalToHostFamilies ?? [];

        this.displayName = this.firstname + " " + this.name;
    }
}

export default HostFamily;
