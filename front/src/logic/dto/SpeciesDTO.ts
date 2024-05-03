import Species from "../entities/Species";

class SpeciesDTO {
    id: number;
    name: string;

    constructor(species: any) {
        this.id = species.id;
        this.name = species.name;
    }

    toEntity(): Species {
        return {
            id: this.id,
            name: this.name
        };
    }
}

export default SpeciesDTO;