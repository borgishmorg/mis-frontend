import { Role } from './role.enum'

export class User {
    id: number = -1;
    firstName: string = "";
    lastName: string = "";
    username: string = "";
    role: Role = Role.NoRole;
    token?: string;
}
