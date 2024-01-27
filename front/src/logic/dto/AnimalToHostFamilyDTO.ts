import AnimalToHostFamily from "../entities/AnimalToHostFamily";

class AnimalToHostFamilyDTO {
    animal_id: number;
    animal_name: string;
    host_family_id: number;
    entry_date: string;
    exit_date: string;

    constructor(animalToHostFamily: any) {
        console.log(animalToHostFamily);
        this.animal_id = animalToHostFamily.animal_id;
        this.animal_name = animalToHostFamily.animal_name;
        this.host_family_id = animalToHostFamily.host_family_id;
        this.entry_date = animalToHostFamily.entry_date?.substring(0, 10);
        this.exit_date = animalToHostFamily.exit_date?.substring(0, 10);
    }

    toEntity(): AnimalToHostFamily {
        return new AnimalToHostFamily(this.animal_id, this.animal_name, this.host_family_id, this.entry_date, this.exit_date);
    }
}

export default AnimalToHostFamilyDTO;