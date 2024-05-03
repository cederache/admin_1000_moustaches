import DateObject from "./DateObject";
import Species from "./Species";

class Animal {
    id?: number;
    name?: string;
    species_id?: number;
    icad?: string;
    sexe?: string;
    race?: string;
    birthdate?: string;
    entry_date?: string;
    distinctive_signs?: string;
    reason_for_care?: string;
    place_of_care?: string;
    care_infos?: string;
    exit_date?: string;
    exit_reason?: string;
    exit_infos?: string;
    death_date?: string;
    death_reason?: string;
    sterilised?: boolean;
    first_vaccination_date?: string;
    second_vaccination_date?: string;
    fiv_negative?: boolean;
    felv_negative?: boolean;
    health_issues?: string;
    behaviour?: string;
    adopted?: boolean;
    broadcastable?: boolean;
    bookable?: boolean;
    need_external_access?: boolean;
    transferor?: string;
    anti_parasitic_date?: string;
    transfer_certificate?: boolean;
    reserved?: boolean;
    need_icad_duplicate?: string;
    current_host_family_id?: string;
    current_host_family_referent_id?: number;
    contract_sent?: boolean;
    album_created?: boolean;

    birthdateObject: DateObject;
    entry_dateObject: DateObject;
    exit_dateObject: DateObject;
    death_dateObject: DateObject;
    first_vaccination_dateObject: DateObject;
    second_vaccination_dateObject: DateObject;
    anti_parasitic_dateObject: DateObject;

    species_name?: string;

    static copy(animal: Animal): Animal {
        return new Animal(
            animal.id,
            animal.name,
            animal.species_id,
            animal.entry_date,
            animal.icad,
            animal.sexe,
            animal.race,
            animal.birthdate,
            animal.distinctive_signs,
            animal.reason_for_care,
            animal.place_of_care,
            animal.care_infos,
            animal.exit_date,
            animal.exit_reason,
            animal.exit_infos,
            animal.death_date,
            animal.death_reason,
            animal.sterilised,
            animal.first_vaccination_date,
            animal.second_vaccination_date,
            animal.fiv_negative,
            animal.felv_negative,
            animal.health_issues,
            animal.behaviour,
            animal.adopted,
            animal.broadcastable,
            animal.bookable,
            animal.need_external_access,
            animal.transferor,
            animal.anti_parasitic_date,
            animal.transfer_certificate,
            animal.reserved,
            animal.need_icad_duplicate,
            animal.current_host_family_id,
            animal.current_host_family_referent_id,
            animal.contract_sent,
            animal.album_created
        );
    }

    constructor(
        id?: number,
        name?: string,
        species_id?: number,
        entry_date?: string,
        icad?: string,
        sexe?: string,
        race?: string,
        birthdate?: string,
        distinctive_signs?: string,
        reason_for_care?: string,
        place_of_care?: string,
        care_infos?: string,
        exit_date?: string,
        exit_reason?: string,
        exit_infos?: string,
        death_date?: string,
        death_reason?: string,
        sterilised?: boolean,
        first_vaccination_date?: string,
        second_vaccination_date?: string,
        fiv_negative?: boolean,
        felv_negative?: boolean,
        health_issues?: string,
        behaviour?: string,
        adopted?: boolean,
        broadcastable?: boolean,
        bookable?: boolean,
        need_external_access?: boolean,
        transferor?: string,
        anti_parasitic_date?: string,
        transfer_certificate?: boolean,
        reserved?: boolean,
        need_icad_duplicate?: string,
        current_host_family_id?: string,
        current_host_family_referent_id?: number,
        contract_sent?: boolean,
        album_created?: boolean
    ) {
        this.id = id;
        this.name = name;
        this.species_id = species_id;
        this.icad = icad;
        this.sexe = sexe;
        this.race = race;
        this.birthdate = birthdate;
        this.entry_date = entry_date;
        this.distinctive_signs = distinctive_signs;
        this.reason_for_care = reason_for_care;
        this.place_of_care = place_of_care;
        this.care_infos = care_infos;
        this.exit_date = exit_date;
        this.exit_reason = exit_reason;
        this.exit_infos = exit_infos;
        this.death_date = death_date;
        this.death_reason = death_reason;
        this.sterilised = sterilised;
        this.first_vaccination_date = first_vaccination_date;
        this.second_vaccination_date = second_vaccination_date;
        this.fiv_negative = fiv_negative;
        this.felv_negative = felv_negative;
        this.health_issues = health_issues;
        this.behaviour = behaviour;
        this.adopted = adopted;
        this.broadcastable = broadcastable;
        this.bookable = bookable;
        this.need_external_access = need_external_access;
        this.transferor = transferor;
        this.anti_parasitic_date = anti_parasitic_date;
        this.transfer_certificate = transfer_certificate;
        this.reserved = reserved;
        this.need_icad_duplicate = need_icad_duplicate;
        this.current_host_family_id = current_host_family_id;
        this.current_host_family_referent_id = current_host_family_referent_id;
        this.contract_sent = contract_sent;
        this.album_created = album_created;

        this.birthdateObject = new DateObject();
        this.entry_dateObject = new DateObject();
        this.exit_dateObject = new DateObject();
        this.death_dateObject = new DateObject();
        this.first_vaccination_dateObject = new DateObject();
        this.second_vaccination_dateObject = new DateObject();
        this.anti_parasitic_dateObject = new DateObject();

        this.setBirthdate(this.birthdate);
        this.setEntryDate(this.entry_date);
        this.setExitDate(this.exit_date);
        this.setDeathDate(this.exit_date);
        this.setFirstVaccinationDate(this.first_vaccination_date);
        this.setSecondVaccinationDate(this.second_vaccination_date);
        this.setAntiParasiticDate(this.anti_parasitic_date);
    }

    setBirthdate = (date?: string) => {
        this.birthdate = date;
        this.birthdateObject.setDate(date);
    };

    setEntryDate = (date?: string) => {
        this.entry_date = date;
        this.entry_dateObject.setDate(date);
    };

    setExitDate = (date?: string) => {
        this.exit_date = date;
        this.exit_dateObject.setDate(date);
    };

    setDeathDate = (date?: string) => {
        this.death_date = date;
        this.death_dateObject.setDate(date);
    };

    setFirstVaccinationDate = (date?: string) => {
        this.first_vaccination_date = date;
        this.first_vaccination_dateObject.setDate(date);
    };

    setSecondVaccinationDate = (date?: string) => {
        this.second_vaccination_date = date;
        this.second_vaccination_dateObject.setDate(date);
    };

    setAntiParasiticDate = (date?: string) => {
        this.anti_parasitic_date = date;
        this.anti_parasitic_dateObject.setDate(date);
    };

    setSpecies = (species: Species) => {
        this.species_id = species.id;
        this.species_name = species.name;
    };
}

export default Animal;
