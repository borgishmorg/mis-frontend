export interface Role {
  code: string;
  name: string;
}

export interface User {
  id: number;
  login: string;
  role: Role;
}

export interface Users{
  users: User[];
}

export interface TokenUser extends User {
  permissions: string[];
}

export interface Tokens{
  user: TokenUser;
  access_token: string;
  refresh_token: string;
}
