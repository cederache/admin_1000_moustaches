import type { NullableBoolean } from "../types";
import Animal from "../entities/Animal";
import Species from "../entities/Species";
import AnimalToHostFamilyDTO from "./AnimalToHostFamilyDTO";
import SpeciesDTO from "./SpeciesDTO";

class AnimalDTO {
    id: number;
    name: string;
    species?: SpeciesDTO;
    icad: string;
    sexe?: string;
    race?: string;
    birthdate?: string;
    entryDate?: string;
    distinctiveSigns?: string;
    reasonForCare?: string;
    placeOfCare?: string;
    careInfos?: string;
    exitDate?: string;
    exitReason?: string;
    exitInfos?: string;
    deathDate?: string;
    deathReason?: string;
    sterilised?: NullableBoolean;
    firstVaccinationDate?: string;
    secondVaccinationDate?: string;
    fivNegative?: NullableBoolean;
    felvNegative?: NullableBoolean;
    healthIssues?: string;
    behaviour?: string;
    needFriends?: NullableBoolean;
    posture?: string;
    catsOk?: NullableBoolean;
    dogsOk?: NullableBoolean;
    kidsOk?: NullableBoolean;
    behaviorParticularity?: string;
    adopted?: NullableBoolean;
    broadcastable?: NullableBoolean;
    bookable?: NullableBoolean;
    needExternalAccess?: NullableBoolean;
    transferor?: string;
    antiParasiticDate?: string;
    transferCertificate?: NullableBoolean;
    reserved?: NullableBoolean;
    needIcadDuplicate?: string;
    currentHostFamilyId?: string;
    currentHostFamilyReferentId?: string;
    contractSent?: NullableBoolean;
    albumCreated?: NullableBoolean;
    hostFamilyRelations?: AnimalToHostFamilyDTO[];

    constructor(
        animal: any
    ) {
        this.id = animal.id;
        this.name = animal.name;
        this.species = !!animal.species ? new SpeciesDTO(animal.species) : undefined;
        this.icad = animal.icad;
        this.sexe = animal.sexe;
        this.race = animal.race;
        this.birthdate = animal.birthdate?.substring(0, 10);
        this.entryDate = animal.entryDate?.substring(0, 10);
        this.distinctiveSigns = animal.distinctiveSigns;
        this.reasonForCare = animal.reasonForCare;
        this.placeOfCare = animal.placeOfCare;
        this.careInfos = animal.careInfos;
        this.exitDate = animal.exitDate?.substring(0, 10);
        this.exitReason = animal.exitReason;
        this.exitInfos = animal.exitInfos;
        this.deathDate = animal.deathDate?.substring(0, 10);
        this.deathReason = animal.deathReason;
        this.sterilised = animal.sterilised;
        this.firstVaccinationDate = animal.firstVaccinationDate?.substring(0, 10);
        this.secondVaccinationDate = animal.secondVaccinationDate?.substring(0, 10);
        this.fivNegative = animal.fivNegative;
        this.felvNegative = animal.felvNegative;
        this.healthIssues = animal.healthIssues;
        this.behaviour = animal.behaviour;
        this.needFriends = animal.needFriends;
        this.posture = animal.posture;
        this.catsOk = animal.catsOk
        this.dogsOk = animal.dogsOk;
        this.kidsOk = animal.kidsOk;
        this.behaviorParticularity = animal.behaviorParticularity;
        this.adopted = animal.adopted;
        this.broadcastable = animal.broadcastable;
        this.bookable = animal.bookable;
        this.needExternalAccess = animal.needExternalAccess;
        this.transferor = animal.transferor;
        this.antiParasiticDate = animal.antiParasiticDate?.substring(0, 10);
        this.transferCertificate = animal.transferCertificate;
        this.reserved = animal.reserved;
        this.needIcadDuplicate = animal.needIcadDuplicate;
        this.currentHostFamilyId = animal.currentHostFamilyId;
        this.currentHostFamilyReferentId = animal.currentHostFamilyReferentId;
        this.contractSent = animal.contractSent;
        this.albumCreated = animal.albumCreated;
        this.hostFamilyRelations = animal.hostFamilyRelations?.map((hostFamilyRelation: any) => new AnimalToHostFamilyDTO(hostFamilyRelation, this));
    }

    toEntity(): Animal {
        let animal = new Animal(
            this.id,
            this.name,
            this.species?.toEntity(),
            this.entryDate,
            this.icad,
            this.sexe,
            this.race,
            this.birthdate,
            this.distinctiveSigns,
            this.reasonForCare,
            this.placeOfCare,
            this.careInfos,
            this.exitDate,
            this.exitReason,
            this.exitInfos,
            this.deathDate,
            this.deathReason,
            this.sterilised,
            this.firstVaccinationDate,
            this.secondVaccinationDate,
            this.fivNegative,
            this.felvNegative,
            this.healthIssues,
            this.behaviour,
            this.needFriends,
            this.posture,
            this.catsOk,
            this.dogsOk,
            this.kidsOk,
            this.behaviorParticularity,
            this.adopted,
            this.broadcastable,
            this.bookable,
            this.needExternalAccess,
            this.transferor,
            this.antiParasiticDate,
            this.transferCertificate,
            this.reserved,
            this.needIcadDuplicate,
            this.currentHostFamilyId,
            this.currentHostFamilyReferentId !== undefined ? parseInt(this.currentHostFamilyReferentId) : undefined,
            this.contractSent,
            this.albumCreated
        );

        animal.hostFamilyRelations = this.hostFamilyRelations?.map((hostFamilyRelation) => hostFamilyRelation.toEntity(animal, undefined));

        return animal;
    }
}

export default AnimalDTO;
