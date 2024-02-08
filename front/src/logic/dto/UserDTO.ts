import User from "../entities/User";

class UserDTO {
    id: number;
    name: string;
    firstname: string;
    email: string;
    is_referent: number;

    constructor(user: any) {
        this.id = user.id;
        this.name = user.name;
        this.firstname = user.firstname;
        this.email = user.email;
        this.is_referent = user.is_referent;
    }

    toEntity(): User {
        return new User(
            this.id,
            this.name,
            this.firstname,
            this.email,
            this.is_referent === 1
        );
    }
}

export default UserDTO;