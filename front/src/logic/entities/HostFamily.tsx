import HostFamilyKind from "./HostFamilyKind";

class HostFamily {
    id?: number;
    name?: string;
    firstname?: string;
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
    on_break?: boolean;
    membership_up_to_date?: boolean;
    referent_id?: number;
    is_temporary?: boolean;

    displayName: string;

    kinds: HostFamilyKind[] = [];

    static copy(hf: HostFamily): HostFamily {
        return new HostFamily(
            hf.id,
            hf.name,
            hf.firstname,
            hf.on_break,
            hf.membership_up_to_date,
            hf.phone,
            hf.mail,
            hf.social_network_alias,
            hf.address,
            hf.latitude,
            hf.longitude,
            hf.driver_license,
            hf.has_vehicule,
            hf.nb_children,
            hf.children_infos,
            hf.animals_infos,
            hf.can_provide_veterinary_care,
            hf.can_provide_sociabilisation,
            hf.can_host_disable_animal,
            hf.can_provide_night_care,
            hf.observations,
            hf.housing_informations,
            hf.can_isolate,
            hf.host_conditions,
            hf.referent_id,
            hf.is_temporary,
            hf.kinds
        );
    }

    constructor(
        id?: number,
        name?: string,
        firstname?: string,
        on_break?: boolean,
        membership_up_to_date?: boolean,
        phone?: string,
        mail?: string,
        social_network_alias?: string,
        address?: string,
        latitude?: number,
        longitude?: number,
        driver_license?: boolean,
        has_vehicule?: boolean,
        nb_children?: number,
        children_infos?: string,
        animals_infos?: string,
        can_provide_veterinary_care?: boolean,
        can_provide_sociabilisation?: boolean,
        can_host_disable_animal?: boolean,
        can_provide_night_care?: boolean,
        observations?: string,
        housing_informations?: string,
        can_isolate?: boolean,
        host_conditions?: string,
        referent_id?: number,
        is_temporary?: boolean,
        kinds?: HostFamilyKind[]
    ) {
        this.id = id;
        this.name = name;
        this.firstname = firstname;
        this.phone = phone;
        this.mail = mail;
        this.social_network_alias = social_network_alias;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.driver_license = driver_license;
        this.has_vehicule = has_vehicule;
        this.nb_children = nb_children;
        this.children_infos = children_infos;
        this.animals_infos = animals_infos;
        this.can_provide_veterinary_care = can_provide_veterinary_care;
        this.can_provide_sociabilisation = can_provide_sociabilisation;
        this.can_host_disable_animal = can_host_disable_animal;
        this.can_provide_night_care = can_provide_night_care;
        this.observations = observations;
        this.housing_informations = housing_informations;
        this.can_isolate = can_isolate;
        this.host_conditions = host_conditions;
        this.on_break = on_break;
        this.membership_up_to_date = membership_up_to_date;
        this.referent_id = referent_id;
        this.is_temporary = is_temporary;

        this.displayName = this.firstname + " " + this.name;

        this.kinds = kinds ?? [];
    }
}

export default HostFamily;
