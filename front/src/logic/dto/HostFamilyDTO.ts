import HostFamily from "../entities/HostFamily";

class HostFamilyDTO {
    id: number;
    name: string;
    firstname: string;
    phone?: string;
    mail?: string;
    social_network_alias?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    driver_license?: boolean;
    has_vehicule?: boolean;
    nb_children?: number;
    children_infos?: string;
    animals_infos?: string;
    can_provide_veterinary_care?: boolean;
    can_provide_sociabilisation?: boolean;
    can_host_disable_animal?: boolean;
    can_provide_night_care?: boolean;
    observations?: string;
    housing_informations?: string;
    can_isolate?: boolean;
    host_conditions?: string;
    on_break: number;
    membership_up_to_date: number;
    referent_id?: number;
    is_temporary: number;

    constructor(hostFamily: any) {
        this.id = hostFamily.id;
        this.name = hostFamily.name;
        this.firstname = hostFamily.firstname;
        this.phone = hostFamily.phone;
        this.mail = hostFamily.mail;
        this.social_network_alias = hostFamily.social_network_alias;
        this.address = hostFamily.address;
        this.latitude = hostFamily.latitude;
        this.longitude = hostFamily.longitude;
        this.driver_license = hostFamily.driver_license;
        this.has_vehicule = hostFamily.has_vehicule;
        this.nb_children = hostFamily.nb_children;
        this.children_infos = hostFamily.children_infos;
        this.animals_infos = hostFamily.animals_infos;
        this.can_provide_veterinary_care = hostFamily.can_provide_veterinary_care;
        this.can_provide_sociabilisation = hostFamily.can_provide_sociabilisation;
        this.can_host_disable_animal = hostFamily.can_host_disable_animal;
        this.can_provide_night_care = hostFamily.can_provide_night_care;
        this.observations = hostFamily.observations;
        this.housing_informations = hostFamily.housing_informations;
        this.can_isolate = hostFamily.can_isolate;
        this.host_conditions = hostFamily.host_conditions;
        this.on_break = hostFamily.on_break;
        this.membership_up_to_date = hostFamily.membership_up_to_date;
        this.referent_id = hostFamily.referent_id;
        this.is_temporary = hostFamily.is_temporary;
    }

    toEntity(): HostFamily {
        return {
            id: this.id,
            name: this.name,
            firstname: this.firstname,
            phone: this.phone,
            mail: this.mail,
            social_network_alias: this.social_network_alias,
            address: this.address,
            latitude: this.latitude,
            longitude: this.longitude,
            driver_license: this.driver_license,
            has_vehicule: this.has_vehicule,
            nb_children: this.nb_children,
            children_infos: this.children_infos,
            animals_infos: this.animals_infos,
            can_provide_veterinary_care: this.can_provide_veterinary_care,
            can_provide_sociabilisation: this.can_provide_sociabilisation,
            can_host_disable_animal: this.can_host_disable_animal,
            can_provide_night_care: this.can_provide_night_care,
            observations: this.observations,
            housing_informations: this.housing_informations,
            can_isolate: this.can_isolate,
            host_conditions: this.host_conditions,
            on_break: this.on_break === 1,
            membership_up_to_date: this.membership_up_to_date === 1,
            referent_id: this.referent_id,
            is_temporary: this.is_temporary === 1,
            displayName: this.firstname + " " + this.name,
            kinds: [],
        };
    }
}

export default HostFamilyDTO;
