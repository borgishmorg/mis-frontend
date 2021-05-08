import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@enviroment';
import { Permission } from '@services/permissions.service'

export interface Role {
  code: string;
  name: string;
  permissions: Permission[];
}

export interface Roles {
  roles: Role[];
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  get(code: string) {
    return this.http.get<Role>(`${environment.apiUrl}/roles/${code}`);
  }
  
  getAll() {
    return this.http.get<Roles>(`${environment.apiUrl}/roles`);
  }
  
  post(code: string, role: Role) {
    return this.http.post(`${environment.apiUrl}/roles/${code}`, role);
  }
  
  put(code: string, role: Role) {
    return this.http.put(`${environment.apiUrl}/roles/${code}`, role);
  }
}
