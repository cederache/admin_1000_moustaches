import type { NullableBoolean } from "../types";
import Veterinarian from "../entities/Veterinarian";

class VeterinarianDTO {
    id: number;
    name: string;
    address: string;
    phone: string;
    mail: string;
    website: string;
    priceLevel: number;
    emergencies?: NullableBoolean;
    appointmentConfirmationProcedure: string;
    invoicePaymentDate: string;
    paymentMethod: string;
    latitude: number;
    longitude: number;

    constructor(vet: any) {
        this.id = vet.id;
        this.name = vet.name;
        this.address = vet.address;
        this.phone = vet.phone;
        this.mail = vet.mail;
        this.website = vet.website;
        this.priceLevel = vet.priceLevel;
        this.emergencies = vet.emergencies;
        this.appointmentConfirmationProcedure =
            vet.appointmentConfirmationProcedure;
        this.invoicePaymentDate = vet.invoicePaymentDate;
        this.paymentMethod = vet.paymentMethod;
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
            this.emergencies,
            this.appointmentConfirmationProcedure,
            this.invoicePaymentDate,
            this.paymentMethod,
            this.priceLevel
        );

        switch (this.priceLevel) {
            case 0:
                vet.priceLevelText = "€";
                vet.priceLevelTooltip = "Pas cher";
                break;
            case 1:
                vet.priceLevelText = "€€";
                vet.priceLevelTooltip = "Cher";
                break;
            case 2:
                vet.priceLevelText = "€€€";
                vet.priceLevelTooltip = "Trop cher";
                break;
            default:
                vet.priceLevelText = null;
                vet.priceLevelTooltip = "Ne sait pas";
                break;
        }
        return vet;
    }
}

export default VeterinarianDTO;