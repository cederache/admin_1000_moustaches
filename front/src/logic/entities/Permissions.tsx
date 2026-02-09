class Permissions {
    ressource_name: Ressource;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;

    constructor(
        ressource_name: string,
        can_create: boolean,
        can_read: boolean,
        can_update: boolean,
        can_delete: boolean
    ) {
        this.ressource_name = Object.values(Ressource).map(r => r.toString()).includes(ressource_name) ? ressource_name as Ressource : Ressource.UNKNOWN;
        this.can_create = can_create;
        this.can_read = can_read;
        this.can_update = can_update;
        this.can_delete = can_delete;
    }

}

export enum Ressource {
    PET_LIST = "pet_list",
    PET_INFO = "pet_info",
    PET_PICKUP = "pet_pickup",
    PET_HEALTH = "pet_health",
    PET_BEHAVIOR = "pet_behavior",
    PET_DIFFUSION = "pet_diffusion",
    PET_EXIT = "pet_exit",
    PET_DEATH = "pet_death",
    PET_HIST_VETO = "pet_hist_veto",
    PET_HIST_HF = "pet_hist_hf",
    HF_LIST = "hf_list",
    HF_CONTACT = "hf_contact",
    HF_ADDRESS = "hf_address",
    HF_HOST = "hf_host",
    HF_HIST_PETS = "hf_hist_pets",
    VET_LIST = "vet_list",
    VET_INFO = "vet_info",
    CARD_ANIMALS_NON_ADOPTED = "card_animals_non_adopted",
    CARD_ANIMALS_ADOPTED = "card_animals_adopted",
    CARD_HOST_FAMILIES_AVAILABLE = "card_host_families_available",
    USER_LIST = "user_list",
    UNKNOWN = "unknown"
}

export default Permissions;
