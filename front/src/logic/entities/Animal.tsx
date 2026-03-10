import type { NullableBoolean } from "../types";
import AnimalToHostFamily from "./AnimalToHostFamily";
import DateObject from "./DateObject";
import Species from "./Species";
import VeterinarianIntervention from "./VeterinarianIntervention";

class Animal {
    id?: number;
    name?: string;
    species?: Species;
    icad?: string;
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
    currentHostFamilyReferentId?: number;
    contractSent?: NullableBoolean;
    albumCreated?: NullableBoolean;
    hostFamilyRelations?: AnimalToHostFamily[];
    veterinarianInterventions?: VeterinarianIntervention[];

    birthdateObject: DateObject;
    entryDateObject: DateObject;
    exitDateObject: DateObject;
    deathDateObject: DateObject;
    firstVaccinationDateObject: DateObject;
    secondVaccinationDateObject: DateObject;
    antiParasiticDateObject: DateObject;

    static copy(animal: Animal): Animal {
        return new Animal(
            animal.id,
            animal.name,
            animal.species,
            animal.entryDate,
            animal.icad,
            animal.sexe,
            animal.race,
            animal.birthdate,
            animal.distinctiveSigns,
            animal.reasonForCare,
            animal.placeOfCare,
            animal.careInfos,
            animal.exitDate,
            animal.exitReason,
            animal.exitInfos,
            animal.deathDate,
            animal.deathReason,
            animal.sterilised,
            animal.firstVaccinationDate,
            animal.secondVaccinationDate,
            animal.fivNegative,
            animal.felvNegative,
            animal.healthIssues,
            animal.behaviour,
            animal.needFriends,
            animal.posture,
            animal.catsOk,
            animal.dogsOk,
            animal.kidsOk,
            animal.behaviorParticularity,
            animal.adopted,
            animal.broadcastable,
            animal.bookable,
            animal.needExternalAccess,
            animal.transferor,
            animal.antiParasiticDate,
            animal.transferCertificate,
            animal.reserved,
            animal.needIcadDuplicate,
            animal.currentHostFamilyId,
            animal.currentHostFamilyReferentId,
            animal.contractSent,
            animal.albumCreated,
            animal.hostFamilyRelations,
            animal.veterinarianInterventions
        );
    }

    constructor(
        id?: number,
        name?: string,
        species?: Species,
        entryDate?: string,
        icad?: string,
        sexe?: string,
        race?: string,
        birthdate?: string,
        distinctiveSigns?: string,
        reasonForCare?: string,
        placeOfCare?: string,
        careInfos?: string,
        exitDate?: string,
        exitReason?: string,
        exitInfos?: string,
        deathDate?: string,
        deathReason?: string,
        sterilised?: NullableBoolean,
        firstVaccinationDate?: string,
        secondVaccinationDate?: string,
        fivNegative?: NullableBoolean,
        felvNegative?: NullableBoolean,
        healthIssues?: string,
        behaviour?: string,
        needFriends?: NullableBoolean,
        posture?: string,
        catsOk?: NullableBoolean,
        dogsOk?: NullableBoolean,
        kidsOk?: NullableBoolean,
        behaviorParticularity?: string,
        adopted?: NullableBoolean,
        broadcastable?: NullableBoolean,
        bookable?: NullableBoolean,
        needExternalAccess?: NullableBoolean,
        transferor?: string,
        antiParasiticDate?: string,
        transferCertificate?: NullableBoolean,
        reserved?: NullableBoolean,
        needIcadDuplicate?: string,
        currentHostFamilyId?: string,
        currentHostFamilyReferentId?: number,
        contractSent?: NullableBoolean,
        albumCreated?: NullableBoolean,
        hostFamilyRelations?: AnimalToHostFamily[],
        veterinarianInterventions?: VeterinarianIntervention[]
    ) {
        this.id = id;
        this.name = name;
        this.species = species;
        this.icad = icad;
        this.sexe = sexe;
        this.race = race;
        this.birthdate = birthdate;
        this.entryDate = entryDate;
        this.distinctiveSigns = distinctiveSigns;
        this.reasonForCare = reasonForCare;
        this.placeOfCare = placeOfCare;
        this.careInfos = careInfos;
        this.exitDate = exitDate;
        this.exitReason = exitReason;
        this.exitInfos = exitInfos;
        this.deathDate = deathDate;
        this.deathReason = deathReason;
        this.sterilised = sterilised;
        this.firstVaccinationDate = firstVaccinationDate;
        this.secondVaccinationDate = secondVaccinationDate;
        this.fivNegative = fivNegative;
        this.felvNegative = felvNegative;
        this.healthIssues = healthIssues;
        this.behaviour = behaviour;
        this.needFriends = needFriends;
        this.posture = posture;
        this.catsOk = catsOk;
        this.dogsOk = dogsOk;
        this.kidsOk = kidsOk;
        this.behaviorParticularity = behaviorParticularity;
        this.adopted = adopted;
        this.broadcastable = broadcastable;
        this.bookable = bookable;
        this.needExternalAccess = needExternalAccess;
        this.transferor = transferor;
        this.antiParasiticDate = antiParasiticDate;
        this.transferCertificate = transferCertificate;
        this.reserved = reserved;
        this.needIcadDuplicate = needIcadDuplicate;
        this.currentHostFamilyId = currentHostFamilyId;
        this.currentHostFamilyReferentId = currentHostFamilyReferentId;
        this.contractSent = contractSent;
        this.albumCreated = albumCreated;
        this.hostFamilyRelations = hostFamilyRelations;
        this.veterinarianInterventions = veterinarianInterventions;

        this.birthdateObject = new DateObject();
        this.entryDateObject = new DateObject();
        this.exitDateObject = new DateObject();
        this.deathDateObject = new DateObject();
        this.firstVaccinationDateObject = new DateObject();
        this.secondVaccinationDateObject = new DateObject();
        this.antiParasiticDateObject = new DateObject();

        this.setBirthdate(this.birthdate);
        this.setEntryDate(this.entryDate);
        this.setExitDate(this.exitDate);
        this.setDeathDate(this.deathDate);
        this.setFirstVaccinationDate(this.firstVaccinationDate);
        this.setSecondVaccinationDate(this.secondVaccinationDate);
        this.setAntiParasiticDate(this.antiParasiticDate);
    }

    setBirthdate = (date?: string) => {
        this.birthdate = date;
        this.birthdateObject.setDate(date);
    };

    setEntryDate = (date?: string) => {
        this.entryDate = date;
        this.entryDateObject.setDate(date);
    };

    setExitDate = (date?: string) => {
        this.exitDate = date;
        this.exitDateObject.setDate(date);
    };

    setDeathDate = (date?: string) => {
        this.deathDate = date;
        this.deathDateObject.setDate(date);
    };

    setFirstVaccinationDate = (date?: string) => {
        this.firstVaccinationDate = date;
        this.firstVaccinationDateObject.setDate(date);
    };

    setSecondVaccinationDate = (date?: string) => {
        this.secondVaccinationDate = date;
        this.secondVaccinationDateObject.setDate(date);
    };

    setAntiParasiticDate = (date?: string) => {
        this.antiParasiticDate = date;
        this.antiParasiticDateObject.setDate(date);
    };

    setSpecies = (species: Species) => {
        this.species = species;
    };
}

export default Animal;
