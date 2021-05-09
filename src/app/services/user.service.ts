import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@enviroment';

export interface UserRole {
  code: string;
  name: string;
}

export interface User {
  id: number;
  login: string;
  role: UserRole;
}

export interface UserPost {
  id: number;
  login: string;
  role: string;
}

export interface Users {
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Users>(`${environment.apiUrl}/users`);
  }

  get(id: number) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  post(user: UserPost) {

  }

  put(id: number, user: UserPost) {
    
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
