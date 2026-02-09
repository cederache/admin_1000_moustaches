import Species from "./Species";

class HostFamilyKind {
    id: number;
    name: string;
    species: Species;

    static copy(hfk: HostFamilyKind): HostFamilyKind {
        return new HostFamilyKind(hfk.id, hfk.name, hfk.species);
    }

    constructor(id: number, name: string, species: Species) {
        this.id = id;
        this.name = name;
        this.species = species;
    }
}

export default HostFamilyKind;
