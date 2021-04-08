import { Role } from './role.enum'

export class User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    role: Role;
    token?: string;

    constructor(
        id: number,
        firstName: string,
        lastName: string,
        username: string,
        role: Role,
        token?: string
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.role = role;
        this.token = token;
    }
}
