import Animal from "../entities/Animal";

class AnimalDTO {
    id: number;
    name: string;
    species_id: number;
    icad: string;
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
    current_host_family_referent_id?: string;

    constructor(
        animal: any
    ) {
        this.id = animal.id;
        this.name = animal.name;
        this.species_id = animal.species_id;
        this.icad = animal.icad;
        this.sexe = animal.sexe;
        this.race = animal.race;
        this.birthdate = animal.birthdate?.substring(0, 10);
        this.entry_date = animal.entry_date?.substring(0, 10);
        this.distinctive_signs = animal.distinctive_signs;
        this.reason_for_care = animal.reason_for_care;
        this.place_of_care = animal.place_of_care;
        this.care_infos = animal.care_infos;
        this.exit_date = animal.exit_date?.substring(0, 10);
        this.exit_reason = animal.exit_reason;
        this.exit_infos = animal.exit_infos;
        this.death_date = animal.death_date?.substring(0, 10);
        this.death_reason = animal.death_reason;
        this.sterilised = animal.sterilised;
        this.first_vaccination_date = animal.first_vaccination_date?.substring(0, 10);
        this.second_vaccination_date = animal.second_vaccination_date?.substring(0,10);
        this.fiv_negative = animal.fiv_negative;
        this.felv_negative = animal.felv_negative;
        this.health_issues = animal.health_issues;
        this.behaviour = animal.behaviour;
        this.adopted = animal.adopted;
        this.broadcastable = animal.broadcastable;
        this.bookable = animal.bookable;
        this.need_external_access = animal.need_external_access;
        this.transferor = animal.transferor;
        this.anti_parasitic_date = animal.anti_parasitic_date?.substring(0, 10);
        this.transfer_certificate = animal.transfer_certificate;
        this.reserved = animal.reserved;
        this.need_icad_duplicate = animal.need_icad_duplicate;
        this.current_host_family_id = animal.current_host_family_id;
        this.current_host_family_referent_id = animal.current_host_family_referent_id;
    }

    toEntity(): Animal {
        let animal = new Animal(
            this.id,
            this.name,
            this.species_id,
            this.entry_date,
            this.icad,
            this.sexe,
            this.race,
            this.birthdate,
            this.distinctive_signs,
            this.reason_for_care,
            this.place_of_care,
            this.care_infos,
            this.exit_date,
            this.exit_reason,
            this.exit_infos,
            this.death_date,
            this.death_reason,
            this.sterilised,
            this.first_vaccination_date,
            this.second_vaccination_date,
            this.fiv_negative,
            this.felv_negative,
            this.health_issues,
            this.behaviour,
            this.adopted,
            this.broadcastable,
            this.bookable,
            this.need_external_access,
            this.transferor,
            this.anti_parasitic_date,
            this.transfer_certificate,
            this.reserved,
            this.need_icad_duplicate,
            this.current_host_family_id,
            this.current_host_family_referent_id !== undefined ? parseInt(this.current_host_family_referent_id) : undefined
        );

        return animal;
    }
}

export default AnimalDTO;
