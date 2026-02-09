import HostFamilyKind from "../entities/HostFamilyKind";
import Species from "../entities/Species";

class HostFamilyKindDTO {
    id: number;
    name: string;
    species: Species;

    static copy(hfk: HostFamilyKindDTO): HostFamilyKindDTO {
        return new HostFamilyKindDTO(hfk);
    }

    constructor(hostFamilyKind: any) {
        this.id = hostFamilyKind.id;
        this.name = hostFamilyKind.name;
        this.species = hostFamilyKind.species;
    }

    toEntity(): HostFamilyKind {
        return new HostFamilyKind(this.id, this.name, this.species);
    }
}

export default HostFamilyKindDTO;
