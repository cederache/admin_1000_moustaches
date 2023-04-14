import Animal from "./Animal";
import DateObject from "./DateObject";
import HostFamily from "./HostFamily";

class AnimalToHostFamily {
    animal_id: number;
    host_family_id?: number;
    entry_date?: string;
    exit_date?: string;

    entry_dateObject: DateObject;
    exit_dateObject: DateObject;

    animal?: Animal;
    hostFamily?: HostFamily;

    static copy(athf: AnimalToHostFamily): AnimalToHostFamily {
        let newATHF = new AnimalToHostFamily(
            athf.animal_id,
            athf.host_family_id,
            athf.entry_date,
            athf.exit_date
        );
        newATHF.animal = athf.animal;
        newATHF.hostFamily = athf.hostFamily;
        return newATHF;
    }

    constructor(
        animal_id: number,
        host_family_id?: number,
        entry_date?: string,
        exit_date?: string
    ) {
        this.animal_id = animal_id;
        this.host_family_id = host_family_id;
        this.entry_date = entry_date?.substring(0, 10);
        this.exit_date = exit_date?.substring(0, 10);

        this.entry_dateObject = new DateObject();
        this.setEntryDate(this.entry_date);

        this.exit_dateObject = new DateObject();
        this.setExitDate(this.exit_date);
    }

    setEntryDate = (date?: string) => {
        this.entry_date = date;
        this.entry_dateObject.setDate(date);
    };

    setExitDate = (date?: string) => {
        this.exit_date = date;
        this.exit_dateObject?.setDate(date);
    };
}

export default AnimalToHostFamily;
