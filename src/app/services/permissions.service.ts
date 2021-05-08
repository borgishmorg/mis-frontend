import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@enviroment';

export interface Permission {
  code: string;
  name: string;
}

export interface Permissions {
  permissions: Permission[];
}

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<Permissions>(`${environment.apiUrl}/permissions`);
  }
}
