export interface Role {
  code: string;
  name: string;
}

export interface User {
  id: number;
  login: string;
  role: Role;
  permissions: string[];
}

export interface Users{
  users: User[];
}

export interface Tokens{
  user: User;
  access_token: string;
  refresh_token: string;
}