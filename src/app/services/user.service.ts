import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@enviroment';
import * as moment from 'moment';
import { Moment } from 'moment';

export interface UserRole {
  code: string;
  name: string;
}

export interface UserBase {
  id: number;
  login: string;
  password?: string;

  first_name: string;
  surname: string;
  patronymic?: string;
  birthdate?: Moment;
  address?: string;
  phone?: string;
  email?: string;
  blocked: boolean;
}

export interface User extends UserBase {
  role: UserRole;
}

export interface UserPost extends UserBase {
  role: string;
}

export interface Users {
  users: User[];
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Users>(`${environment.apiUrl}/users`);
  }

  get(id: number) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  post(user: UserPost) {
    return this.http.post<User>(`${environment.apiUrl}/users`, {
      ...user,
      birthdate: user.birthdate
        ? moment(user.birthdate).format('YYYY-MM-DD')
        : undefined,
    });
  }

  put(id: number, user: UserPost) {
    console.log(user.birthdate);
    console.log(typeof user.birthdate);
    return this.http.put<User>(`${environment.apiUrl}/users/${id}`, {
      ...user,
      birthdate: user.birthdate
        ? moment(user.birthdate).format('YYYY-MM-DD')
        : undefined,
    });
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
