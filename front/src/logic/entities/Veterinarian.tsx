import DateObject from "./DateObject";

class Veterinarian {
    id?: number;
    name?: string;
    phone?: string;
    mail?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    emergencies?: boolean;
    appointment_confirmation_procedure?: string;
    invoice_payment_date?: string;
    payment_method?: string;
    price_level?: number;

    price_level_text?: string | null;
    price_level_tooltip?: string | null;

    invoice_payment_dateObject: DateObject;

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
            vet.appointment_confirmation_procedure,
            vet.invoice_payment_date,
            vet.payment_method,
            vet.price_level
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
        emergencies?: boolean,
        appointment_confirmation_procedure?: string,
        invoice_payment_date?: string,
        payment_method?: string,
        price_level?: number
    ) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.mail = mail;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.emergencies = emergencies;
        this.appointment_confirmation_procedure =
            appointment_confirmation_procedure;
        this.invoice_payment_date = invoice_payment_date?.substring(0, 10);
        this.payment_method = payment_method;
        this.price_level = price_level;

        this.invoice_payment_dateObject = new DateObject();
        this.setInvoicePaymentDate(this.invoice_payment_date);
    }

    setInvoicePaymentDate = (date?: string) => {
        this.invoice_payment_date = date;
        this.invoice_payment_dateObject.setDate(date);
    };
}

export default Veterinarian;
