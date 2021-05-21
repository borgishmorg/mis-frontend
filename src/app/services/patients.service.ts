import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@enviroment';
import * as moment from 'moment';
import { Moment } from 'moment';

export enum Sex {
  NOT_KNOWN = 0,
  MALE = 1,
  FEMALE = 2,
  NOT_APPLICABLE = 9,
}

export interface PatientPost {
  first_name: string;
  surname: string;
  patronymic?: string;
  sex?: Sex;
  birthdate?: Moment;
  address?: string;
  phone?: string;
  email?: string;
}

export interface Patient extends PatientPost {
  id: number;
}

export interface Patients {
  patients: Patient[];
}

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Patients>(`${environment.apiUrl}/patients`);
  }

  get(id: number) {
    return this.http.get<Patient>(`${environment.apiUrl}/patients/${id}`);
  }

  post(patient: PatientPost) {
    return this.http.post<Patient>(`${environment.apiUrl}/patients`, {
      ...patient,
      birthdate: patient.birthdate
        ? moment(patient.birthdate).format('YYYY-MM-DD')
        : undefined,
    });
  }

  put(id: number, patient: PatientPost) {
    return this.http.put<Patient>(`${environment.apiUrl}/patients/${id}`, {
      ...patient,
      birthdate: patient.birthdate
        ? moment(patient.birthdate).format('YYYY-MM-DD')
        : undefined,
    });
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/patients/${id}`);
  }
}
