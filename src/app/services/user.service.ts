import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@enviroment';
import { User, Users } from '@app/models';


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
}
