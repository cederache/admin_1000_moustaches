import Veterinarian from "../entities/Veterinarian";

class VeterinarianDTO {
    id: number;
    name: string;
    address: string;
    phone: string;
    mail: string;
    website: string;
    price_level: number;
    emergencies: number;
    appointment_confirmation_procedure: string;
    invoice_payment_date: string;
    payment_method: string;
    latitude: number;
    longitude: number;

    constructor(vet: any) {
        this.id = vet.id;
        this.name = vet.name;
        this.address = vet.address;
        this.phone = vet.phone;
        this.mail = vet.mail;
        this.website = vet.website;
        this.price_level = vet.price_level;
        this.emergencies = vet.emergencies;
        this.appointment_confirmation_procedure =
            vet.appointment_confirmation_procedure;
        this.invoice_payment_date = vet.invoice_payment_date;
        this.payment_method = vet.payment_method;
        this.latitude = vet.latitude;
        this.longitude = vet.longitude;
    }

    toEntity(): Veterinarian {
        let vet = new Veterinarian(
            this.id,
            this.name,
            this.phone,
            this.mail,
            this.address,
            this.latitude,
            this.longitude,
            this.emergencies === 1,
            this.appointment_confirmation_procedure,
            this.invoice_payment_date,
            this.payment_method,
            this.price_level
        );

        switch (vet.price_level) {
            case 0:
                vet.price_level_text = "€";
                vet.price_level_tooltip = "Pas cher";
                break;
            case 1:
                vet.price_level_text = "€€";
                vet.price_level_tooltip = "Cher";
                break;
            case 2:
                vet.price_level_text = "€€€";
                vet.price_level_tooltip = "Trop cher";
                break;
            default:
                vet.price_level_text = null;
                vet.price_level_tooltip = "Ne sait pas";
                break;
        }
        return vet;
    }
}

export default VeterinarianDTO;