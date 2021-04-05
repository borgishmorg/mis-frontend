import { Role } from './role.enum'

export class User {
    id!: number;
    firstName!: string;
    lastName!: string;
    username!: string;
    role!: Role;
    token?: string;
}
