import type { NullableBoolean } from "../types";
import VeterinarianDTO from "../dto/VeterinarianDTO";
import DateObject from "./DateObject";

class Veterinarian {
    id?: number;
    name?: string;
    phone?: string;
    mail?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    emergencies?: NullableBoolean;
    appointmentConfirmationProcedure?: string;
    invoicePaymentDate?: string;
    paymentMethod?: string;
    priceLevel?: number;

    priceLevelText?: string | null;
    priceLevelTooltip?: string | null;

    invoicePaymentDateObject: DateObject;

    static copy(vet: Veterinarian): Veterinarian {
        return new Veterinarian(
            vet.id,
            vet.name,
            vet.phone,
            vet.mail,
            vet.address,
            vet.latitude,
            vet.longitude,
            vet.emergencies,
            vet.appointmentConfirmationProcedure,
            vet.invoicePaymentDate,
            vet.paymentMethod,
            vet.priceLevel
        );
    }

    constructor(
        id?: number,
        name?: string,
        phone?: string,
        mail?: string,
        address?: string,
        latitude?: number,
        longitude?: number,
        emergencies?: NullableBoolean,
        appointmentConfirmationProcedure?: string,
        invoicePaymentDate?: string,
        paymentMethod?: string,
        priceLevel?: number
    ) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.mail = mail;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.emergencies = emergencies;
        this.appointmentConfirmationProcedure = appointmentConfirmationProcedure;
        this.invoicePaymentDate = invoicePaymentDate?.substring(0, 10);
        this.paymentMethod = paymentMethod;
        this.priceLevel = priceLevel;

        this.invoicePaymentDateObject = new DateObject();
        this.setInvoicePaymentDate(this.invoicePaymentDate);
    }

    setInvoicePaymentDate = (date?: string) => {
        this.invoicePaymentDate = date;
        this.invoicePaymentDateObject.setDate(date);
    };
}

export default Veterinarian;
