class User {
    id?: number;
    name?: string;
    firstname?: string;
    email?: string;
    is_referent: boolean;

    constructor(id?: number, name?: string, firstname?: string, email?: string, is_referent?: boolean) {
        this.id = id;
        this.name = name;
        this.firstname = firstname;
        this.email = email;
        this.is_referent = is_referent || false;
    }

    displayName = () => {
        return (this.firstname || "") + (this.name || "")
    }
}

export default User;