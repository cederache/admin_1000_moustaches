class User {
    id: number;
    name: string;
    firstname: string;
    email: string;
    is_referent: boolean;
    displayName: string;

    constructor(
        id: number = -1,
        name: string = "",
        firstname: string = "",
        email: string = "",
        is_referent: boolean = false
    ) {
        this.id = id;
        this.name = name;
        this.firstname = firstname;
        this.email = email;
        this.is_referent = is_referent;
        this.displayName = name + " " + firstname;
    }
}

export default User;
