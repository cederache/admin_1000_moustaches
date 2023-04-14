import DateObject from "./DateObject";

class VeterinarianIntervention {
    id?: number;
    veterinarian_id?: number;
    date?: string;
    description?: string;
    animal_id?: number;

    dateObject: DateObject;

    static copy(vetInter: VeterinarianIntervention): VeterinarianIntervention {
        return new VeterinarianIntervention(vetInter.id, vetInter.veterinarian_id, vetInter.date, vetInter.description, vetInter.animal_id)
    }

    constructor(id?: number, veterinarian_id?: number, date?: string, description?: string, animal_id?: number) {
        this.id = id;
        this.veterinarian_id = veterinarian_id;
        this.date = date?.substring(0, 10);
        this.description = description;
        this.animal_id = animal_id;

        this.dateObject = new DateObject()
        this.setDate(this.date);
    }

    setDate = (date?: string) => {
        this.date = date;
        this.dateObject.setDate(date)
    }
}

export default VeterinarianIntervention;