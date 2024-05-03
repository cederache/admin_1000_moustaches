import moment from "moment";

class DateObject {
    readable?: string;
    input?: string;

    constructor(readable?: string, input?: string) {
        this.readable = readable
        this.input = input;
    }

    setDate = (rawValue?: string) => {
        this.readable =
            rawValue !== undefined
                ? moment(rawValue).format("DD/MM/YYYY")
                : undefined;
        this.input =
            rawValue !== undefined
                ? moment(rawValue).format("YYYY-MM-DD")
                : undefined;
    }
}

export default DateObject;